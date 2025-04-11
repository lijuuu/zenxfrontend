import { mockProblems, mockSubmissions, twoSumProblem } from './mockData';
import { Problem, Submission, CompileRequest, CompileResponse } from './types';

// API functions
export const getProblems = async (filters?: { difficulty?: string; tags?: string[]; solved?: boolean; search?: string }): Promise<Problem[]> => {
  return new Promise(resolve => {
    let filteredProblems = [...mockProblems];
    
    if (filters) {
      if (filters.difficulty) {
        filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredProblems = filteredProblems.filter(p => 
          filters.tags!.some(tag => p.tags.includes(tag))
        );
      }
      
      if (filters.solved !== undefined) {
        filteredProblems = filteredProblems.filter(p => p.solved === filters.solved);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProblems = filteredProblems.filter(p => 
          p.title.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Ensure all problems have properly typed difficulties
    const typedProblems = filteredProblems.map(problem => ({
      ...problem,
      difficulty: problem.difficulty as "Easy" | "Medium" | "Hard"
    }));
    
    setTimeout(() => resolve(typedProblems), 600);
  });
};

export const getProblem = async (idOrSlug: string): Promise<Problem | null> => {
  return new Promise(resolve => {
    // For any problem id/slug, return the Two Sum problem when no data from server
    const problem = mockProblems[0];
    
    // Ensure problem has properly typed difficulty
    const typedProblem = {
      ...problem,
      difficulty: problem.difficulty as "Easy" | "Medium" | "Hard"
    };
    
    setTimeout(() => resolve(typedProblem), 500);
  });
};

export const getSubmissions = async (problemId?: string): Promise<Submission[]> => {
  return new Promise(resolve => {
    let filteredSubmissions = [...mockSubmissions];
    
    if (problemId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.problemId === problemId);
    }
    
    // Map the mock submissions to match the Submission type
    const typedSubmissions: Submission[] = filteredSubmissions.map(submission => ({
      id: submission.id,
      userId: submission.userId,
      problemId: submission.problemId,
      submittedAt: submission.timestamp || new Date().toISOString(),
      status: submission.status === "Accepted" ? "SUCCESS" : 
              submission.status === "Wrong Answer" ? "FAILED" :
              submission.status === "Time Limit Exceeded" || submission.status === "Memory Limit Exceeded" ? "PROCESSING" : "PENDING",
      userCode: submission.code,
      language: submission.language,
      score: Math.floor(Math.random() * 100),
      difficulty: submission.difficulty === "Easy" ? "E" : submission.difficulty === "Medium" ? "M" : "H",
      isFirst: Math.random() > 0.7,
      title: submission.problemTitle || "Problem Title"
    }));
    
    setTimeout(() => resolve(typedSubmissions), 500);
  });
};

export const submitSolution = async (submission: Omit<Submission, 'id' | 'submittedAt' | 'status' | 'score' | 'isFirst'>): Promise<Submission> => {
  return new Promise(resolve => {
    // Simulate backend validation and testing
    const problem = mockProblems.find(p => p.id === submission.problemId);
    const isCorrect = Math.random() > 0.3; // 70% chance of success
    
    const status: Submission['status'] = isCorrect ? "SUCCESS" : "FAILED";
    
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      ...submission,
      submittedAt: new Date().toISOString(),
      status,
      score: isCorrect ? Math.floor(Math.random() * 50) + 10 : 0,
      isFirst: Math.random() > 0.8,
    };
    
    setTimeout(() => resolve(newSubmission), 1500);
  });
};

export const compileAndRun = async (request: CompileRequest): Promise<CompileResponse> => {
  return new Promise(resolve => {
    // Simulate compiler output
    const hasError = Math.random() > 0.8; // 20% chance of error
    
    if (hasError) {
      setTimeout(() => resolve({
        output: "",
        error: `Compilation error in ${request.language}:\nSyntax error at line ${Math.floor(Math.random() * 10) + 1}`,
      }), 1000);
    } else {
      setTimeout(() => resolve({
        output: request.input 
          ? `Input: ${request.input}\nOutput: Result for the given input`
          : "Code compiled and ran successfully!",
        executionTime: `${Math.floor(Math.random() * 100)} ms`,
        memory: `${Math.floor(Math.random() * 10 + 5)} MB`
      }), 1000);
    }
  });
};

export const runTestCases = async (problemId: string, code: string, language: string): Promise<{ passed: boolean; results: any[] }> => {
  return new Promise(resolve => {
    const problem = mockProblems.find(p => p.id === problemId);
    
    if (!problem) {
      setTimeout(() => resolve({ passed: false, results: [] }), 800);
      return;
    }
    
    const results = problem.examples.map(example => {
      const passed = Math.random() > 0.3; // 70% chance of success
      
      return {
        input: example.input,
        expectedOutput: example.output,
        actualOutput: passed ? example.output : "Different output",
        passed
      };
    });
    
    const allPassed = results.every(r => r.passed);
    
    setTimeout(() => resolve({ 
      passed: allPassed,
      results
    }), 1500);
  });
};

// Add these new functions for the problem execution
export const fetchProblemByIdAPI = async (problemId: string) => {
  // Always return the Two Sum problem data for ZenXPlayground
  
  // Map the mock data to the expected format
  return twoSumProblem;
};

export const executeCode = async (
  problemId: string,
  language: string,
  code: string,
  isRunTestcase: boolean
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a simulated success response (70% chance)
      const success = Math.random() > 0.3;
      
      if (success) {
        const passedCount = Math.floor(Math.random() * 4); // 0-3 passed tests
        const totalCount = 3; // Mock 3 test cases
        
        resolve({
          success: true,
          status: 200,
          payload: {
            problem_id: problemId,
            language,
            is_run_testcase: isRunTestcase,
            rawoutput: {
              totalTestCases: totalCount,
              passedTestCases: passedCount,
              failedTestCases: totalCount - passedCount,
              overallPass: passedCount === totalCount,
              failedTestCase: passedCount < totalCount ? {
                testCaseIndex: passedCount,
                input: { nums: [2, 7, 11, 15], target: 9 },
                expected: [0, 1],
                received: [1, 0],
                passed: false
              } : undefined
            }
          }
        });
      } else {
        // Simulate error response
        resolve({
          success: false,
          status: 400,
          payload: {
            problem_id: problemId,
            language,
            is_run_testcase: isRunTestcase,
            rawoutput: {
              totalTestCases: 0,
              passedTestCases: 0,
              failedTestCases: 0,
              overallPass: false,
              syntaxError: "Unexpected token in line 3"
            }
          },
          error: {
            errorType: "SyntaxError",
            message: "Unexpected token in line 3"
          }
        });
      }
    }, 1500);
  });
};
