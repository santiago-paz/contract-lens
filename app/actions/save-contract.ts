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

        // ── Core metadata ────────────────────────────────────────────────
        summary: metadata.summary || null,
        conditions: getString(metadata.conditions),
        comments: getString(metadata.comments),
        contractOwner: metadata.contractOwner || null,
        deputy: metadata.deputy || null,
        contractManager: metadata.contractManager || null,
        contractPartner: metadata.contractPartner || null,
        contractValue: metadata.contractValue || null,
        confidentiality: metadata.confidentiality || null,
        durationType: metadata.durationType || null,
        organizationalUnit: metadata.organizationalUnit || null,
        riskAssessment: metadata.riskAssessment || null,
        liabilityAmount: metadata.liabilityAmount || null,

        // ── Dates ────────────────────────────────────────────────────────
        startDate: metadata.contractStart || metadata.effectiveDate || null,
        endDate: metadata.expirationDate || metadata.terminationDate || null,
        renewalDate: metadata.renewalDate || null,

        // ── Parties ──────────────────────────────────────────────────────
        parties: metadata.parties || null,

        // ── NDA-specific ─────────────────────────────────────────────────
        confidentialityDuration: metadata.confidentialityDuration || null,
        isMutual: metadata.isMutual ?? null,
        jurisdiction: metadata.jurisdiction || null,
        riskFlags: metadata.riskFlags || null,

        // ── Service Agreement-specific ───────────────────────────────────
        autoRenewal: metadata.autoRenewal ?? null,
        paymentTerms: metadata.paymentTerms || null,
        ipOwnership: metadata.ipOwnership || null,
        terminationNoticePeriod: metadata.terminationNoticePeriod || null,
        liabilityCap: metadata.liabilityCap || null,
        indemnification: metadata.indemnification || null,

        // ── License Agreement-specific ───────────────────────────────────
        licensor: metadata.licensor || null,
        licensee: metadata.licensee || null,
        softwareName: metadata.softwareName || null,
        licenseType: metadata.licenseType || null,
        usageLimits: metadata.usageLimits || null,
        exclusivity: metadata.exclusivity ?? null,
        auditRights: metadata.auditRights || null,
        territory: metadata.territory || null,

        // ── General / Other ──────────────────────────────────────────────
        governingLaw: metadata.governingLaw || null,
        keyDates: metadata.keyDates || null,

        // ── Content ──────────────────────────────────────────────────────
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
            updateData.fileData = fileData as any;
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
                fileData: fileData as any,
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
