'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';

export async function getMembers() {
  const session = await getSessionWithOrg();
  if (!session) redirect('/login');

  return prisma.membership.findMany({
    where: { organizationId: session.orgId },
    include: {
      user: { select: { id: true, email: true, name: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getPendingInvitations() {
  const session = await getSessionWithOrg();
  if (!session) redirect('/login');

  return prisma.invitation.findMany({
    where: {
      organizationId: session.orgId,
      acceptedAt: null,
      expiresAt: { gt: new Date() },
    },
    include: {
      invitedBy: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
