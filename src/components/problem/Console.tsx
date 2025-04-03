
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, XCircle, Plus, Terminal, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestCase, ExecutionResult } from "@/api/types/problem-execution";

interface ConsoleProps {
  output: string[];
  executionResult: ExecutionResult | null;
  onReset: () => void;
  testCases: TestCase[];
  customTestCases: TestCase[];
  onAddCustomTestCase: (input: string, expected: string) => void;
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests' | 'custom') => void;
}

export const Console = ({ 
  output = [], 
  executionResult, 
  onReset, 
  testCases = [], 
  customTestCases = [], 
  onAddCustomTestCase, 
  activeTab, 
  setActiveTab 
}: ConsoleProps) => {
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current && activeTab === 'output') {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, activeTab]);

  const handleAddCustomTestCase = () => {
    if (customInput && customExpected) {
      onAddCustomTestCase(customInput, customExpected);
      setCustomInput('');
      setCustomExpected('');
    }
  };

  // Function to prettify JSON but keep formatting
  const formatTestCase = (jsonString: string) => {
    try {
      // We're displaying the raw JSON string as requested
      return jsonString;
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <motion.div 
      className="h-full overflow-hidden flex flex-col bg-zinc-900 border-t border-zinc-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-white">Console</h3>
          <div className="flex text-xs ml-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('output')} 
              className={`px-2 py-1 h-7 rounded-l-md ${activeTab === 'output' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Terminal className="h-3.5 w-3.5 mr-1" />
              Output
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('tests')} 
              className={`px-2 py-1 h-7 ${activeTab === 'tests' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Server className="h-3.5 w-3.5 mr-1" />
              Test Cases
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('custom')} 
              className={`px-2 py-1 h-7 rounded-r-md ${activeTab === 'custom' ? 'bg-green-600 text-white hover:bg-green-700' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Custom Tests
            </Button>
          </div>
        </div>
        <motion.button 
          onClick={onReset} 
          className="px-2 py-1 rounded-md flex items-center gap-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <RefreshCw className="h-4 w-4" /> Reset
        </motion.button>
      </div>
      
      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-[#1A1D23]">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ? 
                    <span className="text-red-400">{line}</span> : 
                    line.match(/Array|Object|ProblemID|Language|IsRunTestcase|ExecutionResult/) ? 
                    <span className="text-green-500">{line}</span> : 
                    <span className="text-zinc-300">{line}</span>
                  }
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            <div className="text-zinc-500 italic">Run your code to see output here...</div>
          )
        ) : activeTab === 'tests' ? (
          <div>
            <h4 className="text-white font-medium mb-2">Run Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div key={tc.id || i} className="p-2.5 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
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
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{formatTestCase(tc.input)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-500 mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                      </div>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                        <>
                          {JSON.stringify(executionResult.failedTestCase.received) && 
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Received:</span>
                              <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase.received, null, 2)}</pre>
                            </div>
                          }
                          {executionResult.failedTestCase.error && 
                            <div className="flex flex-col">
                              <span className="text-zinc-500 mb-1">Error:</span>
                              <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{executionResult.failedTestCase.error}</pre>
                            </div>
                          }
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
                    <span className={`text-xs px-2 py-0.5 rounded-full ${executionResult.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
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
                
                {executionResult.failedTestCase?.testCaseIndex !== undefined && executionResult.failedTestCase?.testCaseIndex !== -1 && (
                  <div className="p-3 rounded-md bg-red-900/20 border border-red-900/30 mt-3">
                    <h4 className="text-red-400 font-medium mb-2">Failed Test Case Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex">
                        <span className="text-zinc-400 w-24 inline-block">Test Case:</span>
                        <span className="text-zinc-300">{executionResult.failedTestCase?.testCaseIndex + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Input:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.input, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.expected, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-zinc-400 mb-1">Received:</span>
                        <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.received, null, 2)}</pre>
                      </div>
                      {executionResult.failedTestCase?.error && 
                        <div className="flex flex-col">
                          <span className="text-zinc-400 mb-1">Error:</span>
                          <pre className="text-red-400 font-mono bg-black/30 p-2 rounded overflow-x-auto">{executionResult.failedTestCase?.error}</pre>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-5 p-3 rounded-md border border-zinc-800/80 bg-zinc-900/40">
              <h4 className="text-white font-medium mb-3">Add Custom Test Case</h4>
              <Input
                placeholder='e.g., { "nums": [2,7,11,15], "target": 9 }'
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="mb-2 bg-zinc-900/80 text-zinc-300 border-zinc-800/80 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
              />
              <Input
                placeholder="e.g., [0,1]"
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                className="mb-3 bg-zinc-900/80 text-zinc-300 border-zinc-800/80 focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20"
              />
              <Button 
                onClick={handleAddCustomTestCase} 
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
              </Button>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2 flex items-center">
                <span>Custom Test Cases</span>
                {customTestCases.length > 0 && 
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {customTestCases.length}
                  </span>
                }
              </h4>
              
              {customTestCases.length > 0 ? (
                <div className="space-y-2">
                  {customTestCases.map((tc, i) => (
                    <div key={i} className="p-2.5 rounded-md bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
                      <div className="text-xs font-medium text-zinc-400 mb-1.5">Custom Test #{i+1}</div>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-zinc-500 text-xs mb-1">Input:</span>
                          <pre className="text-green-500 font-mono bg-black/30 p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.input)}</pre>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-zinc-500 text-xs mb-1">Expected:</span>
                          <pre className="text-green-500 font-mono bg-black/30 p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 italic py-4 text-center bg-zinc-900/20 rounded-md border border-dashed border-zinc-800/50">
                  No custom test cases added yet...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Console;
