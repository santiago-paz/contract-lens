'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export async function login(prevState: any, formData: FormData) {
  // Rate limiting: 5 attempts per minute per IP
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const isAllowed = checkRateLimit(ip, 5, 60 * 1000)
  
  if (!isAllowed) {
    return { message: 'Too many login attempts. Please try again in a minute.' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Please enter both email and password' }
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return { message: 'Invalid credentials' }
    }

    const passwordsMatch = await bcrypt.compare(password, user.password)

    if (!passwordsMatch) {
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

    const cookieStore = await cookies()
    cookieStore.set('auth_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

  } catch (error) {
    console.error('Login error:', error)
    return { message: 'Something went wrong. Please try again.' }
  }

  redirect('/dashboard')
}

export async function switchOrganization(organizationId: string) {
  const { getSession } = await import('@/lib/auth')
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

  const cookieStore = await cookies()
  cookieStore.set('auth_session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_session')
  redirect('/login')
}
