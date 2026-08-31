'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt, getSession, setSessionCookie, clearSessionCookie } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

// Pre-computed hash of a throwaway password. Compared against when the email
// is unknown so that "no such user" and "wrong password" take the same time.
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8ZzP0R8gVQ8mS0uH6C1u1yG9c3mDCS'

/**
 * Only allow same-site path redirects. Rejects absolute URLs and
 * protocol-relative URLs ("//evil.com" starts with "/" but leaves the site).
 */
function safeRedirectPath(raw: FormDataEntryValue | null, fallback: string): string {
  if (typeof raw !== 'string') return fallback
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return fallback
  }
  return raw
}

export async function login(prevState: any, formData: FormData) {
  // Rate limiting: 5 attempts per minute per IP
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const isAllowed = checkRateLimit(`login:${ip}`, 5, 60 * 1000)

  if (!isAllowed) {
    return { message: 'Too many login attempts. Please try again in a minute.' }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Please enter both email and password' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always run a bcrypt compare so response timing does not reveal
    // whether the email exists.
    const passwordsMatch = await bcrypt.compare(password, user?.password ?? DUMMY_HASH)

    if (!user || !passwordsMatch) {
      return { message: 'Invalid credentials' }
    }

    // Look up the user's organization membership
    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { organization: { select: { id: true, slug: true } } },
      orderBy: { updatedAt: 'desc' },
    })

    // Build JWT payload with org context (if available)
    const sessionPayload: Record<string, unknown> = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    if (membership) {
      sessionPayload.orgId = membership.organization.id
      sessionPayload.orgSlug = membership.organization.slug
      sessionPayload.role = membership.role
    }

    const session = await encrypt(sessionPayload)
    await setSessionCookie(session)
  } catch (error) {
    console.error('Login error:', error)
    return { message: 'Something went wrong. Please try again.' }
  }

  redirect(safeRedirectPath(formData.get('redirect'), '/dashboard'))
}

export async function register(prevState: any, formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const isAllowed = checkRateLimit(`register:${ip}`, 5, 60 * 1000)

  if (!isAllowed) {
    return { message: 'Too many attempts. Please try again in a minute.' }
  }

  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!name || name.length < 2) {
    return { message: 'Name must be at least 2 characters.' }
  }

  if (name.length > 100) {
    return { message: 'Name must be at most 100 characters.' }
  }

  if (!email || !email.includes('@') || email.length > 254) {
    return { message: 'Please enter a valid email address.' }
  }

  if (!password || password.length < 8) {
    return { message: 'Password must be at least 8 characters.' }
  }

  const confirmPassword = formData.get('confirmPassword') as string
  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.' }
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { message: 'An account with this email already exists.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    const session = await encrypt({
      id: user.id,
      email: user.email,
      name: user.name,
    })
    await setSessionCookie(session)
  } catch (error) {
    console.error('Registration error:', error)
    return { message: 'Something went wrong. Please try again.' }
  }

  redirect(safeRedirectPath(formData.get('redirect'), '/setup-organization'))
}

export async function switchOrganization(organizationId: string) {
  const session = await getSession()
  if (!session) redirect('/login')

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.id as string,
        organizationId,
      },
    },
    include: { organization: { select: { id: true, slug: true } } },
  })

  if (!membership) {
    return { error: 'Not a member of this organization' }
  }

  const newSession = await encrypt({
    id: session.id,
    email: session.email,
    name: session.name,
    orgId: membership.organization.id,
    orgSlug: membership.organization.slug,
    role: membership.role,
  })
  await setSessionCookie(newSession)

  redirect('/dashboard')
}

export async function logout() {
  await clearSessionCookie()
  redirect('/login')
}
