'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContractAnalysis } from '@/types/contract-analysis';

export async function saveContract(formData: FormData) {
  const session = await getSession();
  
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    const file = formData.get('file') as File | null;
    const metadataString = formData.get('metadata') as string;
    const content = formData.get('content') as string; 
    const contractId = formData.get('contractId') as string | null;
    
    if (!metadataString) {
        return { success: false, error: 'Missing metadata' };
    }

    const metadata = JSON.parse(metadataString) as Partial<ContractAnalysis>;
    
    let fileData: Buffer | null = null;
    let fileName = metadata.title || 'Untitled';

    // Only process file if a new one is uploaded
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

    const commonData = {
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
    };

    // If updating existing contract
    if (contractId) {
        // Verify ownership
        const existingContract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: { userId: true }
        });

        if (!existingContract || existingContract.userId !== userId) {
             return { success: false, error: 'Contract not found or unauthorized' };
        }

        const updateData: any = { ...commonData };
        // Only update file fields if a new file was provided
        if (fileData) {
            updateData.fileData = fileData;
            updateData.fileName = fileName;
        }

        await prisma.contract.update({
            where: { id: contractId },
            data: updateData
        });

        // Update activity
        await prisma.activity.create({
            data: {
                description: updateData.title || 'Contract',
                action: 'updated',
                userId: userId
            }
        });

        revalidatePath('/dashboard/contracts');
        revalidatePath(`/contracts/${contractId}`);
        return { success: true, contractId: contractId };

    } else {
        // Creating new contract
        const contractNumber = metadata.externalReference || `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const contract = await prisma.contract.create({
            data: {
                ...commonData,
                contractNumber: contractNumber,
                fileData: fileData,
                fileName: fileName,
                userId: userId
            }
        });

        // Create activity
        await prisma.activity.create({
            data: {
                description: contract.title,
                action: 'created',
                userId: userId
            }
        });

        revalidatePath('/dashboard/contracts');
        return { success: true, contractId: contract.id };
    }

  } catch (error: any) {
    console.error('Error saving contract:', error);
    // Handle Prisma unique constraint errors gracefully
    if (error.code === 'P2002') {
        return { success: false, error: 'A contract with this number already exists.' };
    }
    return { success: false, error: 'Failed to save contract' };
  }
}
