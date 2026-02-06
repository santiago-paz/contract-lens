// Types for the shared contract analysis pipeline.
// Separated from the server action file to avoid Next.js 'use server' issues
// (Next.js tries to create runtime references for all exports in 'use server' files).

export interface AnalysisOptions {
  /** Override the expert model (default: deepseek/deepseek-r1) */
  model?: string;
  /** Override the expert temperature (default: 0) */
  temperature?: number;
  /** Override the system prompt sent to the expert model */
  systemPromptOverride?: string;
}

export interface AnalysisResultData {
  rawText: string;
  parsed: any;
  classification: string;
  usage?: {
    router?: any;
    expert?: any;
    totalTokens: number;
  };
  modelReasoning?: string | null;
  latency: {
    extraction: number;
    router?: number;
    expert?: number;
    total: number;
  };
}

export interface AnalysisResult {
  success: boolean;
  data?: AnalysisResultData;
  error?: string;
  errorDetails?: string;
}

export type PlaygroundAnalysisResult = AnalysisResult & {
  errors?: Record<string, string[]>;
};
