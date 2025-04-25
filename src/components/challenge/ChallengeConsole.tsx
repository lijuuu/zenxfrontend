
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { TestCase, ExecutionResult } from '@/types/challengeTypes';

interface ChallengeConsoleProps {
  output: string[];
  executionResult: ExecutionResult | null;
  isMobile: boolean;
  onReset: () => void;
  testCases: TestCase[];
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests' | 'custom') => void;
}

const ChallengeConsole: React.FC<ChallengeConsoleProps> = ({
  output = [],
  executionResult,
  isMobile,
  onReset,
  testCases = [],
  activeTab,
  setActiveTab
}) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current && activeTab === 'output') {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, activeTab]);

  return (
    <div className="h-full overflow-hidden flex flex-col bg-background border-t border-border">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary/80"></div>
          <h3 className="text-sm font-medium text-foreground">Console</h3>
          <div className="flex text-xs ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('output')}
              className={`px-2 py-1 h-7 rounded-l-md ${activeTab === 'output' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Output
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('tests')}
              className={`px-2 py-1 h-7 rounded-r-md ${activeTab === 'tests' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Test Cases
            </Button>
          </div>
        </div>
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="px-2 py-1 h-7 gap-1 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ?
                    <span className="text-destructive">{line}</span> :
                    line.match(/Array|Object|ProblemID|Language|IsRunTestcase|ExecutionResult/) ?
                      <span className="text-primary">{line}</span> :
                      <span className="text-foreground/90">{line}</span>
                  }
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            <div className="text-muted-foreground italic">Run your code to see output here...</div>
          )
        ) : activeTab === 'tests' ? (
          <div>
            <h4 className="text-foreground font-medium mb-2">Run Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div key={tc.id || i} className="p-2.5 rounded-md bg-muted/20 border border-border hover:border-border/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">Test Case {i + 1}</span>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : executionResult && executionResult.passedTestCases > i ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1.5 text-xs space-y-1.5">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Input:</span>
                        <pre className="text-primary font-mono bg-muted p-2 rounded overflow-x-auto">{tc.input}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Expected:</span>
                        <pre className="text-primary font-mono bg-muted p-2 rounded overflow-x-auto">{tc.expected}</pre>
                      </div>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                        <>
                          {executionResult.failedTestCase.received &&
                            <div className="flex flex-col">
                              <span className="text-muted-foreground mb-1">Received:</span>
                              <pre className="text-destructive font-mono bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(executionResult.failedTestCase.received, null, 2)}
                              </pre>
                            </div>
                          }
                          {executionResult.failedTestCase.error &&
                            <div className="flex flex-col">
                              <span className="text-muted-foreground mb-1">Error:</span>
                              <pre className="text-destructive font-mono bg-muted p-2 rounded overflow-x-auto">
                                {executionResult.failedTestCase.error}
                              </pre>
                            </div>
                          }
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">No run test cases available.</div>
            )}

            {executionResult && (
              <div className="mt-4 p-3 bg-muted/20 border border-border rounded-md">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-foreground font-medium">Test Results Summary</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${executionResult.overallPass ? 'bg-green-500/20 text-green-500' : 'bg-destructive/20 text-destructive'}`}>
                      {executionResult.overallPass ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted/50">
                      <div className="text-muted-foreground text-xs">Total</div>
                      <div className="text-foreground font-medium">{executionResult.totalTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-green-500/10">
                      <div className="text-green-500 text-xs">Passed</div>
                      <div className="text-green-500 font-medium">{executionResult.passedTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-destructive/10">
                      <div className="text-destructive text-xs">Failed</div>
                      <div className="text-destructive font-medium">{executionResult.failedTestCases}</div>
                    </div>
                  </div>
                </div>

                {executionResult.failedTestCase?.testCaseIndex !== undefined &&
                  executionResult.failedTestCase?.testCaseIndex !== -1 && (
                    <div className="p-3 rounded-md bg-destructive/5 border border-destructive/20 mt-3">
                      <h4 className="text-destructive font-medium mb-2">Failed Test Case Details</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex">
                          <span className="text-muted-foreground w-24 inline-block">Test Case:</span>
                          <span className="text-foreground">{executionResult.failedTestCase?.testCaseIndex + 1}</span>
                        </div>
                        {executionResult.failedTestCase?.input && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground mb-1">Input:</span>
                            <pre className="text-primary font-mono bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(executionResult.failedTestCase?.input, null, 2)}
                            </pre>
                          </div>
                        )}
                        {executionResult.failedTestCase?.expected && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground mb-1">Expected:</span>
                            <pre className="text-primary font-mono bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(executionResult.failedTestCase?.expected, null, 2)}
                            </pre>
                          </div>
                        )}
                        {executionResult.failedTestCase?.received && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground mb-1">Received:</span>
                            <pre className="text-destructive font-mono bg-muted p-2 rounded overflow-x-auto">
                              {JSON.stringify(executionResult.failedTestCase?.received, null, 2)}
                            </pre>
                          </div>
                        )}
                        {executionResult.failedTestCase?.error && (
                          <div className="flex flex-col">
                            <span className="text-muted-foreground mb-1">Error:</span>
                            <pre className="text-destructive font-mono bg-muted p-2 rounded overflow-x-auto">
                              {executionResult.failedTestCase?.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChallengeConsole;
