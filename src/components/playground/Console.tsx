import React, { useRef, useEffect } from 'react';
import { TestCase, ExecutionResult } from '@/api/types';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactJson from 'react-json-view';

interface ConsoleProps {
  output: string[];
  executionResult: ExecutionResult | null;
  isMobile: boolean;
  onResetOutput: () => void;
  testCases: TestCase[];
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests') => void;
}

// Utility function to check if a string is JSON-like for output lines
const isJsonOutputLine = (str: string): any | null => {
  if (str.startsWith('executionResult: ')) {
    try {
      const jsonStr = str.replace('executionResult: ', '');
      return JSON.parse(jsonStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Utility function to safely render a value (string or object)
const renderValue = (value: any): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return JSON.stringify(value, null, 2);
};

export const Console: React.FC<ConsoleProps> = ({
  output = [],
  executionResult,
  isMobile,
  onResetOutput,
  testCases = [],
  activeTab,
  setActiveTab,
}) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current && activeTab === 'output') {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, activeTab]);

  return (
    <motion.div className="h-full overflow-hidden flex flex-col bg-zinc-900 border-t border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-white">Console</h3>
          <div className="flex text-xs ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('output')}
              className={`px-2 py-1 h-7 rounded-l-md ${
                activeTab === 'output'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Output
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('tests')}
              className={`px-2 py-1 h-7 rounded-r-md ${
                activeTab === 'tests'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Test Cases
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={onResetOutput}
            className="px-2 py-1 rounded-md flex items-center gap-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="h-4 w-4" /> Reset Output
          </motion.button>
        </div>
      </div>

      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-[#1A1D23]">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => {
                const jsonData = isJsonOutputLine(line);
                if (jsonData) {
                  return (
                    <div key={i} className="whitespace-pre-wrap break-all">
                      <ReactJson
                        src={jsonData}
                        theme="monokai"
                        style={{ backgroundColor: 'transparent' }}
                        displayObjectSize={true}
                        displayDataTypes={false}
                        collapsed={false}
                        name={false}
                        enableClipboard={true}
                        indentWidth={2}
                      />
                    </div>
                  );
                }
                return (
                  <div key={i} className="whitespace-pre-wrap break-all">
                    {line.startsWith('[Error]') ? (
                      <span className="text-red-400">{line}</span>
                    ) : line.match(/problemId|language|isRunTestcase/) ? (
                      <span className="text-green-500">{line}</span>
                    ) : (
                      <span className="text-zinc-300">{line}</span>
                    )}
                  </div>
                );
              })}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            <div className="text-zinc-500 italic">Run your code to see output here...</div>
          )
        ) : (
          <div>
            <h4 className="text-white font-medium mb-2">Run Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div
                    key={tc.id || i}
                    className="p-2.5 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-medium">Test Case {i + 1}</span>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : executionResult && executionResult.passedTestCases > i ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1.5 text-xs space-y-1.5">
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
              <div className="text-zinc-500 italic">No run test cases available.</div>
            )}

            {executionResult && (
              <div className="mt-4 p-3 bg-zinc-900/70 border border-zinc-800/80 rounded-md">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-zinc-300 font-medium">Test Results Summary</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        executionResult.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {executionResult.overallPass ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded bg-zinc-800/50">
                      <div className="text-zinc-500 text-xs">Total</div>
                      <div className="text-white font-medium">{executionResult.totalTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-green-900/20">
                      <div className="text-green-400 text-xs">Passed</div>
                      <div className="text-green-300 font-medium">{executionResult.passedTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-red-900/20">
                      <div className="text-red-400 text-xs">Failed</div>
                      <div className="text-red-300 font-medium">{executionResult.failedTestCases}</div>
                    </div>
                  </div>
                </div>

                {executionResult.failedTestCase?.testCaseIndex !== undefined &&
                  executionResult.failedTestCase?.testCaseIndex !== -1 && (
                    <div className="p-3 rounded-md bg-red-900/20 border border-red-900/30 mt-3">
                      <h4 className="text-red-400 font-medium mb-2">Failed Test Case Details</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex">
                          <span className="text-zinc-400 w-24 inline-block">Test Case:</span>
                          <span className="text-zinc-300">{executionResult.failedTestCase?.testCaseIndex + 1}</span>
                        </div>
                        {executionResult.failedTestCase?.input && (
                          <div className="flex flex-col">
                            <span className="text-zinc-400 mb-1">Input:</span>
                            <span className="text-green-500">{renderValue(executionResult.failedTestCase?.input)}</span>
                          </div>
                        )}
                        {executionResult.failedTestCase?.expected && (
                          <div className="flex flex-col">
                            <span className="text-zinc-400 mb-1">Expected:</span>
                            <span className="text-green-500">{renderValue(executionResult.failedTestCase?.expected)}</span>
                          </div>
                        )}
                        {executionResult.failedTestCase?.received && (
                          <div className="flex flex-col">
                            <span className="text-zinc-400 mb-1">Received:</span>
                            <span className="text-red-400">{renderValue(executionResult.failedTestCase?.received)}</span>
                          </div>
                        )}
                        {executionResult.failedTestCase?.error && (
                          <div className="flex flex-col">
                            <span className="text-zinc-400 mb-1">Error:</span>
                            <span className="text-red-400">{renderValue(executionResult.failedTestCase?.error)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};