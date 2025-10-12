import React, { useState, useEffect } from 'react';
import ReactJson from 'react-json-view';
import { ExecutionResult, ProblemMetadata } from '@/api/types';
import { geminiService, CodeAnalysis } from '@/services/geminiService';
import { ComplexityGraph } from './ComplexityGraph';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

interface OutputTabProps {
  executionResult: ExecutionResult | null;
  output: string[];
  problem?: ProblemMetadata;
  code?: string;
  language?: string;
}

//utility function to check if a string is json like for output lines
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

export const OutputTab: React.FC<OutputTabProps> = ({
  executionResult,
  output,
  problem,
  code = '',
  language = 'javascript'
}) => {
  const [showComplexity, setShowComplexity] = useState(false);
  const [complexityAnalysis, setComplexityAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastOutputHash, setLastOutputHash] = useState<string>('');

  //generate hash for current output to detect changes
  const generateOutputHash = (output: string[], code: string) => {
    return `${output.join('|')}_${code}`;
  };

  const currentOutputHash = generateOutputHash(output, code);

  //clear analysis when output changes new run submission
  useEffect(() => {
    if (currentOutputHash !== lastOutputHash && lastOutputHash !== '') {
      setComplexityAnalysis(null);
      setShowComplexity(false);
    }
    setLastOutputHash(currentOutputHash);
  }, [currentOutputHash, lastOutputHash]);

  //no auto prefetch user must click analyze button

  const handleAnalyzeClick = () => {
    if (!code) return;
    setShowConfirmation(true);
  };

  const handleAnalyzeComplexity = async () => {
    if (!code || isAnalyzing) return;

    setIsAnalyzing(true);
    setShowConfirmation(false);
    try {
      const analysis = await geminiService.analyzeCode(code, language, output);
      setComplexityAnalysis(analysis);
      setShowComplexity(true);
    } catch (error) {
      console.error('Error analyzing complexity:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAnalysis = () => {
    handleAnalyzeComplexity();
  };

  const handleCancelAnalysis = () => {
    setShowConfirmation(false);
  };
  if (!executionResult && output.length === 0) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="text-6xl">📊</div>
            <h3 className="text-xl font-semibold text-zinc-300">Output</h3>
            <p className="text-zinc-500">Run or submit your code to see results here</p>
            {code && (
              <Button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Code
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6">
        {/*analyze button when there's output but no analysis*/}
        {output.length > 0 && code && !complexityAnalysis && !isAnalyzing && (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Code Analysis Available</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Get insights about your code's complexity, performance, and potential improvements.
            </p>
            <Button
              onClick={handleAnalyzeClick}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Code
            </Button>
          </div>
        )}

        {/*analysis fetching state*/}
        {isAnalyzing && (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4 text-center">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold text-white">Analyzing Code</h3>
                <p className="text-zinc-400 text-sm">Please wait while we analyze your code...</p>
              </div>
            </div>
          </div>
        )}

        {/*complexity analysis section*/}
        {complexityAnalysis && (
          <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Code Analysis</h3>
              {/*only show details button when there's output*/}
              {output.length > 0 && (
                <Button
                  onClick={() => setShowComplexity(!showComplexity)}
                  size="sm"
                  variant="outline"
                  className="text-zinc-400 hover:text-white border-zinc-700"
                >
                  {showComplexity ? 'Hide Details' : 'Show Details'}
                </Button>
              )}
            </div>

            {showComplexity ? (
              <ComplexityGraph analysis={complexityAnalysis} />
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{complexityAnalysis.complexity.timeComplexity}</div>
                  <div className="text-xs text-zinc-500">Time Complexity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{complexityAnalysis.complexity.spaceComplexity}</div>
                  <div className="text-xs text-zinc-500">Space Complexity</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${complexityAnalysis.complexity.overallComplexity === 'Low' ? 'text-green-400' :
                    complexityAnalysis.complexity.overallComplexity === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                    {complexityAnalysis.complexity.overallComplexity}
                  </div>
                  <div className="text-xs text-zinc-500">Overall</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/*test case summary section - show first*/}
        {executionResult && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Test Results Summary</h3>
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-zinc-300 font-medium">Overall Result</span>
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
              </div>

              {executionResult.failedTestCase?.testCaseIndex !== undefined &&
                executionResult.failedTestCase?.testCaseIndex !== -1 && (
                  <div className="p-4 rounded-md bg-red-900/20 border border-red-900/30">
                    <h4 className="text-red-400 font-medium mb-3">Failed Test Case Details</h4>
                    <div className="space-y-3 text-sm">
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
          </div>
        )}

        {/*raw output section - show at the end*/}
        {output.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Raw Output</h3>
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4 font-mono text-sm">
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
            </div>
          </div>
        )}
      </div>

      {/*confirmation dialog for code analysis*/}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl">🤖</div>
              <h3 className="text-lg font-semibold text-white">Code Analysis Available</h3>
              <p className="text-zinc-400 text-sm">
                Would you like to receive hints and analysis about your code?
                This will analyze complexity, identify issues, and suggest improvements.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleCancelAnalysis}
                  variant="outline"
                  size="sm"
                  className="text-zinc-400 hover:text-white border-zinc-700"
                >
                  No, thanks
                </Button>
                <Button
                  onClick={handleConfirmAnalysis}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Yes, analyze my code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
