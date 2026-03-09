import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AlertsClient } from './AlertsClient';

export default async function AlertsPage() {
  const session = await getSession();
  if (!session || !session.id) {
    redirect('/login');
  }

  const userId = session.id as string;

  const alerts = await prisma.alert.findMany({
    where: {
      contract: { userId },
    },
    include: {
      contract: {
        select: {
          id: true,
          title: true,
          contractPartner: true,
          durationType: true,
          status: true,
          endDate: true,
          contractNumber: true,
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      response: {
        include: {
          respondedBy: {
            select: { id: true, name: true },
          },
        },
      },
      events: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { alarmDate: 'desc' },
  });

  const serializedAlerts = alerts.map((alert) => ({
    ...alert,
    alarmDate: alert.alarmDate.toISOString(),
    deadline: alert.deadline?.toISOString() ?? null,
    createdAt: alert.createdAt.toISOString(),
    updatedAt: alert.updatedAt.toISOString(),
    response: alert.response
      ? {
          ...alert.response,
          createdAt: alert.response.createdAt.toISOString(),
        }
      : null,
    events: alert.events.map((event) => ({
      ...event,
      createdAt: event.createdAt.toISOString(),
    })),
  }));

  return <AlertsClient alerts={serializedAlerts} />;
}
