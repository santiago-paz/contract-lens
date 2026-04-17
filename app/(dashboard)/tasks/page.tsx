import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TasksClient } from './TasksClient';

export default async function TasksPage() {
  const session = await getSessionWithOrg();
  if (!session) {
    redirect('/login');
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.userId },
    include: {
      contract: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const serializedTasks = tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  return <TasksClient tasks={serializedTasks} />;
}
