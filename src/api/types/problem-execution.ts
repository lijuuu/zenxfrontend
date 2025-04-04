
// This is a placeholder file for problem-execution types
// This will prevent import errors in components that reference these types

export interface ProblemExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  statusCode?: number;
}

export interface TestCaseResult {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime?: number;
}

export interface ProblemSubmissionResult {
  success: boolean;
  message: string;
  testCaseResults?: TestCaseResult[];
  totalPassed?: number;
  totalTests?: number;
}
