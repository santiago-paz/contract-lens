'use server';

import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { userId: true },
  });

  if (!task || task.userId !== session.id) {
    return { success: false, error: 'Task not found' };
  }

  const validStatuses = ['Open', 'In Progress', 'Completed'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status' };
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath('/tasks');
  revalidatePath('/dashboard');

  return { success: true };
}

export async function createTask(data: {
  title: string;
  description?: string;
  type?: string;
  dueDate?: string;
  contractId?: string;
}) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!data.title.trim()) {
    return { success: false, error: 'Title is required' };
  }

  // If contractId provided, verify ownership
  if (data.contractId) {
    const contract = await prisma.contract.findUnique({
      where: { id: data.contractId },
      select: { userId: true },
    });
    if (!contract || contract.userId !== session.id) {
      return { success: false, error: 'Contract not found' };
    }
  }

  await prisma.task.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: 'Open',
      type: data.type?.trim() || null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId: session.id as string,
      contractId: data.contractId || null,
    },
  });

  revalidatePath('/tasks');
  revalidatePath('/dashboard');

  return { success: true };
}
