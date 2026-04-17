'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession, encrypt } from '@/lib/auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export async function createOrganization(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.id) {
    redirect('/login');
  }

  const name = (formData.get('name') as string)?.trim();
  if (!name || name.length < 2) {
    return { error: 'Organization name must be at least 2 characters.' };
  }

  const userId = session.id as string;

  try {
    // Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.organization.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Create org + membership in a transaction
    const org = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { name, slug },
      });

      await tx.membership.create({
        data: {
          userId,
          organizationId: org.id,
          role: 'owner',
        },
      });

      return org;
    });

    // Re-issue JWT with org context
    const newSession = await encrypt({
      id: session.id,
      email: session.email,
      name: session.name,
      orgId: org.id,
      orgSlug: org.slug,
      role: 'owner',
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_session', newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } catch (error) {
    console.error('Error creating organization:', error);
    return { error: 'Failed to create organization. Please try again.' };
  }

  redirect('/dashboard');
}

export async function acceptInvitation(token: string) {
  const session = await getSession();
  if (!session || !session.id) {
    redirect('/login');
  }

  const userId = session.id as string;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { id: true, slug: true } } },
  });

  if (!invitation) {
    return { error: 'Invalid invitation link.' };
  }

  if (invitation.expiresAt < new Date()) {
    return { error: 'This invitation has expired.' };
  }

  if (invitation.acceptedAt) {
    return { error: 'This invitation has already been used.' };
  }

  // Verify the invitation email matches the logged-in user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (user?.email !== invitation.email) {
    return { error: 'This invitation was sent to a different email address.' };
  }

  try {
    await prisma.$transaction([
      prisma.membership.create({
        data: {
          userId,
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      }),
      prisma.invitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      }),
    ]);

    // Re-issue JWT with the new org
    const newSession = await encrypt({
      id: session.id,
      email: session.email,
      name: session.name,
      orgId: invitation.organization.id,
      orgSlug: invitation.organization.slug,
      role: invitation.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth_session', newSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'You are already a member of this organization.' };
    }
    console.error('Error accepting invitation:', error);
    return { error: 'Failed to accept invitation.' };
  }

  redirect('/dashboard');
}
