import React, { useState, useEffect, useCallback } from 'react';
import { Play, RefreshCw, ArrowLeft, Plus, Loader2, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import { ProblemDescription } from './ProblemDescription';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Timer } from './Timer';
import Loader3 from '../ui/loader3';
import CodeResetModal from '@/components/common/CodeResetModal';

import {
  TestCase,
  ProblemMetadata,
  ExecutionResult,
  ApiResponsePayload,
  twoSumProblem
} from '@/api/types';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000'}/api/v1`;

const mapDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    case 'easy': return 'Easy';
    case 'medium': return 'Medium';
    case 'hard': return 'Hard';
    default: return difficulty;
  }
};

const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  const response = await fetch(`${API_BASE_URL}/problems/metadata?problem_id=${problemId}`);
  if (!response.ok) throw new Error('Failed to fetch problem');
  const data = await response.json();
  const problemData = data.payload || data;
  return {
    problem_id: problemData.problem_id || '',
    title: problemData.title || 'Untitled',
    description: problemData.description || '',
    tags: problemData.tags || [],
    testcase_run: problemData.testcase_run || { run: [] },
    difficulty: mapDifficulty(problemData.difficulty || ''),
    supported_languages: problemData.supported_languages || [],
    validated: problemData.validated || false,
    placeholder_maps: problemData.placeholder_maps || {},
  };
};

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

interface ZenXPlaygroundProps {
  propsProblemID?: string;
  hideBackButton?: boolean;
}

