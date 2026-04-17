import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { ContractAnalysis } from '@/types/contract-analysis';
import { ClientEditorWrapper } from './ClientEditorWrapper';
import { decrypt } from '@/lib/encryption';

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
      tasks: {
        orderBy: { createdAt: 'desc' as const },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          type: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  // Transform DB contract to ContractAnalysis format for the editor
  const initialData: ContractAnalysis = {
    // ── Core metadata ───────────────────────────────────────────────────
    contractType: contract.type,
    title: contract.title,
    summary: decrypt(contract.summary || ''),
    status: contract.status,
    category: contract.category,
    conditions: decrypt(contract.conditions || '') || undefined,
    comments: contract.comments || undefined,
    contractOwner: contract.contractOwner,
    deputy: contract.deputy,
    contractManager: contract.contractManager,
    contractPartner: contract.contractPartner,
    contractValue: contract.contractValue,
    confidentiality: contract.confidentiality,
    durationType: contract.durationType || 'Fixed-term',
    organizationalUnit: contract.organizationalUnit,
    riskAssessment: contract.riskAssessment,
    liabilityAmount: contract.liabilityAmount,
    externalReference: contract.contractNumber,

    // ── Dates ────────────────────────────────────────────────────────────
    contractStart: contract.startDate || null,
    effectiveDate: contract.startDate || null,
    expirationDate: contract.endDate || null,
    renewalDate: contract.renewalDate || null,

    // ── Parties ──────────────────────────────────────────────────────────
    parties: (contract.parties as string[] | null) ?? null,

    // ── NDA-specific ─────────────────────────────────────────────────────
    confidentialityDuration: contract.confidentialityDuration,
    isMutual: contract.isMutual,
    jurisdiction: contract.jurisdiction,
    riskFlags: (contract.riskFlags as ContractAnalysis['riskFlags']) ?? null,

    // ── Service Agreement-specific ───────────────────────────────────────
    autoRenewal: contract.autoRenewal,
    paymentTerms: (contract.paymentTerms as ContractAnalysis['paymentTerms']) ?? null,
    ipOwnership: contract.ipOwnership,
    terminationNoticePeriod: contract.terminationNoticePeriod,
    liabilityCap: contract.liabilityCap,
    indemnification: contract.indemnification,

    // ── License Agreement-specific ───────────────────────────────────────
    licensor: contract.licensor,
    licensee: contract.licensee,
    softwareName: contract.softwareName,
    licenseType: contract.licenseType,
    usageLimits: contract.usageLimits,
    exclusivity: contract.exclusivity,
    auditRights: (contract.auditRights as ContractAnalysis['auditRights']) ?? null,
    territory: contract.territory,

    // ── General ──────────────────────────────────────────────────────────
    governingLaw: contract.governingLaw,
    keyDates: (contract.keyDates as ContractAnalysis['keyDates']) ?? undefined,
  };

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

  // Serialize tasks
  const serializedTasks = contract.tasks.map((task) => ({
    ...task,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));

  // Prepare serializable contract object for client
  const serializableContract = {
    ...contract,
    summary: decrypt(contract.summary || ''),
    conditions: decrypt(contract.conditions || ''),
    content: decrypt(contract.content || ''),
    alerts: undefined,
    tasks: undefined,
    fileData: null,
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
  };

  return (
    <ClientEditorWrapper
      contract={serializableContract}
      initialData={initialData}
      alerts={serializedAlerts}
      tasks={serializedTasks}
    />
  );
}
