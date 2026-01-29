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
      userId: session.id as string // Ensure user owns the contract
    }
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
    conditions: contract.conditions,
    contractOwner: contract.contractOwner,
    deputy: contract.deputy,
    contractManager: contract.contractManager,
    contractValue: contract.contractValue,
    // Add other fields mapping
    contractStart: contract.startDate || null,
    comments: null, // We might need to map comments if stored
    riskAssessment: null,
    liabilityAmount: null,
    externalReference: contract.contractNumber,
    organizationalUnit: null,
    confidentiality: null,
    contractPartner: null,
    durationType: 'Fixed-term', // Default
  };

  // Prepare serializable contract object for client
  const serializableContract = {
    ...contract,
    fileData: null, // Don't pass raw Buffer
    // fileBase64 removed - we fetch via API
    createdAt: contract.createdAt.toISOString(),
    updatedAt: contract.updatedAt.toISOString(),
  };

  return (
    <ClientEditorWrapper 
      contract={serializableContract} 
      initialData={initialData} 
    />
  );
}
