'use server';

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
    // Helper to format string or join array
    const getString = (val: string | string[] | null | undefined) => {
        if (Array.isArray(val)) return val.join(', ');
        return val || null;
    };

    // Map fields based on contract type
    let contractOwner: string | null = null;
    let contractValue: string | null = null;
    let conditions: string | null = null;
    let title = 'Hydrated Contract';
    let summary: string | null = null;

    // Use 'any' to access properties that might be specific to certain types
    const data = analysis as any;

    // Common fields
    if (data.documentTitle) title = data.documentTitle;
    if (data.title) title = data.title; // Fallback if title exists in some schemas

    switch (contractType) {
      case 'NDA':
        contractOwner = data.parties?.[0] || null;
        conditions = `Duration: ${data.confidentialityDuration || 'N/A'}\nMutual: ${data.isMutual ? 'Yes' : 'No'}\nJurisdiction: ${data.jurisdiction || 'N/A'}`;
        break;
      
      case 'ServiceAgreement':
        contractOwner = data.parties?.[0] || null;
        // No direct totalContractValue in new schema, maybe use paymentTerms as value description
        contractValue = data.paymentTerms || null;
        conditions = `Term: ${data.termDuration || 'N/A'}\nNotice: ${data.terminationNoticePeriod || 'N/A'}\nLiability Cap: ${data.liabilityCap || 'N/A'}`;
        break;
      
      case 'LicenseAgreement':
        contractOwner = data.licensor || null;
        conditions = `Software: ${data.softwareName || 'N/A'}\nExclusivity: ${data.exclusivity}\nAudit Rights: ${data.auditRights?.canAudit ? 'Yes' : 'No'}`;
        break;
      
      case 'Other':
        contractOwner = data.parties?.[0] || null;
        conditions = `Effective Date: ${data.effectiveDate || 'N/A'}\nGoverning Law: ${data.governingLaw || 'N/A'}`;
        break;
    }

    const contractNumber = `TEST-${Date.now()}`;

    const contract = await prisma.contract.create({
      data: {
        title: title,
        type: contractType,
        status: 'Draft',
        summary: summary,
        conditions: conditions,
        contractOwner: contractOwner,
        contractManager: null,
        contractValue: contractValue,
        startDate: (data.effectiveDate && !isNaN(Date.parse(data.effectiveDate))) ? new Date(data.effectiveDate).toISOString() : null,
        content: rawText,
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
    // Handle date parsing errors gracefully
    if (error.message && error.message.includes('Invalid time value')) {
       return { success: false, error: 'Failed to parse Effective Date. Please check the format.' };
    }
    return { success: false, error: 'Failed to hydrate contract: ' + error.message };
  }
}
