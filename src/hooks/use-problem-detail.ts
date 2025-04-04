
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from './index';
import { ProblemMetadata, TestCase, ExecutionResult } from '@/api/types/problem-execution';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';

export const useProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [problem, setProblem] = useState<ProblemMetadata | null>(null);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'custom'>('tests');

  // Fetch problem data
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    const fetchProblem = async () => {
      try {
        const response = await axiosInstance.get(`/problems/${id}`);
        const problemData = response.data.payload;
        setProblem(problemData);
        
        // Get stored language preference
        const storedLanguage = localStorage.getItem('zenx-preferred-language') || 'javascript';
        const availableLanguage = problemData.supported_languages.includes(storedLanguage) 
          ? storedLanguage 
          : problemData.supported_languages[0];
        
        setLanguage(availableLanguage);
        
        // Try to load saved code
        const codeKey = `zenx-code-${id}-${availableLanguage}`;
        const savedCode = localStorage.getItem(codeKey);
        setCode(savedCode || problemData.placeholder_maps[availableLanguage] || '');
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        toast.error('Failed to load problem data');
        setIsLoading(false);
      }
    };
    
    fetchProblem();
  }, [id]);
  
  // Save code to localStorage and update when language changes
  useEffect(() => {
    if (!problem || !id) return;
    
    // Update localStorage when language changes
    localStorage.setItem('zenx-preferred-language', language);
    
    // Try to load saved code for the new language
    const codeKey = `zenx-code-${id}-${language}`;
    const savedCode = localStorage.getItem(codeKey);
    
    // Only update if we have saved code or a placeholder
    if (savedCode || problem.placeholder_maps[language]) {
      setCode(savedCode || problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
    }
  }, [problem, language, id]);
  
  // Save code changes to localStorage
  useEffect(() => {
    if (!id || !code || !language) return;
    
    const codeKey = `zenx-code-${id}-${language}`;
    localStorage.setItem(codeKey, code);
  }, [code, id, language]);
  
  // Handle running and submitting code
  const handleCodeExecution = useCallback(async (type: 'run' | 'submit') => {
    if (!problem || !id) return;
    
    setIsExecuting(true);
    setOutput(["Running code..."]);
    setExecutionResult(null);
    
    try {
      const response = await axiosInstance.post('/code/execute', {
        problem_id: problem.problem_id,
        language,
        code,
        is_run_testcase: type === 'run'
      });
      
      const result = response.data;
      
      if (!result.success) {
        // Handle error case
        let errorMsg = 'Execution error';
        
        if (result.error) {
          errorMsg = `${result.error.errorType}: ${result.error.message}`;
        } else if (result.payload.rawoutput.syntaxError) {
          errorMsg = result.payload.rawoutput.syntaxError;
        }
        
        setOutput([`[Error] ${errorMsg}`]);
        setExecutionResult(result.payload.rawoutput);
        setConsoleTab('output');
        
        toast.error(`${type === 'run' ? 'Run' : 'Submit'} failed`, {
          description: errorMsg
        });
      } else {
        // Handle success case
        const executionResult = result.payload.rawoutput;
        
        setExecutionResult(executionResult);
        
        if (executionResult.overallPass) {
          setOutput([
            "Execution successful!",
            `All ${executionResult.totalTestCases} test cases passed.`,
            `Status: ${type === 'run' ? 'Run' : 'Submission'} successful`
          ]);
          
          toast.success(`${type === 'run' ? 'Run' : 'Submission'} successful`, {
            description: `All ${executionResult.totalTestCases} test cases passed!`
          });
          
          setConsoleTab('output');
        } else {
          setOutput([
            `[Warning] ${executionResult.passedTestCases}/${executionResult.totalTestCases} test cases passed.`,
            "See the 'Test Cases' tab for details."
          ]);
          
          toast.warning(`${executionResult.passedTestCases} of ${executionResult.totalTestCases} test cases passed`, {
            description: "Check the Test Cases tab for details"
          });
          
          setConsoleTab('tests');
        }
      }
    } catch (error) {
      const errorMsg = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : 'Network error occurred';
      
      setOutput([`[Error] ${errorMsg}`]);
      
      toast.error(`${type === 'run' ? 'Run' : 'Submit'} failed`, {
        description: errorMsg
      });
    } finally {
      setIsExecuting(false);
    }
  }, [problem, id, language, code]);
  
  const handleResetCode = useCallback(() => {
    if (!problem || !id) return;
    
    const codeKey = `zenx-code-${id}-${language}`;
    localStorage.removeItem(codeKey);
    
    setCode(problem.placeholder_maps[language] || '');
    setOutput([]);
    setExecutionResult(null);
    setCustomTestCases([]);
    
    toast.info('Code reset', {
      description: 'Code has been reset to the default template'
    });
  }, [problem, id, language]);
  
  const handleAddCustomTestCase = useCallback((input: string, expected: string) => {
    setCustomTestCases(prev => [...prev, { input, expected }]);
    
    toast.success('Custom test case added');
  }, []);

  return {
    isLoading,
    problem,
    language,
    setLanguage,
    code,
    setCode,
    output,
    executionResult,
    isExecuting,
    customTestCases,
    consoleTab,
    setConsoleTab,
    isMobile,
    handleCodeExecution,
    handleResetCode,
    handleAddCustomTestCase
  };
};
