'use server';

import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { hasPermission } from '@/lib/permissions';

export async function createAlert(
  contractId: string,
  data: {
    deadline?: string;
    deadlineLabel?: string;
    note?: string;
  }
) {
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'alert:create')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { organizationId: true },
    });

    if (!contract || contract.organizationId !== session.orgId) {
      return { success: false, error: 'Contract not found or unauthorized' };
    }

    const alert = await prisma.alert.create({
      data: {
        contractId,
        createdById: session.userId,
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
        userId: session.userId,
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
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'alert:respond')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: {
        contract: { select: { organizationId: true } },
        response: true,
      },
    });

    if (!alert || alert.contract.organizationId !== session.orgId) {
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
          respondedById: session.userId,
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
          userId: session.userId,
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
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'alert:close')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { contract: { select: { organizationId: true } } },
    });

    if (!alert || alert.contract.organizationId !== session.orgId) {
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
          userId: session.userId,
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
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'alert:respond')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const alert = await prisma.alert.findUnique({
      where: { id: alertId },
      include: { contract: { select: { organizationId: true } } },
    });

    if (!alert || alert.contract.organizationId !== session.orgId) {
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
          userId: session.userId,
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
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasPermission(session.role, 'contract:read')) {
    return { success: false, error: 'Insufficient permissions' };
  }

  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      select: { organizationId: true },
    });

    if (!contract || contract.organizationId !== session.orgId) {
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

export async function getUserNotifications() {
  const session = await getSessionWithOrg();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Find alerts for contracts in the user's organization that are not closed
    const alerts = await prisma.alert.findMany({
      where: {
        contract: {
          organizationId: session.orgId,
        },
        status: {
          not: 'closed',
        },
      },
      include: {
        contract: {
          select: {
            id: true,
            title: true,
            contractNumber: true,
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        alarmDate: 'asc',
      },
    });

    const serializedAlerts = alerts.map((alert) => ({
      id: alert.id,
      alarmDate: alert.alarmDate.toISOString(),
      deadline: alert.deadline?.toISOString() ?? null,
      status: alert.status,
      contractId: alert.contractId,
      contractTitle: alert.contract.title,
      contractNumber: alert.contract.contractNumber,
      createdByName: alert.createdBy.name,
      createdAt: alert.createdAt.toISOString(),
    }));

    return { success: true, notifications: serializedAlerts };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}
