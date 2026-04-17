import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { Role } from '@/lib/permissions'

const secretKey = process.env.JWT_SECRET
if (!secretKey) {
  throw new Error('FATAL: JWT_SECRET is not defined.')
}
const key = new TextEncoder().encode(secretKey)

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

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('auth_session')?.value
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

/** Get session with organization context. Returns null if not authenticated or no org. */
export async function getSessionWithOrg(): Promise<SessionWithOrg | null> {
  const session = await getSession()
  if (!session || !session.orgId) return null

  return {
    userId: session.id as string,
    email: session.email as string,
    name: (session.name as string) ?? null,
    orgId: session.orgId as string,
    orgSlug: session.orgSlug as string,
    role: session.role as Role,
  }
}
