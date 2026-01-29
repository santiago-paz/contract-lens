'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContractAnalysis } from '@/types/contract-analysis';

export async function saveContract(formData: FormData) {
  const session = await getSession();
  
  // Need to handle case where session is not valid or doesn't have id
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const file = formData.get('file') as File | null;
    const metadataString = formData.get('metadata') as string;
    const content = formData.get('content') as string; 
    
    if (!metadataString) {
        return { success: false, error: 'Missing metadata' };
    }

    const metadata = JSON.parse(metadataString) as Partial<ContractAnalysis>;
    
    let fileData: Buffer | null = null;
    let fileName = metadata.title || 'Untitled';

    if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        fileData = Buffer.from(arrayBuffer);
        fileName = file.name;
    }

    // Helper to format string or join array
    const getString = (val: string | string[] | null | undefined) => {
        if (Array.isArray(val)) return val.join('\n');
        return val || null;
    };

    // Generate a unique contract number if not provided
    // Using a simple timestamp-based ID for now to avoid collision
    const contractNumber = metadata.externalReference || `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const contract = await prisma.contract.create({
        data: {
            contractNumber: contractNumber,
            title: metadata.title || 'Untitled Contract',
            type: metadata.contractType || 'Unknown',
            status: metadata.status || 'Draft',
            summary: metadata.summary || null,
            conditions: getString(metadata.conditions),
            contractOwner: metadata.contractOwner || null,
            deputy: metadata.deputy || null,
            contractManager: metadata.contractManager || null,
            contractValue: metadata.contractValue || null,
            startDate: metadata.contractStart || null,
            
            content: content || getString(metadata.summary), 
            fileData: fileData,
            fileName: fileName,
            
            userId: userId
        }
    });

    revalidatePath('/dashboard/contracts');
    return { success: true, contractId: contract.id };
  } catch (error) {
    console.error('Error saving contract:', error);
    return { success: false, error: 'Failed to save contract' };
  }
}
