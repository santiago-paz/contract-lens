'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContractAnalysis } from '@/types/contract-analysis';

export async function hydrateContract(analysis: ContractAnalysis, rawText: string) {
  const session = await getSession();
  
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    // Helper to format string or join array
    const getString = (val: string | string[] | null | undefined) => {
        if (Array.isArray(val)) return val.join('\n');
        return val || null;
    };

    // Map fields based on contract type
    let contractOwner: string | null = null;
    let contractValue: string | null = null;
    let conditions: string | null = null;

    switch (analysis.contractType) {
      case 'NDA':
        contractOwner = analysis.disclosingParty;
        conditions = `Duration: ${analysis.duration}\nMutual: ${analysis.isMutual ? 'Yes' : 'No'}\nJurisdiction: ${analysis.jurisdiction}`;
        break;
      case 'ServiceAgreement':
        contractOwner = analysis.providerName;
        contractValue = analysis.totalContractValue;
        conditions = `Payment: ${analysis.paymentSchedule}\nNotice: ${analysis.terminationNoticePeriod}\nDeliverables: ${analysis.deliverables.join(', ')}`;
        break;
      case 'LicenseAgreement':
        contractOwner = analysis.licensor;
        conditions = `Territory: ${analysis.territory}\nExclusivity: ${analysis.exclusivity ? 'Yes' : 'No'}\nAudit: ${analysis.auditRights || 'None'}`;
        break;
    }

    const contractNumber = `TEST-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title: analysis.title || 'Hydrated Contract',
        type: analysis.contractType,
        status: 'Draft', // Default as it's not in the new schema
        summary: analysis.summary || null,
        conditions: conditions,
        contractOwner: contractOwner,
        contractManager: null, // Not in new schema
        contractValue: contractValue,
        startDate: null, // Not in new schema
        content: rawText || getString(analysis.summary),
        contractNumber: contractNumber,
        userId: userId,
        fileName: 'hydrated-from-playground.txt',
      }
    });

    // Create activity
    await prisma.activity.create({
        data: {
            description: `Hydrated: ${contract.title}`,
            action: 'created',
            userId: userId
        }
    });

    revalidatePath('/dashboard/contracts');
    return { success: true, contractId: contract.id };

  } catch (error: any) {
    console.error('Error hydrating contract:', error);
    if (error.code === 'P2002') {
        return { success: false, error: 'A contract with this number already exists.' };
    }
    return { success: false, error: 'Failed to hydrate contract' };
  }
}
