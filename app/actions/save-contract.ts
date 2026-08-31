'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionWithOrg } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContractAnalysis } from '@/types/contract-analysis';
import { encrypt, encryptBuffer } from '@/lib/encryption';
import { hasPermission } from '@/lib/permissions';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — matches the analyze endpoint
const ALLOWED_FILE_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]);
const MAX_METADATA_BYTES = 256 * 1024; // 256KB of extracted metadata is plenty

/** Trim an uploaded filename to a safe, bounded, path-free value. */
function sanitizeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'document';
  return base.replace(/[\r\n\x00]/g, '').slice(0, 255) || 'document';
}

export async function saveContract(formData: FormData) {
  const session = await getSessionWithOrg();

  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.userId;

  try {
    const file = formData.get('file') as File | null;
    const metadataString = formData.get('metadata') as string;
    const content = formData.get('content') as string;
    const contractId = formData.get('contractId') as string | null;

    if (!metadataString) {
        return { success: false, error: 'Missing metadata' };
    }

    if (metadataString.length > MAX_METADATA_BYTES) {
        return { success: false, error: 'Metadata payload too large' };
    }

    let metadata: Partial<ContractAnalysis>;
    try {
        metadata = JSON.parse(metadataString) as Partial<ContractAnalysis>;
    } catch {
        return { success: false, error: 'Invalid metadata' };
    }

    if (!metadata || typeof metadata !== 'object') {
        return { success: false, error: 'Invalid metadata' };
    }

    let fileData: Buffer | null = null;
    let fileName = metadata.title || 'Untitled';

    // Only process file if a new one is uploaded. Re-validate size and type
    // server-side — the client only sets an `accept` hint, which is bypassable.
    if (file && file.size > 0) {
        if (file.size > MAX_FILE_SIZE) {
            return { success: false, error: 'File too large (max 10MB)' };
        }
        if (file.type && !ALLOWED_FILE_MIME.has(file.type)) {
            return { success: false, error: 'Unsupported file type' };
        }
        const arrayBuffer = await file.arrayBuffer();
        fileData = Buffer.from(arrayBuffer);
        fileName = sanitizeFileName(file.name);
    }

    // Helper to format string or join array
    const getString = (val: string | string[] | null | undefined) => {
        if (Array.isArray(val)) return val.join('\n');
        return val || null;
    };

    // Helper to encrypt string if present
    const encryptIfPresent = (val: string | string[] | null | undefined) => {
        const str = getString(val);
        if (!str) return null;
        return encrypt(str);
    };

    // Prisma requires DbNull instead of null for Json? fields
    const jsonOrNull = (val: unknown) => val ?? Prisma.DbNull;

    const commonData = {
        title: metadata.title || 'Untitled Contract',
        type: metadata.contractType || 'Unknown',
        status: metadata.status || 'Draft',

        // ── Core metadata ────────────────────────────────────────────────
        category: metadata.category || null,
        summary: encryptIfPresent(metadata.summary),
        conditions: encryptIfPresent(metadata.conditions),
        comments: getString(metadata.comments), // Comments might be searched? Let's leave plaintext or encrypt? User didn't specify. Let's leave comments plaintext for now as they are "meta".
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
        parties: jsonOrNull(metadata.parties),

        // ── NDA-specific ─────────────────────────────────────────────────
        confidentialityDuration: metadata.confidentialityDuration || null,
        isMutual: metadata.isMutual ?? null,
        jurisdiction: metadata.jurisdiction || null,
        riskFlags: jsonOrNull(metadata.riskFlags),

        // ── Service Agreement-specific ───────────────────────────────────
        autoRenewal: metadata.autoRenewal ?? null,
        paymentTerms: jsonOrNull(metadata.paymentTerms),
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
        auditRights: jsonOrNull(metadata.auditRights),
        territory: metadata.territory || null,

        // ── General / Other ──────────────────────────────────────────────
        governingLaw: metadata.governingLaw || null,
        keyDates: jsonOrNull(metadata.keyDates),

        // ── Content ──────────────────────────────────────────────────────
        content: encryptIfPresent(content || getString(metadata.summary)), 
    };

    // If updating existing contract
    if (contractId) {
        if (!hasPermission(session.role, 'contract:update')) {
            return { success: false, error: 'Insufficient permissions' };
        }

        const existingContract = await prisma.contract.findUnique({
            where: { id: contractId },
            select: { userId: true, organizationId: true }
        });

        if (!existingContract || existingContract.organizationId !== session.orgId) {
             return { success: false, error: 'Contract not found or unauthorized' };
        }

        // Members can only edit their own contracts
        if (session.role === 'member' && existingContract.userId !== userId) {
            return { success: false, error: 'You can only edit your own contracts' };
        }

        const updateData: any = { ...commonData };
        // Only update file fields if a new file was provided
        if (fileData) {
            updateData.fileData = encryptBuffer(fileData) as any;
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
                userId: userId,
                contractId: contractId
            }
        });

        revalidatePath('/dashboard/contracts');
        revalidatePath(`/contracts/${contractId}`);
        return { success: true, contractId: contractId };

    } else {
        // Creating new contract
        if (!hasPermission(session.role, 'contract:create')) {
            return { success: false, error: 'Insufficient permissions' };
        }

        const contractNumber = metadata.externalReference || `CNT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const contract = await prisma.contract.create({
            data: {
                ...commonData,
                contractNumber: contractNumber,
                fileData: fileData ? encryptBuffer(fileData) as any : null,
                fileName: fileName,
                userId: userId,
                organizationId: session.orgId,
            }
        });

        // Create activity
        await prisma.activity.create({
            data: {
                description: contract.title,
                action: 'created',
                userId: userId,
                contractId: contract.id
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