const ZenXPlayground: React.FC<ZenXPlaygroundProps> = ({ propsProblemID, hideBackButton }) => {
  const [problemId, setProblemId] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [problem, setProblem] = useState<ProblemMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'custom'>('tests');
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfile();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlProblemId = propsProblemID || queryParams.get('problem_id') || '';
    setProblemId(urlProblemId);

    if (!urlProblemId) {
      setIsLoading(false);
      return;
    }

    const storedLanguage = localStorage.getItem('language');

    setIsLoading(true);
    fetchProblemById(urlProblemId)
      .then(data => {
        setProblem(data);
        const firstLang = storedLanguage && data.supported_languages.includes(storedLanguage)
          ? storedLanguage
          : data.supported_languages[0] || 'javascript';
        setLanguage(firstLang);
        localStorage.setItem('language', firstLang);

        const codeKey = `${urlProblemId}_${firstLang}`;
        const storedCode = localStorage.getItem(codeKey);
        setCode(storedCode || data.placeholder_maps[firstLang] || '');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problem:', error);
        setProblem(twoSumProblem);
        setLanguage(storedLanguage || 'javascript');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (problem && language) {
      const codeKey = `${problem.problem_id}_${language}`;
      const storedCode = localStorage.getItem(codeKey);
      setCode(storedCode || problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      localStorage.setItem('language', language);
    }
  }, [problem, language]);

  useEffect(() => {
    if (problemId && language && code) {
      const codeKey = `${problemId}_${language}`;
      localStorage.setItem(codeKey, code);
    }
  }, [code, problemId, language]);

  const handleResetCode = () => {
    if (problem && language) {
      setIsResetModalOpen(true);
    }
  };

  const confirmResetCode = () => {
    if (problem && language) {
      const codeKey = `${problem.problem_id}_${language}`;
      localStorage.removeItem(codeKey);
      setCode(problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      setCustomTestCases([]);
      setConsoleTab('tests');
      toast.info('Code Reset', { description: 'Editor reset to default code.' });
      setIsResetModalOpen(false);
    }
  };

  const cancelResetCode = () => {
    setIsResetModalOpen(false);
  };

  // New function to reset console output
  const handleResetOutput = () => {
    setOutput([]); // Clear the output
    setExecutionResult(null); // Clear the execution result
    setConsoleTab('tests'); // Switch back to the 'tests' tab
    toast.info('Output Reset', { description: 'Console output has been cleared.' }); // Notify the user
  };

  const handleCodeExecutionViaHTTP = useCallback(async (type: string) => {
    if (!problem) return;

    setIsExecuting(true);
    setOutput([]);
    setExecutionResult(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(
        "/problems/execute",
        {
          problem_id: problem.problem_id,
          language: language,
          user_code: code,
          is_run_testcase: type === "run",
          user_id: userProfile?.userID
        },
        {
          headers: {
            "X-Requires-Auth": "true",
          },
        }
      );

      type GenericResponse = {
        success: boolean;
        status: number;
        payload: ApiResponsePayload;
        error?: { errorType: string; message: string };
      };

      const data: GenericResponse = response.data;

      if (!data.success || !data.payload) {
        const errorMessage = data.error ? `${data.error.errorType}: ${data.error.message}` : 'Unknown error occurred';
        setOutput([`[Error] ${errorMessage}`]);
        setConsoleTab('output');
        toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
          description: errorMessage,
        });
        setIsExecuting(false);
        return;
      }

      const payload = data.payload;
      const executionResult = payload.rawoutput;

      if (executionResult.syntaxError) {
        setOutput([`[Error] Syntax Error: ${executionResult.syntaxError}`]);
        setExecutionResult(executionResult);
        setConsoleTab('output');
        toast.error(`Syntax Error`, {
          description: executionResult.syntaxError,
        });
      } else {
        setOutput([
          `problemID: ${payload.problem_id}`,
          `language: ${payload.language}`,
          `isRunTestcase: ${payload.is_run_testcase}`,
          `executionResult: ${JSON.stringify(executionResult, null, 2)}`,
        ]);
        setExecutionResult(executionResult);

        if (executionResult.overallPass) {
          toast.success(`${type === 'run' ? 'Run' : 'Submission'} Successful`, {
            description: `All ${executionResult.totalTestCases} test cases passed!`,
          });
          setConsoleTab('tests');
        } else {
          toast[type === 'run' ? 'warning' : 'error'](
            `${type === 'run' ? 'Run' : 'Submission'} ${!executionResult.overallPass ? ' Successful' : 'Failed'}`,
            {
              description: `${executionResult.passedTestCases} of ${executionResult.totalTestCases} test cases passed.`,
            }
          );
          setConsoleTab('tests');
        }
      }
    } catch (error) {
      const rawError = error as any;
      const errorMessage =
        rawError?.data?.payload?.randomoutput?.failedTestCase?.error ||
        (error instanceof Error ? error.message : 'Network error occurred');

      setOutput([`[Error] ${errorMessage}`]);
      setConsoleTab('output');
      toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsExecuting(false);
    }
  }, [code, problem, language]);

  const handleAddCustomTestCase = (input: string, expected: string) => {
    setCustomTestCases(prev => [...prev, { input, expected }]);
    toast.success('Custom Test Case Added', { description: 'Added to your test cases.' });
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-50">
        <Loader3 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-zinc-300">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-red-500">Problem Not Found</h1>
          <p className="text-zinc-400">
            We couldn't find the problem you're looking for. Please check the URL and try again.
          </p>
          {!hideBackButton && (
            <Button
              variant="outline"
              onClick={() => window.location.href = '/problems'}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 mt-4 text-sm px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problem List
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen min-w-full bg-zinc-950 flex flex-col">
      <div className="h-12 px-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {!hideBackButton && (
            <ArrowLeft
              className="h-5 w-5 text-zinc-500 cursor-pointer hover:text-green-500 transition-colors"
              onClick={() => navigate("/problems")}
            />
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescription(!showDescription)}
              className="text-zinc-300 hover:text-green-500"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 truncate">
            <Timer />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="text-xs rounded-md bg-zinc-800 border-zinc-700 text-zinc-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500/30"
          >
            {problem.supported_languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
          <Button
            onClick={() => handleCodeExecutionViaHTTP('run')}
            className="h-8 bg-yellow-700 hover:bg-yellow-800 text-zinc-300 border border-zinc-700 text-xs px-3"
            disabled={isExecuting}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
          <Button
            onClick={() => handleCodeExecutionViaHTTP('submit')}
            className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs px-3"
            disabled={isExecuting}
          >
            Submit
          </Button>
          <Button
            onClick={handleResetCode}
            className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs px-3"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {isMobile ? (
            showDescription && (
              <ResizablePanel
                defaultSize={40}
                minSize={30}
                maxSize={60}
                className="bg-zinc-900"
              >
                <ProblemDescription problem={problem} hideBackButton={true} />
              </ResizablePanel>
            )
          ) : (
            <>
              <ResizablePanel
                defaultSize={30}
                minSize={25}
                maxSize={50}
                className="bg-zinc-900"
              >
                <ProblemDescription problem={problem} hideBackButton={true} />
              </ResizablePanel>
              <ResizableHandle className="w-1.5 bg-zinc-800" />
            </>
          )}

          <ResizablePanel defaultSize={isMobile ? (showDescription ? 60 : 100) : 70} className="flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={isMobile ? 60 : 70} minSize={40} maxSize={80}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  loading={isLoading}
                />
              </ResizablePanel>
              <ResizableHandle className="h-1.5 bg-zinc-800" />
              <ResizablePanel defaultSize={isMobile ? 40 : 30} minSize={20}>
                <Console
                  output={output}
                  executionResult={executionResult}
                  isMobile={isMobile}
                  onResetOutput={handleResetOutput} 
                  testCases={problem.testcase_run?.run || []}
                  customTestCases={customTestCases}
                  onAddCustomTestCase={handleAddCustomTestCase}
                  activeTab={consoleTab}
                  setActiveTab={setConsoleTab}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <CodeResetModal
        isOpen={isResetModalOpen}
        onResetCancel={cancelResetCode}
        onResetConfirm={confirmResetCode}
      />
    </div>
  );
};

export default ZenXPlayground;