import { Problem, Submission, CompileRequest, CompileResponse } from './types';

// Mock data for problems based on the provided JSON
export const mockProblems: Problem[] = [
  {
    id: "67d96452d3fe6af39801337b",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "String", "Linked List"],
    acceptanceRate: 78,
    solved: true,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n### Example 1:\n- **Input**: `nums = [2,7,11,15]`, `target = 9`\n- **Output**: `[0,1]`\n- **Explanation**: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`\n\n### Example 2:\n- **Input**: `nums = [3,2,4]`, `target = 6`\n- **Output**: `[1,2]`\n\n## Constraints\n- `2 <= nums.length <= 10⁴`\n- `-10⁹ <= nums[i] <= 10⁹`\n- `-10⁹ <= target <= 10⁹`\n- Only one valid answer exists\n\n## Follow-up\nCan you come up with an algorithm that is less than `O(n²)` time complexity?",
    examples: [
      {
        input: "{ \"nums\": [2,7,11,15], \"target\": 9 }",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "{   \"nums\": [2, 7, 11, 15],   \"target\": 9 }",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try to use the fact that the complement of the number we need is already in the hash table."
    ]
  },
  {
    id: "67b96452d3fe6af39801337d",
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Array"],
    acceptanceRate: 82,
    solved: false,
    description: "Write a function that reverses a given string. You must return the string with its characters in reverse order.\n\n## Examples\n\n### Example 1:\n- **Input**: `\"hello\"`\n- **Output**: `\"olleh\"`\n- **Explanation**: The string \"hello\" is reversed to \"olleh\".\n\n### Example 2:\n- **Input**: `\"world\"`\n- **Output**: `\"dlrow\"`\n\n## Constraints\n- `1 <= s.length <= 10⁴`\n- `s` consists of printable ASCII characters.",
    examples: [
      {
        input: "\"hello\"",
        output: "\"olleh\"",
        explanation: "The string \"hello\" is reversed to \"olleh\"."
      },
      {
        input: "\"world\"",
        output: "\"dlrow\""
      }
    ],
    constraints: [
      "1 <= s.length <= 10⁴",
      "s consists of printable ASCII characters."
    ]
  },
  {
    id: "67e1a5b2c9f8d3e4a201b48f",
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Easy",
    tags: ["Math", "Basic"],
    acceptanceRate: 68,
    solved: false,
    description: "Write a function that takes two integers and returns their sum.\n\n## Examples\n\n### Example 1:\n- **Input**: `a = 3, b = 5`\n- **Output**: `8`\n- **Explanation**: `3 + 5 = 8`\n\n### Example 2:\n- **Input**: `a = -2, b = 7`\n- **Output**: `5`\n\n## Constraints\n- `-10⁹ <= a, b <= 10⁹`",
    examples: [
      {
        input: "{\"a\": 3, \"b\": 5}",
        output: "8",
        explanation: "3 + 5 = 8"
      },
      {
        input: "{\"a\": -2, \"b\": 7}",
        output: "5"
      }
    ],
    constraints: [
      "-10⁹ <= a, b <= 10⁹"
    ]
  }
];

// Mock submissions
const mockSubmissions: Submission[] = [
  {
    id: "s1",
    problemId: "p1",
    problemTitle: "Two Sum",
    userId: "1",
    language: "javascript",
    code: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}",
    status: "Accepted",
    runtime: "76 ms",
    memory: "42.4 MB",
    timestamp: "2023-03-20T15:30:00Z",
    testCases: {
      passed: 29,
      total: 29
    }
  },
  {
    id: "s2",
    problemId: "p3",
    problemTitle: "Add Two Numbers",
    userId: "1",
    language: "python",
    code: "def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n    \n    while l1 or l2 or carry:\n        x = l1.val if l1 else 0\n        y = l2.val if l2 else 0\n        \n        sum = x + y + carry\n        carry = sum // 10\n        \n        current.next = ListNode(sum % 10)\n        current = current.next\n        \n        if l1: l1 = l1.next\n        if l2: l2 = l2.next\n    \n    return dummy.next",
    status: "Accepted",
    runtime: "68 ms",
    memory: "14.2 MB",
    timestamp: "2023-03-18T10:15:00Z",
    testCases: {
      passed: 1568,
      total: 1568
    }
  }
];

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
    
    setTimeout(() => resolve(filteredProblems), 600);
  });
};

export const getProblem = async (idOrSlug: string): Promise<Problem | null> => {
  return new Promise(resolve => {
    // For any problem id/slug, return the Two Sum problem when no data from server
    const problem = mockProblems[0];
    
    setTimeout(() => resolve(problem), 500);
  });
};

export const getSubmissions = async (problemId?: string): Promise<Submission[]> => {
  return new Promise(resolve => {
    let filteredSubmissions = [...mockSubmissions];
    
    if (problemId) {
      filteredSubmissions = filteredSubmissions.filter(s => s.problemId === problemId);
    }
    
    setTimeout(() => resolve(filteredSubmissions), 500);
  });
};

export const submitSolution = async (submission: Omit<Submission, 'id' | 'timestamp' | 'status' | 'runtime' | 'memory' | 'testCases'>): Promise<Submission> => {
  return new Promise(resolve => {
    // Simulate backend validation and testing
    const problem = mockProblems.find(p => p.id === submission.problemId);
    const isCorrect = Math.random() > 0.3; // 70% chance of success
    
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      ...submission,
      status: isCorrect ? "Accepted" : "Wrong Answer",
      runtime: isCorrect ? `${Math.floor(Math.random() * 100 + 50)} ms` : undefined,
      memory: isCorrect ? `${(Math.random() * 50 + 10).toFixed(1)} MB` : undefined,
      timestamp: new Date().toISOString(),
      testCases: {
        passed: isCorrect ? problem?.examples.length || 0 : Math.floor(Math.random() * (problem?.examples.length || 1)),
        total: problem?.examples.length || 0
      }
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
  const twoSumProblem = mockProblems[0];
  
  // Map the mock data to the expected format
  return {
    problem_id: twoSumProblem.id,
    title: twoSumProblem.title,
    description: twoSumProblem.description,
    tags: twoSumProblem.tags,
    testcase_run: {
      run: twoSumProblem.examples.map(example => ({
        input: example.input,
        expected: example.output
      }))
    },
    difficulty: twoSumProblem.difficulty === "Easy" ? "E" : twoSumProblem.difficulty === "Medium" ? "M" : "H",
    supported_languages: ['javascript', 'python', 'go'],
    validated: true,
    placeholder_maps: {
      javascript: 'function twoSum(nums, target) {\n    // Type your code\n    return [];\n}',
      python: 'def two_sum(nums, target):\n    // Type your code\n    return []',
      go: 'func twoSum(nums []int, target int) []int {\n\t//Type your code\n\treturn []int{}\n}'
    }
  };
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
