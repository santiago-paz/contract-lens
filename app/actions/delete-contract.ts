'use server';

import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { hasPermission } from '@/lib/permissions';

export async function deleteContract(contractId: string) {
  const session = await getSessionWithOrg();

  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'contract:delete')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { userId: true, organizationId: true, title: true },
    });

    if (!contract || contract.organizationId !== session.orgId) {
      return { success: false, error: 'Contract not found or unauthorized' };
    }

    await prisma.task.deleteMany({
      where: { contractId: contractId },
    });

    await prisma.contract.delete({
      where: { id: contractId },
    });

    await prisma.activity.create({
      data: {
        description: contract.title,
        action: 'deleted',
        userId: session.userId,
      },
    });

    revalidatePath('/dashboard/contracts');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting contract:', error);
    return { success: false, error: 'Failed to delete contract' };
  }
}
