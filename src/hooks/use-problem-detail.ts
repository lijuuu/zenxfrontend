
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProblemByIdAPI, executeCode } from '@/api/problemApi';
import { ProblemMetadata, TestCase, ExecutionResult, GenericResponse } from '@/api/types/problem-execution';
import { useIsMobile } from '@/hooks/use-mobile';

export const useProblemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const isMobile = useIsMobile();

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
        const problemData = await fetchProblemByIdAPI(id);
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
      const response = await executeCode(
        problem.problem_id,
        language,
        code,
        type === 'run'
      );
      
      // Add type assertion to handle the response properly
      const typedResponse = response as GenericResponse;
      
      if (!typedResponse.success) {
        // Handle error case
        let errorMsg = 'Execution error';
        
        if (typedResponse.error) {
          errorMsg = `${typedResponse.error.errorType}: ${typedResponse.error.message}`;
        } else if (typedResponse.payload.rawoutput.syntaxError) {
          errorMsg = typedResponse.payload.rawoutput.syntaxError;
        }
        
        setOutput([`[Error] ${errorMsg}`]);
        setExecutionResult(typedResponse.payload.rawoutput);
        setConsoleTab('output');
        
        toast.error(`${type === 'run' ? 'Run' : 'Submit'} failed`, {
          description: errorMsg
        });
      } else {
        // Handle success case
        const result = typedResponse.payload.rawoutput;
        
        setExecutionResult(result);
        
        if (result.overallPass) {
          setOutput([
            "Execution successful!",
            `All ${result.totalTestCases} test cases passed.`,
            `Status: ${type === 'run' ? 'Run' : 'Submission'} successful`
          ]);
          
          toast.success(`${type === 'run' ? 'Run' : 'Submission'} successful`, {
            description: `All ${result.totalTestCases} test cases passed!`
          });
          
          setConsoleTab('output');
        } else {
          setOutput([
            `[Warning] ${result.passedTestCases}/${result.totalTestCases} test cases passed.`,
            "See the 'Test Cases' tab for details."
          ]);
          
          toast.warning(`${result.passedTestCases} of ${result.totalTestCases} test cases passed`, {
            description: "Check the Test Cases tab for details"
          });
          
          setConsoleTab('tests');
        }
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Network error occurred';
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
