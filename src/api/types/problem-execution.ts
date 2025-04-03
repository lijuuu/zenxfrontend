export type TestCase = {
  id?: string;
  input: string;
  expected: string;
};

export type TestCaseRunOnly = {
  run: TestCase[];
};

export type ProblemMetadata = {
  problem_id: string;
  title: string;
  description: string;
  tags: string[];
  testcase_run: TestCaseRunOnly;
  difficulty: string;
  supported_languages: string[];
  validated?: boolean;
  placeholder_maps: { [key: string]: string };
};

export type TestResult = {
  testCaseIndex: number;
  input: any;
  expected: any;
  received: any;
  passed: boolean;
  error?: string;
};

export type ExecutionResult = {
  totalTestCases: number;
  passedTestCases: number;
  failedTestCases: number;
  overallPass: boolean;
  failedTestCase?: TestResult;
  syntaxError?: string;
};

export type ApiResponsePayload = {
  problem_id: string;
  language: string;
  is_run_testcase: boolean;
  rawoutput: ExecutionResult;
};

export type GenericResponse = {
  success: boolean;
  status: number;
  payload: ApiResponsePayload;
  error?: { errorType: string; message: string };
};

export const twoSumProblem: ProblemMetadata = {
  problem_id: "67d96452d3fe6af39801337b",
  title: "Two Sum",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to the target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

## Examples

### Example 1:
- **Input**: \`nums = [2,7,11,15]\`, \`target = 9\`
- **Output**: \`[0,1]\`
- **Explanation**: Because \`nums[0] + nums[1] == 9\`, we return \`[0, 1]\`

### Example 2:
- **Input**: \`nums = [3,2,4]\`, \`target = 6\`
- **Output**: \`[1,2]\`

## Constraints
- \`2 <= nums.length <= 10⁴\`
- \`-10⁹ <= nums[i] <= 10⁹\`
- \`-10⁹ <= target <= 10⁹\`
- Only one valid answer exists

## Follow-up
Can you come up with an algorithm that is less than \`O(n²)\` time complexity?`,
  tags: ["Array", "Hash Table", "String", "Linked List"],
  testcase_run: {
    run: [
      {
        id: "67e16a5a48ec539e82f1622c",
        input: '{ "nums": [2,7,11,15], "target": 9 }',
        expected: "[0,1]",
      },
      {
        id: "67e216734e8f4ccb4fda6635",
        input: '{ "nums": [2, 7, 11, 15], "target": 9 }',
        expected: "[0,1]",
      },
    ],
  },
  difficulty: "Easy",
  supported_languages: ["go", "python", "javascript"],
  validated: true,
  placeholder_maps: {
    go: `func twoSum(nums []int, target int) []int {
    // Type your code
    return []int{}
}`,
    javascript: `function twoSum(nums, target) {
    // Type your code
    return [];
}`,
    python: `def two_sum(nums, target):
    # Type your code
    return []`,
  },
};
