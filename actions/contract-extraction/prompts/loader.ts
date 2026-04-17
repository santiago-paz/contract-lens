import fs from 'fs';
import path from 'path';
import type { ContractType } from '../types';

export interface PromptTemplate {
  instructions: string;
  examples: string[];
  notes: string;
}

export interface PromptConfig {
  version: string;
  description: string;
  base: {
    role: string;
    extractionRules: string;
    outputFormat: string;
    typeLegend: string;
  };
  templates: Record<ContractType, PromptTemplate>;
}

/**
 * Loads a prompt configuration JSON file by version name.
 * Files are expected at: prompts/configs/{version}.json
 */
export function loadPromptConfig(version: string): PromptConfig {
  const configPath = path.join(__dirname, 'configs', `${version}.json`);

  if (!fs.existsSync(configPath)) {
    throw new Error(`Prompt config "${version}" not found at ${configPath}`);
  }

  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw) as PromptConfig;
}

/**
 * Returns a list of all available prompt config versions.
 */
export function listPromptVersions(): string[] {
  const configsDir = path.join(__dirname, 'configs');

  if (!fs.existsSync(configsDir)) {
    return [];
  }

  return fs
    .readdirSync(configsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
}
