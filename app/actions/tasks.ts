'use server';

import { getSessionWithOrg } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { hasPermission, canModifyOthersResource } from '@/lib/permissions';

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'task:update')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { userId: true, contract: { select: { organizationId: true } } },
  });

  if (!task) {
    return { success: false, error: 'Task not found' };
  }

  // Verify org scope: task belongs to org (via contract or via user membership)
  if (task.contract && task.contract.organizationId !== session.orgId) {
    return { success: false, error: 'Task not found' };
  }

  // Members can only update their own tasks
  if (session.role === 'member' && task.userId !== session.userId) {
    return { success: false, error: 'You can only update your own tasks' };
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
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'task:create')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  if (!data.title.trim()) {
    return { success: false, error: 'Title is required' };
  }

  // If contractId provided, verify it belongs to user's org
  if (data.contractId) {
    const contract = await prisma.contract.findUnique({
      where: { id: data.contractId },
      select: { organizationId: true },
    });
    if (!contract || contract.organizationId !== session.orgId) {
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
      userId: session.userId,
      contractId: data.contractId || null,
    },
  });

  revalidatePath('/tasks');
  revalidatePath('/dashboard');

  return { success: true };
}
