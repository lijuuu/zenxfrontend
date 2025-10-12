import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ProblemMetadata, ExecutionResult } from '@/api/types';

interface TestCasesTabProps {
  problem: ProblemMetadata;
  executionResult: ExecutionResult | null;
}

//utility function to safely render a value string or object
const renderValue = (value: any): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return JSON.stringify(value, null, 2);
};

export const TestCasesTab: React.FC<TestCasesTabProps> = ({ problem, executionResult }) => {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6">
        {/*test results summary - only show if execution result exists*/}
        {executionResult && (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-zinc-300 font-medium">Test Results Summary</span>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${executionResult.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                >
                  {executionResult.overallPass ? 'Passed' : 'Failed'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="p-3 rounded bg-zinc-800/50">
                  <div className="text-zinc-500 text-xs">Total</div>
                  <div className="text-white font-medium text-lg">{executionResult.totalTestCases}</div>
                </div>
                <div className="p-3 rounded bg-green-900/20">
                  <div className="text-green-400 text-xs">Passed</div>
                  <div className="text-green-300 font-medium text-lg">{executionResult.passedTestCases}</div>
                </div>
                <div className="p-3 rounded bg-red-900/20">
                  <div className="text-red-400 text-xs">Failed</div>
                  <div className="text-red-300 font-medium text-lg">{executionResult.failedTestCases}</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-zinc-300 text-sm">
                  {executionResult.passedTestCases} out of {executionResult.totalTestCases} test cases passed
                </span>
              </div>
            </div>
          </div>
        )}

        {/*test cases - always show initial test cases*/}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {executionResult ? 'Test Case Results' : 'Test Cases'}
          </h3>
          {problem.testcaseRun?.run && problem.testcaseRun.run.length > 0 ? (
            <div className="space-y-3">
              {problem.testcaseRun.run.map((tc, i) => (
                <div
                  key={tc.id || i}
                  className="p-3 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-zinc-300 font-medium">Test Case {i + 1}</span>
                    {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : executionResult && executionResult.passedTestCases > i ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : null}
                  </div>
                  <div className="ml-4 text-xs space-y-2">
                    <div className="flex flex-col">
                      <span className="text-zinc-500 mb-1">Input:</span>
                      <span className="text-green-500">{renderValue(tc.input)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-zinc-500 mb-1">Expected:</span>
                      <span className="text-green-500">{renderValue(tc.expected)}</span>
                    </div>
                    {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                      <>
                        {executionResult.failedTestCase.received && (
                          <div className="flex flex-col">
                            <span className="text-zinc-500 mb-1">Received:</span>
                            <span className="text-red-400">{renderValue(executionResult.failedTestCase.received)}</span>
                          </div>
                        )}
                        {executionResult.failedTestCase.error && (
                          <div className="flex flex-col">
                            <span className="text-zinc-500 mb-1">Error:</span>
                            <span className="text-red-400">{renderValue(executionResult.failedTestCase.error)}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 italic">No test cases available.</div>
          )}
        </div>

        {/*show message when no execution result yet*/}
        {!executionResult && (
          <div className="text-center py-4">
            <p className="text-zinc-500 text-sm">
              Run or submit your code to see test case execution results
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
