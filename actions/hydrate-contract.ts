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

    const contractNumber = analysis.externalReference || `TEST-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title: analysis.title || 'Hydrated Contract',
        type: analysis.contractType || 'Unknown',
        status: analysis.status || 'Draft',
        summary: analysis.summary || null,
        conditions: getString(analysis.conditions),
        contractOwner: analysis.contractOwner || null,
        contractManager: analysis.contractManager || null,
        contractValue: analysis.contractValue || null,
        startDate: analysis.contractStart || null,
        content: rawText || getString(analysis.summary),
        contractNumber: contractNumber,
        userId: userId,
        // We don't have the file buffer here easily unless we re-upload or cache it, 
        // but for "hydration" from text/analysis, we might skip the binary file or add a placeholder.
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
