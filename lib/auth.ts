import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import type { Role } from '@/lib/permissions'
import { ROLES } from '@/lib/permissions'

const secretKey = process.env.JWT_SECRET
if (!secretKey) {
  throw new Error('FATAL: JWT_SECRET is not defined.')
}
const key = new TextEncoder().encode(secretKey)

const SESSION_COOKIE = 'auth_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 1 week

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1 week')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

/** Write the session JWT to the auth cookie with consistent flags. */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE)?.value
  if (!session) return null
  return await decrypt(session)
}

export async function verifySession() {
  const session = await getSession()
  return !!session
}

export type SessionWithOrg = {
  userId: string
  email: string
  name: string | null
  orgId: string
  orgSlug: string
  role: Role
}

/**
 * Get session with organization context, validated against the database.
 *
 * The JWT only proves who the user is and which org they last selected; the
 * membership (and therefore the role) is re-checked in the database on every
 * request so that removed members lose access immediately and role changes
 * take effect without waiting for the JWT to expire. Deduplicated per request
 * via React cache().
 *
 * Returns null if not authenticated, no org in the token, or the membership
 * no longer exists.
 */
export const getSessionWithOrg = cache(
  async (): Promise<SessionWithOrg | null> => {
    const session = await getSession()
    if (!session || !session.id || !session.orgId) return null

    // Imported lazily so proxy.ts (which only uses decrypt/getSession) does
    // not pull the Prisma client into its bundle.
    const { prisma } = await import('@/lib/prisma')

    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.id as string,
          organizationId: session.orgId as string,
        },
      },
      select: { role: true },
    })

    if (!membership) return null

    const role = (ROLES as readonly string[]).includes(membership.role)
      ? (membership.role as Role)
      : 'viewer'

    return {
      userId: session.id as string,
      email: session.email as string,
      name: (session.name as string) ?? null,
      orgId: session.orgId as string,
      orgSlug: session.orgSlug as string,
      role,
    }
  }
)

/**
 * Page-level guard: returns a validated org session or redirects.
 *
 * Unauthenticated users go to /login. Authenticated users whose org context
 * is missing or whose membership was revoked go to /setup-organization —
 * never /login, because the proxy bounces users with a valid JWT away from
 * /login and that would loop.
 */
export async function requireOrgSession(): Promise<SessionWithOrg> {
  const session = await getSessionWithOrg()
  if (session) return session

  const raw = await getSession()
  redirect(raw ? '/setup-organization' : '/login')
}
