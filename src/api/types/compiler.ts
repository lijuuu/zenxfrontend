
// This is a placeholder file for compiler types

export interface CompilerResult {
  output: string;
  success: boolean;
  error?: string;
  executionTime?: number;
}

export interface CompilerOptions {
  language: string;
  version?: string;
  timeout?: number;
  memoryLimit?: number;
}
