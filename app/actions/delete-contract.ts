'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function deleteContract(contractId: string) {
  const session = await getSession();
  
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Ensure the contract belongs to the user
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract || contract.userId !== session.id) {
      return { success: false, error: 'Contract not found or unauthorized' };
    }

    // Delete tasks associated with the contract first to avoid constraints issues (if any)
    // Although in schema Task has optional contractId so it might set to null on delete or cascade
    // Prisma relation behavior depends on schema. Let's assume standard deletion.
    
    // We can also disconnect tasks but usually deletion is expected
    await prisma.task.deleteMany({
        where: { contractId: contractId }
    });

    await prisma.contract.delete({
      where: { id: contractId },
    });

    // Log activity
    await prisma.activity.create({
        data: {
            description: contract.title,
            action: 'deleted',
            userId: session.id as string
        }
    });

    revalidatePath('/dashboard/contracts');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error deleting contract:', error);
    return { success: false, error: 'Failed to delete contract' };
  }
}
