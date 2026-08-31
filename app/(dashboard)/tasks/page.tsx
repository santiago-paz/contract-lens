import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TasksClient } from './TasksClient';

export default async function TasksPage() {
  const session = await getSessionWithOrg();
  if (!session) {
    redirect('/login');
  }

  // Task has no organizationId column, so scope to the current user AND, for
  // contract-linked tasks, to contracts in the active org. Without the OR a
  // user who belongs to multiple orgs would see another org's contract tasks
  // bleed into this org's task list.
  const tasks = await prisma.task.findMany({
    where: {
      userId: session.userId,
      OR: [
        { contractId: null },
        { contract: { organizationId: session.orgId } },
      ],
    },
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
