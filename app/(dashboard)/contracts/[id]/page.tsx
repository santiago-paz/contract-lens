import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { ContractAnalysis } from '@/types/contract-analysis';
import { ClientEditorWrapper } from './ClientEditorWrapper';

export default async function ContractEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  if (!session || !session.id) {
    redirect('/login');
  }

  const resolvedParams = await params;
  const contract = await prisma.contract.findUnique({
    where: { 
      id: resolvedParams.id,
      userId: session.id as string
    },
    include: {
      alerts: {
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
            orderBy: { createdAt: 'desc' as const },
          },
        },
        orderBy: { alarmDate: 'desc' as const },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  // Transform DB contract to ContractAnalysis format for the editor
  const initialData: ContractAnalysis = {
    contractType: contract.type as any, // Type assertion as enum might differ
    title: contract.title,
    summary: contract.summary || '',
    status: contract.status as any,
    conditions: contract.conditions || undefined,
    contractOwner: contract.contractOwner,
    deputy: contract.deputy,
    contractManager: contract.contractManager,
    contractValue: contract.contractValue,
    // Add other fields mapping
    contractStart: contract.startDate || null,
    contractPartner: contract.contractPartner,
    durationType: contract.durationType || 'Fixed-term',
    organizationalUnit: contract.organizationalUnit,
    confidentiality: contract.confidentiality,
    riskAssessment: contract.riskAssessment,
    liabilityAmount: contract.liabilityAmount,
    comments: contract.comments || undefined,
  } as unknown as ContractAnalysis;

  // Serialize alerts
  const serializedAlerts = contract.alerts.map((alert) => ({
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

  // Prepare serializable contract object for client
  const serializableContract = {
    ...contract,
    alerts: undefined,
    fileData: null,
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
  };

  return (
    <ClientEditorWrapper 
      contract={serializableContract} 
      initialData={initialData}
      alerts={serializedAlerts}
    />
  );
}
