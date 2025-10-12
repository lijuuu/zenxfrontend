import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '@/utils/axiosInstance';
import { useGetUserProfile } from '@/services/useGetUserProfile';
import { getProblemMetadataExtended } from '@/api/problem';
import { ProblemMetadata, ExecutionResult, TestCase, twoSumProblem } from '@/api/types';
import { PlaygroundLayout } from '@/components/playground/PlaygroundLayout';
import { TargetTimeModal } from '@/components/playground/TargetTimeModal';
import { useIsMobile } from '@/hooks';

interface PlaygroundProps {
  propsProblemId?: string;
  hideBackButton?: boolean;
  challengeId?: string;
}

type GenericResponse = {
  success: boolean;
  status: number;
  payload: any;
  error?: { errorType: string; message: string };
};


const executeCode = async (
  problemId: string,
  language: string,
  userCode: string,
  isRunTestcase: boolean,
  userId?: string,
  challengeId?: string
): Promise<GenericResponse> => {
  const response = await axiosInstance.post(
    "/problems/execute",
    {
      problemId,
      language,
      userCode,
      isRunTestcase,
      userId,
      challengeId,
    },
    {
      headers: {
        "X-Requires-Auth": "true",
      },
    }
  );
  return response.data;
};

const Playground: React.FC<PlaygroundProps> = ({ propsProblemId, hideBackButton, challengeId }) => {
  // State for problem and code
  const [problemId, setProblemId] = useState<string>('');
  const [problem, setProblem] = useState<ProblemMetadata | null>(null);
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');

  // State for execution and output
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // State for UI and test cases
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [showDescription, setShowDescription] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // State for target time feature
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTargetTimeActive, setIsTargetTimeActive] = useState<boolean>(false);
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState<boolean>(false);
  const [isTargetTimeModalOpen, setIsTargetTimeModalOpen] = useState<boolean>(false);

  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { data: userProfile } = useGetUserProfile();

  // Initialize problem and language
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlProblemId = propsProblemId || queryParams.get('problemId') || '';
    setProblemId(urlProblemId);

    if (!urlProblemId) {
      setIsLoading(false);
      return;
    }

    const storedLanguage = localStorage.getItem('language');
    setIsLoading(true);

    getProblemMetadataExtended(urlProblemId)
      .then(data => {
        setProblem(data);
        const firstLang = storedLanguage && data.supportedLanguages.includes(storedLanguage)
          ? storedLanguage
          : data.supportedLanguages[0] || 'javascript';
        setLanguage(firstLang);
        localStorage.setItem('language', firstLang);

        const codeKey = `${urlProblemId}_${firstLang}`;
        const storedCode = localStorage.getItem(codeKey);
        setCode(storedCode || data.placeholderMaps[firstLang] || '');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problem:', error);
        setProblem(twoSumProblem);
        setLanguage(storedLanguage || 'javascript');
        setIsLoading(false);
      });
  }, [propsProblemId]);

  // Update code when problem or language changes
  useEffect(() => {
    if (problem && language) {
      const codeKey = `${problem.problemId}_${language}`;
      const storedCode = localStorage.getItem(codeKey);
      setCode(storedCode || problem.placeholderMaps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      localStorage.setItem('language', language);
    }
  }, [problem, language]);

  // Save code to localStorage
  useEffect(() => {
    if (problemId && language && code) {
      const codeKey = `${problemId}_${language}`;
      localStorage.setItem(codeKey, code);
    }
  }, [code, problemId, language]);

  // Handle code execution
  const handleCodeExecution = useCallback(async (type: string) => {
    if (!problem) return;

    setIsExecuting(true);
    setOutput([]);
    setExecutionResult(null);
    setIsLoading(true);

    try {
      const data = await executeCode(
        problem.problemId,
        language,
        code,
        type === "run",
        userProfile?.userId,
        challengeId,
      );

      if (!data.success || !data.payload) {
        const errorMessage = data.error ? `${data.error.errorType}: ${data.error.message}` : 'Unknown error occurred';
        setOutput([`[Error] ${errorMessage}`]);
        toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
          description: errorMessage,
        });
        setIsExecuting(false);
        return;
      }

      const payload = data.payload;
      const executionResult = payload.rawoutput;

      if (executionResult.error) {
        setOutput([`[Error] ${executionResult?.error}`]);
        setExecutionResult(executionResult);
        toast.error(`Syntax Error`, {
          description: executionResult.error,
        });
      } else {
        setOutput([
          `problemId: ${payload.problemId}`,
          `language: ${payload.language}`,
          `isRunTestcase: ${payload.isRunTestcase}`,
          `executionResult: ${JSON.stringify(executionResult, null, 2)}`,
        ]);
        setExecutionResult(executionResult);

        if (executionResult.overallPass) {
          toast.success(`${type === 'run' ? 'Run' : 'Submission'} Successful`, {
            description: `All ${executionResult.totalTestCases} test cases passed!`,
          });
        } else {
          toast[type === 'run' ? 'warning' : 'error'](
            `${type === 'run' ? 'Run' : 'Submission'} ${!executionResult.overallPass ? ' Successful' : 'Failed'}`,
            {
              description: `${executionResult.passedTestCases} of ${executionResult.totalTestCases} test cases passed.`,
            }
          );
        }
      }
    } catch (error) {
      const rawError = error as any;
      const cliError =
        rawError?.response?.data?.payload?.rawoutput?.failedTestCase?.error ??
        rawError?.response?.data?.payload?.rawoutput?.error;


      const fallbackMessage =
        rawError?.response?.data?.error?.message ??
        (error instanceof Error ? error.message : 'Execution failed');

      const finalErrorMessage = cliError?.trim()
        ? cliError.trim()
        : fallbackMessage;

      setOutput([`[Error] ${finalErrorMessage}`]);

      toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
        description: finalErrorMessage,
      });
    } finally {
      setIsLoading(false);
      setIsExecuting(false);
    }
  }, [code, problem, language, userProfile?.userId, challengeId]);

  // Target time timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTargetTimeActive && timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            // Time's up - auto submit
            if (!hasAutoSubmitted) {
              setHasAutoSubmitted(true);
              handleCodeExecution('submit');
            }
            setIsTargetTimeActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTargetTimeActive, timeRemaining, hasAutoSubmitted, handleCodeExecution]);

  // Handle code reset
  const handleResetCode = () => {
    if (problem && language) {
      setIsResetModalOpen(true);
    }
  };

  const confirmResetCode = () => {
    if (problem && language) {
      const codeKey = `${problem.problemId}_${language}`;
      localStorage.removeItem(codeKey);
      setCode(problem.placeholderMaps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      setCustomTestCases([]);
      toast.info('Code Reset', { description: 'Editor reset to default code.' });
      setIsResetModalOpen(false);
    }
  };

  const cancelResetCode = () => {
    setIsResetModalOpen(false);
  };


  const handleAddCustomTestCase = (input: string, expected: string) => {
    setCustomTestCases(prev => [...prev, { input, expected }]);
    toast.success('Custom Test Case Added', { description: 'Added to your test cases.' });
  };

  // Target time functions
  const handleSetTargetTime = (minutes: number) => {
    setTargetTime(minutes);
    setTimeRemaining(minutes * 60);
    setIsTargetTimeActive(true);
    setHasAutoSubmitted(false);
    toast.success('Target Time Started', {
      description: `Timer set for ${minutes} minute${minutes !== 1 ? 's' : ''}. Auto-submit when time expires.`,
    });
  };

  const handleStopTargetTime = () => {
    setIsTargetTimeActive(false);
    setTimeRemaining(null);
    setTargetTime(null);
    setHasAutoSubmitted(false);
    toast.info('Target Time Stopped', {
      description: 'Timer has been cancelled.',
    });
  };

  const handleOpenTargetTimeModal = () => {
    setIsTargetTimeModalOpen(true);
  };

  const handleCloseTargetTimeModal = () => {
    setIsTargetTimeModalOpen(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <>
      <PlaygroundLayout
        problem={problem}
        isLoading={isLoading}
        isMobile={isMobile}
        hideBackButton={hideBackButton}
        showDescription={showDescription}
        setShowDescription={setShowDescription}
        language={language}
        setLanguage={setLanguage}
        code={code}
        setCode={setCode}
        output={output}
        executionResult={executionResult}
        isExecuting={isExecuting}
        customTestCases={customTestCases}
        isResetModalOpen={isResetModalOpen}
        handleCodeExecution={handleCodeExecution}
        handleResetCode={handleResetCode}
        confirmResetCode={confirmResetCode}
        cancelResetCode={cancelResetCode}
        handleAddCustomTestCase={handleAddCustomTestCase}
        navigate={navigate}
        targetTime={targetTime}
        timeRemaining={timeRemaining}
        isTargetTimeActive={isTargetTimeActive}
        hasAutoSubmitted={hasAutoSubmitted}
        handleSetTargetTime={handleSetTargetTime}
        handleStopTargetTime={handleStopTargetTime}
        formatTime={formatTime}
        handleOpenTargetTimeModal={handleOpenTargetTimeModal}
      />

      {/* Target Time Modal */}
      <TargetTimeModal
        isOpen={isTargetTimeModalOpen}
        onClose={handleCloseTargetTimeModal}
        onSetTargetTime={handleSetTargetTime}
        currentTargetTime={targetTime}
      />
    </>
  );
};

export default Playground;