
export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface CompilerResponse {
  output?: string;
  status_message?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
}

export type TestCase = {
  id?: string;
  input: string;
  expected: string;
};

export type TestCaseRunOnly = {
  run: TestCase[];
};

export type ProblemMetadata = {
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  testcase_run: TestCaseRunOnly;
  difficulty: string;
  supported_languages: string[];
  validated?: boolean;
  placeholder_maps: { [key: string]: string };
};

export type TestResult = {
  testCaseIndex: number;
  input: any;
  expected: any;
  received: any;
  passed: boolean;
  error?: string;
};

export type ExecutionResult = {
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  overallPass: boolean;
  failedTestCase?: TestResult;
  syntaxError?: string;
};

export type ApiResponsePayload = {
  problem_id: string;
  language: string;
  is_run_testcase: boolean;
  rawoutput: ExecutionResult;
};

export type GenericResponse = {
  success: boolean;
  status: number;
  payload: ApiResponsePayload;
  error?: { errorType: string; message: string };
};
