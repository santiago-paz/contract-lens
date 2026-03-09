'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createAlert(
  contractId: string,
  data: {
    deadline?: string;
    deadlineLabel?: string;
    note?: string;
  }
) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { userId: true },
    });

    if (!contract || contract.userId !== userId) {
      return { success: false, error: 'Contract not found or unauthorized' };
    }

    const alert = await prisma.alert.create({
      data: {
        contractId,
        createdById: userId,
        deadline: data.deadline ? new Date(data.deadline) : null,
        deadlineLabel: data.deadlineLabel || null,
        note: data.note || null,
        status: 'open_no_answer',
      },
    });

    await prisma.alertEvent.create({
      data: {
        eventType: 'alarmed',
        alertId: alert.id,
        userId,
      },
    });

    revalidatePath('/alerts');
    revalidatePath(`/contracts/${contractId}`);
    return { success: true, alertId: alert.id };
  } catch (error) {
    console.error('Error creating alert:', error);
    return { success: false, error: 'Failed to create alert' };
  }
}

export async function respondToAlert(
  alertId: string,
  responseType: string,
  comment?: string
) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        contract: { select: { userId: true } },
        response: true,
      },
    });

    if (!alert || alert.contract.userId !== userId) {
      return { success: false, error: 'Alert not found or unauthorized' };
    }

    if (alert.response) {
      return { success: false, error: 'Alert already has a response' };
    }

    await prisma.$transaction([
      prisma.alertResponse.create({
        data: {
          responseType,
          comment: comment || null,
          alertId,
          respondedById: userId,
        },
      }),
      prisma.alert.update({
        where: { id: alertId },
        data: { status: 'open_with_answer' },
      }),
      prisma.alertEvent.create({
        data: {
          eventType: 'responded',
          description: responseType,
          alertId,
          userId,
        },
      }),
    ]);

    revalidatePath('/alerts');
    revalidatePath(`/contracts/${alert.contractId}`);
    return { success: true };
  } catch (error) {
    console.error('Error responding to alert:', error);
    return { success: false, error: 'Failed to respond to alert' };
  }
}

export async function closeAlert(alertId: string) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { contract: { select: { userId: true } } },
    });

    if (!alert || alert.contract.userId !== userId) {
      return { success: false, error: 'Alert not found or unauthorized' };
    }

    await prisma.$transaction([
      prisma.alert.update({
        where: { id: alertId },
        data: { status: 'closed' },
      }),
      prisma.alertEvent.create({
        data: {
          eventType: 'closed',
          alertId,
          userId,
        },
      }),
    ]);

    revalidatePath('/alerts');
    revalidatePath(`/contracts/${alert.contractId}`);
    return { success: true };
  } catch (error) {
    console.error('Error closing alert:', error);
    return { success: false, error: 'Failed to close alert' };
  }
}

export async function escalateAlert(alertId: string) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { contract: { select: { userId: true } } },
    });

    if (!alert || alert.contract.userId !== userId) {
      return { success: false, error: 'Alert not found or unauthorized' };
    }

    await prisma.$transaction([
      prisma.alert.update({
        where: { id: alertId },
        data: { status: 'escalating' },
      }),
      prisma.alertEvent.create({
        data: {
          eventType: 'escalated',
          alertId,
          userId,
        },
      }),
    ]);

    revalidatePath('/alerts');
    return { success: true };
  } catch (error) {
    console.error('Error escalating alert:', error);
    return { success: false, error: 'Failed to escalate alert' };
  }
}

export async function getContractAlerts(contractId: string) {
  const session = await getSession();
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { userId: true },
    });

    if (!contract || contract.userId !== userId) {
      return { success: false, error: 'Contract not found or unauthorized' };
    }

    const alerts = await prisma.alert.findMany({
      where: { contractId },
      include: {
        response: {
          include: {
            respondedBy: { select: { id: true, name: true } },
          },
        },
        events: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { alarmDate: 'desc' },
    });

    // Serialize dates
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

    return { success: true, alerts: serializedAlerts };
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return { success: false, error: 'Failed to fetch alerts' };
  }
}
