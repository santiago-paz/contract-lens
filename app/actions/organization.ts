'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession, getSessionWithOrg, encrypt } from '@/lib/auth';
import { resend, INVITE_FROM } from '@/lib/email';
import { hasPermission, type Role } from '@/lib/permissions';

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

export async function sendInvitation(prevState: any, formData: FormData) {
  const session = await getSessionWithOrg();
  if (!session) {
    redirect('/login');
  }

  if (!hasPermission(session.role, 'org:invite')) {
    return { error: 'You do not have permission to invite members.' };
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const role = (formData.get('role') as string) || 'member';

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!['admin', 'manager', 'member', 'viewer'].includes(role)) {
    return { error: 'Invalid role.' };
  }

  // Check if user is already a member
  const existingMember = await prisma.membership.findFirst({
    where: {
      organizationId: session.orgId,
      user: { email },
    },
  });

  if (existingMember) {
    return { error: 'This user is already a member of the organization.' };
  }

  // Check for existing pending invitation
  const existingInvitation = await prisma.invitation.findUnique({
    where: {
      email_organizationId: { email, organizationId: session.orgId },
    },
  });

  if (existingInvitation && !existingInvitation.acceptedAt) {
    return { error: 'An invitation has already been sent to this email.' };
  }

  // Delete any old accepted invitation so we can create a new one
  if (existingInvitation) {
    await prisma.invitation.delete({ where: { id: existingInvitation.id } });
  }

  const org = await prisma.organization.findUnique({
    where: { id: session.orgId },
    select: { name: true },
  });

  const invitation = await prisma.invitation.create({
    data: {
      email,
      role,
      organizationId: session.orgId,
      invitedById: session.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const inviteUrl = `${baseUrl}/invite/${invitation.token}`;

  const { error } = await resend.emails.send({
    from: INVITE_FROM,
    to: email,
    subject: `You've been invited to ${org?.name ?? 'an organization'} on Contract Lens`,
    html: `
      <div style="font-family: monospace; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="font-size: 18px; margin-bottom: 24px;">You've been invited</h2>
        <p style="color: #333; line-height: 1.6;">
          <strong>${session.name || session.email}</strong> has invited you to join
          <strong>${org?.name}</strong> as <strong>${role}</strong>.
        </p>
        <a href="${inviteUrl}"
           style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: #CCFF00; color: #000; text-decoration: none; font-weight: bold; font-family: monospace; border: 2px solid #000;">
          Accept Invitation
        </a>
        <p style="margin-top: 24px; font-size: 12px; color: #666;">
          This invitation expires in 7 days. If you didn't expect this, you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Failed to send invitation email:', error);
    await prisma.invitation.delete({ where: { id: invitation.id } });
    return { error: 'Failed to send invitation email. Please try again.' };
  }

  return { success: `Invitation sent to ${email}.` };
}

export async function revokeInvitation(invitationId: string) {
  const session = await getSessionWithOrg();
  if (!session) {
    redirect('/login');
  }

  if (!hasPermission(session.role, 'org:invite')) {
    return { error: 'You do not have permission to manage invitations.' };
  }

  await prisma.invitation.delete({
    where: { id: invitationId, organizationId: session.orgId },
  });

  return { success: true };
}

export async function removeMember(membershipId: string) {
  const session = await getSessionWithOrg();
  if (!session) {
    redirect('/login');
  }

  if (!hasPermission(session.role, 'org:remove_member')) {
    return { error: 'You do not have permission to remove members.' };
  }

  const membership = await prisma.membership.findUnique({
    where: { id: membershipId },
  });

  if (!membership || membership.organizationId !== session.orgId) {
    return { error: 'Member not found.' };
  }

  if (membership.role === 'owner') {
    return { error: 'Cannot remove the organization owner.' };
  }

  if (membership.userId === session.userId) {
    return { error: 'You cannot remove yourself.' };
  }

  await prisma.membership.delete({ where: { id: membershipId } });

  return { success: true };
}
