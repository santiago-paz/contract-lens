'use server';

import { Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ContractData } from '@/actions/extract-contract-data';
import { revalidatePath } from 'next/cache';

export async function hydrateContract(analysis: ContractData, contractType: string, rawText: string) {
  const session = await getSession();
  
  if (!session || !session.id) {
    return { success: false, error: 'Unauthorized' };
  }

  const userId = session.id as string;

  try {
    // Use 'any' to access properties that might be specific to certain types
    const data = analysis as any;

    // Prisma requires DbNull instead of null for Json? fields
    const jsonOrNull = (val: unknown) => val ?? Prisma.DbNull;

    // Resolve title from various possible fields
    const title = data.suggestedTitle || data.documentTitle || data.title || 'Hydrated Contract';

    const contractNumber = `TEST-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title,
        type: contractType,
        status: 'Draft',
        contractNumber,
        userId,
        fileName: 'hydrated-from-playground.txt',
        content: rawText,

        // ── Core metadata ────────────────────────────────────────────────
        summary: data.summary || null,
        contractOwner: data.parties?.[0] || data.licensor || null,
        contractPartner: data.parties?.[1] || data.licensee || null,

        // ── Dates ────────────────────────────────────────────────────────
        startDate: data.effectiveDate || null,
        endDate: data.expirationDate || data.terminationDate || null,
        renewalDate: data.renewalDate || null,

        // ── Parties ──────────────────────────────────────────────────────
        parties: jsonOrNull(data.parties),

        // ── NDA-specific ─────────────────────────────────────────────────
        confidentialityDuration: data.confidentialityDuration || null,
        isMutual: data.isMutual ?? null,
        jurisdiction: data.jurisdiction || null,
        riskFlags: jsonOrNull(data.riskFlags),

        // ── Service Agreement-specific ───────────────────────────────────
        autoRenewal: data.autoRenewal ?? null,
        paymentTerms: jsonOrNull(data.paymentTerms),
        ipOwnership: data.ipOwnership || null,
        terminationNoticePeriod: data.terminationNoticePeriod || null,
        liabilityCap: data.liabilityCap || null,
        indemnification: data.indemnification || null,

        // ── License Agreement-specific ───────────────────────────────────
        licensor: data.licensor || null,
        licensee: data.licensee || null,
        softwareName: data.softwareName || null,
        licenseType: data.licenseType || null,
        usageLimits: data.usageLimits || null,
        exclusivity: data.exclusivity ?? null,
        auditRights: jsonOrNull(data.auditRights),
        territory: data.territory || null,

        // ── General / Other ──────────────────────────────────────────────
        governingLaw: data.governingLaw || null,
        keyDates: jsonOrNull(data.keyDates),
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
    // Handle date parsing errors gracefully
    if (error.message && error.message.includes('Invalid time value')) {
       return { success: false, error: 'Failed to parse Effective Date. Please check the format.' };
    }
    return { success: false, error: 'Failed to hydrate contract: ' + error.message };
  }
}
