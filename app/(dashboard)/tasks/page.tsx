import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TasksClient } from './TasksClient';

export default async function TasksPage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect('/login');
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.id as string },
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
