import { useState, useCallback, useMemo } from 'react';
import { ContractAnalysis } from '@/types/contract-analysis';

// ── Form state shape ─────────────────────────────────────────────────────────

/** All string/scalar fields on the contract form. */
export interface ContractFormData {
  // Core
  contractTitle: string;
  summary: string;
  conditions: string;
  comments: string;
  status: string;
  category: string;

  // People (arrays)
  contractOwner: string[];
  deputy: string[];
  contractManager: string[];
  contractPartner: string[];

  // Admin
  contractValue: string;
  confidentiality: string;
  durationType: string;
  contractStart: string;
  riskAssessment: string;
  organizationalUnit: string;

  // ServiceAgreement
  paymentMethod: string;
  paymentTiming: string;
  paymentCurrency: string;
  ipOwnership: string;
  indemnification: string;
  liabilityCap: string;
  terminationNoticePeriod: string;

  // NDA
  confidentialityDuration: string;
  jurisdiction: string;

  // LicenseAgreement
  softwareName: string;
  licenseType: string;
  licensor: string;
  licensee: string;
  usageLimits: string;
  territory: string;

  // General
  governingLaw: string;

  // Booleans
  isMutual: boolean | null;
  nonSolicit: boolean | null;
  nonCompete: boolean | null;
  liquidatedDamages: boolean | null;
  autoRenewal: boolean | null;
  exclusivity: boolean | null;
}

// Key sets for type narrowing
type StringField = {
  [K in keyof ContractFormData]: ContractFormData[K] extends string ? K : never;
}[keyof ContractFormData];

type ArrayField = {
  [K in keyof ContractFormData]: ContractFormData[K] extends string[] ? K : never;
}[keyof ContractFormData];

type BooleanField = {
  [K in keyof ContractFormData]: ContractFormData[K] extends boolean | null ? K : never;
}[keyof ContractFormData];

// ── Hook ─────────────────────────────────────────────────────────────────────

function splitString(val: string | null | undefined): string[] {
  return val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
}

function buildInitialState(initialData: ContractAnalysis | null | undefined, fileName: string): ContractFormData {
  const d = initialData;
  return {
    contractTitle: d?.title || fileName.replace(/\.[^/.]+$/, ''),
    summary: d?.summary || '',
    conditions: d?.conditions || '',
    comments: d?.comments || '',
    status: d?.status || 'Review',
    category: d?.category || '',

    contractOwner: splitString(d?.contractOwner),
    deputy: splitString(d?.deputy),
    contractManager: splitString(d?.contractManager),
    contractPartner: splitString(d?.contractPartner),

    contractValue: d?.contractValue || d?.liabilityCap || '',
    confidentiality: d?.confidentiality || '',
    durationType: d?.durationType || 'Once-off',
    contractStart: d?.contractStart || d?.effectiveDate || '',
    riskAssessment: d?.riskAssessment || '',
    organizationalUnit: d?.organizationalUnit || 'Legal',

    paymentMethod: d?.paymentTerms?.method || '',
    paymentTiming: d?.paymentTerms?.timing || '',
    paymentCurrency: d?.paymentTerms?.currency || '',
    ipOwnership: d?.ipOwnership || '',
    indemnification: d?.indemnification || '',
    liabilityCap: d?.liabilityCap || '',
    terminationNoticePeriod: d?.terminationNoticePeriod || '',

    confidentialityDuration: d?.confidentialityDuration || '',
    jurisdiction: d?.jurisdiction || '',

    softwareName: d?.softwareName || '',
    licenseType: d?.licenseType || '',
    licensor: d?.licensor || '',
    licensee: d?.licensee || '',
    usageLimits: d?.usageLimits || '',
    territory: d?.territory || '',

    governingLaw: d?.governingLaw || '',

    isMutual: d?.isMutual ?? null,
    nonSolicit: d?.riskFlags?.nonSolicit ?? null,
    nonCompete: d?.riskFlags?.nonCompete ?? null,
    liquidatedDamages: d?.riskFlags?.liquidatedDamages ?? null,
    autoRenewal: d?.autoRenewal ?? null,
    exclusivity: d?.exclusivity ?? null,
  };
}

export function useContractForm(initialData: ContractAnalysis | null | undefined, fileName: string) {
  const [formData, setFormData] = useState<ContractFormData>(() =>
    buildInitialState(initialData, fileName)
  );

  /** Update a single string field */
  const updateField = useCallback(<K extends StringField>(key: K, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  /** Update a single array field */
  const updateArrayField = useCallback(<K extends ArrayField>(key: K, value: string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  /** Update a single boolean field */
  const updateBooleanField = useCallback(<K extends BooleanField>(key: K, value: boolean | null) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  /** Build the metadata object for saving */
  const buildSaveMetadata = useCallback((contractType: string, base: ContractAnalysis | null | undefined) => {
    const f = formData;
    return {
      ...base,
      title: f.contractTitle,
      contractType,
      contractOwner: f.contractOwner.length > 0 ? f.contractOwner.join(', ') : null,
      deputy: f.deputy.length > 0 ? f.deputy.join(', ') : null,
      contractManager: f.contractManager.length > 0 ? f.contractManager.join(', ') : null,
      contractPartner: f.contractPartner.length > 0 ? f.contractPartner.join(', ') : null,
      summary: f.summary,
      conditions: f.conditions,
      comments: f.comments,
      status: f.status,
      category: f.category || null,
      contractValue: f.contractValue,
      confidentiality: f.confidentiality,
      durationType: f.durationType,
      contractStart: f.contractStart,
      riskAssessment: f.riskAssessment,
      organizationalUnit: f.organizationalUnit,
      paymentTerms: { method: f.paymentMethod, timing: f.paymentTiming, currency: f.paymentCurrency },
      ipOwnership: f.ipOwnership,
      indemnification: f.indemnification,
      liabilityCap: f.liabilityCap,
      terminationNoticePeriod: f.terminationNoticePeriod,
      confidentialityDuration: f.confidentialityDuration,
      jurisdiction: f.jurisdiction,
      softwareName: f.softwareName,
      licenseType: f.licenseType,
      licensor: f.licensor,
      licensee: f.licensee,
      usageLimits: f.usageLimits,
      territory: f.territory,
      governingLaw: f.governingLaw,
      isMutual: f.isMutual,
      riskFlags: { nonSolicit: f.nonSolicit, nonCompete: f.nonCompete, liquidatedDamages: f.liquidatedDamages },
      autoRenewal: f.autoRenewal,
      exclusivity: f.exclusivity,
    };
  }, [formData]);

  return { formData, updateField, updateArrayField, updateBooleanField, buildSaveMetadata };
}
