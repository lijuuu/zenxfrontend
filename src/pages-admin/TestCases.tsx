import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Loader2, Trash2, ListChecks, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Schema for single test case
const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required").refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    "Input must be valid JSON (e.g., { \"nums\": [2,7,11,15], \"target\": 9 })"
  ),
  expected: z.string().min(1, "Expected output is required").refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length === 2 && parsed.every(num => Number.isInteger(num));
      } catch {
        return false;
      }
    },
    "Expected must be a JSON array of two integers (e.g., [0,1])"
  ),
});

// Schema for bulk upload
const bulkTestCaseSchema = z.object({
  bulkJson: z.string().min(1, "JSON is required").refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return (
          parsed.run && Array.isArray(parsed.run) &&
          parsed.submit && Array.isArray(parsed.submit) &&
          parsed.run.every((tc: any) => tc.input && tc.expected) &&
          parsed.submit.every((tc: any) => tc.input && tc.expected)
        );
      } catch {
        return false;
      }
    },
    "Must be valid JSON with 'run' and 'submit' arrays containing 'input' and 'expected'"
  ),
});

type TestCaseFormData = z.infer<typeof testCaseSchema>;

interface TestCasesViewProps {
  selectedProblem: Problem;
  setError: any;
  handleApiCall: any;
  setView: any;
  loading: boolean;
}

// Example problem type (adjust based on your actual Problem type)
interface Problem {
  problem_id: string;
  title: string;
  testcases: {
    run: Array<{ id?: string; testcase_id?: string; input: string; expected: string }>;
    submit: Array<{ id?: string; testcase_id?: string; input: string; expected: string }>;
  };
}

const TestCasesView: React.FC<TestCasesViewProps> = ({ selectedProblem, setError, handleApiCall, setView, loading }) => {
  const {
    control: runControl,
    handleSubmit: handleSubmitRun,
    reset: resetRun,
    formState: { errors: errorsRun },
  } = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: { input: "", expected: "" },
    mode: "onChange",
  });

  const {
    control: submitControl,
    handleSubmit: handleSubmitSubmit,
    reset: resetSubmit,
    formState: { errors: errorsSubmit },
  } = useForm<TestCaseFormData>({
    resolver: zodResolver(testCaseSchema),
    defaultValues: { input: "", expected: "" },
    mode: "onChange",
  });

  const {
    control: bulkControl,
    handleSubmit: handleSubmitBulk,
    setValue: setBulkValue,
    reset: resetBulk,
    formState: { errors: errorsBulk },
  } = useForm<{ bulkJson: string }>({
    resolver: zodResolver(bulkTestCaseSchema),
    defaultValues: { bulkJson: "" },
    mode: "onChange",
  });

  const [selectedTestCases, setSelectedTestCases] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("existing");

  const onAddRun = async (data: TestCaseFormData) => {
    if (!selectedProblem) return setError("Please select or create a problem first.");
    await handleApiCall("post", "/testcases", {
      problem_id: selectedProblem.problem_id,
      testcases: { run: [{ input: data.input, expected: data.expected }], submit: [] },
    });
    resetRun();
    setActiveTab("existing");
    toast.success("Run test case added successfully!");
  };

  const onAddSubmit = async (data: TestCaseFormData) => {
    if (!selectedProblem) return setError("Please select or create a problem first.");
    await handleApiCall("post", "/testcases", {
      problem_id: selectedProblem.problem_id,
      testcases: { run: [], submit: [{ input: data.input, expected: data.expected }] },
    });
    resetSubmit();
    setActiveTab("existing");
    toast.success("Submit test case added successfully!");
  };

  const onRemove = async (testcaseId: string, isRun: boolean) => {
    if (!selectedProblem || !window.confirm("Are you sure you want to delete this test case?")) return;
    await handleApiCall("delete", "/testcases/single", {
      problem_id: selectedProblem.problem_id,
      testcase_id: testcaseId,
      is_run_testcase: isRun,
    });
    toast.success("Test case deleted successfully!");
  };

  const onBulkDelete = async () => {
    if (
      !selectedProblem ||
      selectedTestCases.size === 0 ||
      !window.confirm("Are you sure you want to delete selected test cases?")
    )
      return;

    const promises = Array.from(selectedTestCases).map((testcaseId) => {
      const isRun = selectedProblem.testcases?.run?.some(
        (tc: any) => (tc.id || tc.testcase_id) === testcaseId
      );
      return handleApiCall("delete", "/testcases/single", {
        problem_id: selectedProblem.problem_id,
        testcase_id: testcaseId,
        is_run_testcase: isRun,
      });
    });

    await Promise.all(promises);
    setSelectedTestCases(new Set());
    toast.success(`Deleted ${selectedTestCases.size} test cases successfully!`);
  };

  const onBulkUpload = async (data: { bulkJson: string }) => {
    if (!selectedProblem) return setError("Please select or create a problem first.");
    const parsedJson = JSON.parse(data.bulkJson);
    await handleApiCall("post", "/testcases", {
      problem_id: selectedProblem.problem_id,
      testcases: parsedJson,
    });
    resetBulk();
    setActiveTab("existing");
    toast.success("Bulk test cases uploaded successfully!");
  };

  const toggleTestCaseSelection = (testcaseId: string) => {
    const newSelected = new Set(selectedTestCases);
    if (newSelected.has(testcaseId)) newSelected.delete(testcaseId);
    else newSelected.add(testcaseId);
    setSelectedTestCases(newSelected);
  };

  const exampleJson = `{
  "run": [
    { "input": "{ \\"nums\\": [2,7,11,15], \\"target\\": 9 }", "expected": "[0,1]" },
    { "input": "{ \\"nums\\": [3,2,4], \\"target\\": 6 }", "expected": "[1,2]" },
    { "input": "{ \\"nums\\": [1,5,3,7], \\"target\\": 8 }", "expected": "[0,3]" },
    { "input": "{ \\"nums\\": [-1,-2,-3,-4,-5], \\"target\\": -8 }", "expected": "[2,4]" },
    { "input": "{ \\"nums\\": [100,200,300,400], \\"target\\": 500 }", "expected": "[0,3]" }
  ],
  "submit": [
    { "input": "{ \\"nums\\": [1,2,3,4,5], \\"target\\": 9 }", "expected": "[3,4]" },
    { "input": "{ \\"nums\\": [0,1,2,3,4], \\"target\\": 3 }", "expected": "[0,3]" },
    { "input": "{ \\"nums\\": [10,20,30,40,50], \\"target\\": 70 }", "expected": "[2,4]" },
    { "input": "{ \\"nums\\": [5,15,25,35], \\"target\\": 40 }", "expected": "[1,2]" },
    { "input": "{ \\"nums\\": [-10,0,10,20], \\"target\\": 10 }", "expected": "[0,2]" }
  ]
}`;

  const copyExampleJson = () => {
    navigator.clipboard.writeText(exampleJson);
    toast.success("Example JSON copied to clipboard!", { duration: 3000 });
  };

  // Example problem data based on your input
  const exampleProblem: Problem = {
    problem_id: "67d96452d3fe6af39801337b",
    title: "Two Sum",
    testcases: {
      run: [
        
      ],
      submit: [],
    },
  };

  // Example success message
  const successMessage = "{\n  \"totalTestCases\": 2,\n  \"passedTestCases\": 2,\n  \"failedTestCases\": 0\n}";

  return (
    <div className="p-4">
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setView("list")}
          className="border-gray-200 dark:border-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23]">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Test Cases: {selectedProblem?.title || exampleProblem.title}
        </h1>
      </div>

      {/* Display Success Message */}
      {/* {successMessage && (
        <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Test Case Execution Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-800 dark:text-green-200 whitespace-pre-wrap">
              {successMessage}
            </pre>
            <p className="mt-2 text-sm text-green-600 dark:text-green-400">
              Problem ID: {selectedProblem?.problem_id || exampleProblem.problem_id} | Language: go | Run Test Cases: true
            </p>
          </CardContent>
        </Card>
      )} */}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-100 dark:bg-[#1F1F23] border-gray-200 dark:border-[#1F1F23]">
          <TabsTrigger
            value="existing"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2B2B30] data-[state=active]:bg-white dark:data-[state=active]:bg-[#0F0F12] data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
          >
            Existing
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2B2B30] data-[state=active]:bg-white dark:data-[state=active]:bg-[#0F0F12] data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
          >
            Add New
          </TabsTrigger>
          <TabsTrigger
            value="bulk"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2B2B30] data-[state=active]:bg-white dark:data-[state=active]:bg-[#0F0F12] data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
          >
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing">
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">Existing Test Cases</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  View and manage test cases
                </CardDescription>
              </div>
              {selectedTestCases.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedTestCases.size})
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border border-gray-200 dark:border-[#1F1F23]">
                <div className="p-4">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#1F1F23]">
                        <th className="p-2 text-left w-10"></th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">Type</th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">Input</th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">Expected</th>
                        <th className="p-2 text-left text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedProblem?.testcases?.run || exampleProblem.testcases.run).map((tc: any, i: number) => (
                        <tr
                          key={i}
                          className="border-b border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23]/50 transition-colors"
                        >
                          <td className="p-2">
                            <Checkbox
                              checked={selectedTestCases.has(tc.id || tc.testcase_id || `run_${i}`)}
                              onCheckedChange={() => toggleTestCaseSelection(tc.id || tc.testcase_id || `run_${i}`)}
                            />
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                              Run
                            </Badge>
                          </td>
                          <td className="p-2 truncate max-w-xs text-gray-900 dark:text-gray-200">
                            {tc.input}
                          </td>
                          <td className="p-2 truncate max-w-xs text-gray-900 dark:text-gray-200">
                            {tc.expected}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemove(tc.id || tc.testcase_id || `run_${i}`, true)}
                              disabled={loading}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {(selectedProblem?.testcases?.submit || exampleProblem.testcases.submit).map((tc: any, i: number) => (
                        <tr
                          key={i}
                          className="border-b border-gray-200 dark:border-[#1F1F23] hover:bg-gray-50 dark:hover:bg-[#1F1F23]/50 transition-colors"
                        >
                          <td className="p-2">
                            <Checkbox
                              checked={selectedTestCases.has(tc.id || tc.testcase_id || `submit_${i}`)}
                              onCheckedChange={() =>
                                toggleTestCaseSelection(tc.id || tc.testcase_id || `submit_${i}`)
                              }
                            />
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Submit
                            </Badge>
                          </td>
                          <td className="p-2 truncate max-w-xs text-gray-900 dark:text-gray-200">
                            {tc.input}
                          </td>
                          <td className="p-2 truncate max-w-xs text-gray-900 dark:text-gray-200">
                            {tc.expected}
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemove(tc.id || tc.testcase_id || `submit_${i}`, false)}
                              disabled={loading}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!(selectedProblem?.testcases?.run?.length || exampleProblem.testcases.run.length) &&
                    !(selectedProblem?.testcases?.submit?.length || exampleProblem.testcases.submit.length) && (
                      <div className="py-8 text-center">
                        <ListChecks className="h-10 w-10 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-600 dark:text-gray-400">No test cases added yet.</p>
                        <Button
                          variant="outline"
                          className="mt-4 border-gray-200 dark:border-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
                          onClick={() => setActiveTab("add")}
                        >
                          Add Test Case
                        </Button>
                      </div>
                    )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Add Run Test Case</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  For final submission (e.g., {`{ "nums": [1,2,3,4,5], "target": 9 }`})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitRun(onAddRun)} className="space-y-4">
                  <div>
                    <Label htmlFor="run-input" className="text-gray-700 dark:text-gray-300">
                      Input (JSON)
                    </Label>
                    <Controller
                      name="input"
                      control={runControl}
                      render={({ field }) => (
                        <Input
                          id="run-input"
                          {...field}
                          placeholder='{ "nums": [2,7,11,15], "target": 9 }'
                          className="mt-1 border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 font-mono"
                        />
                      )}
                    />
                    {errorsRun.input && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorsRun.input.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="run-expected" className="text-gray-700 dark:text-gray-300">
                      Expected Output (JSON Array)
                    </Label>
                    <Controller
                      name="expected"
                      control={runControl}
                      render={({ field }) => (
                        <Input
                          id="run-expected"
                          {...field}
                          placeholder="[0,1]"
                          className="mt-1 border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 font-mono"
                        />
                      )}
                    />
                    {errorsRun.expected && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorsRun.expected.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Add Run Test Case
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Add Submit Test Case</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  For final submission (e.g., {`{ "nums": [1,2,3,4,5], "target": 9 }`})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSubmit(onAddSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="submit-input" className="text-gray-700 dark:text-gray-300">
                      Input (JSON)
                    </Label>
                    <Controller
                      name="input"
                      control={submitControl}
                      render={({ field }) => (
                        <Input
                          id="submit-input"
                          {...field}
                          placeholder='{ "nums": [1,2,3,4,5], "target": 9 }'
                          className="mt-1 border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 font-mono"
                        />
                      )}
                    />
                    {errorsSubmit.input && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorsSubmit.input.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="submit-expected" className="text-gray-700 dark:text-gray-300">
                      Expected Output (JSON Array)
                    </Label>
                    <Controller
                      name="expected"
                      control={submitControl}
                      render={({ field }) => (
                        <Input
                          id="submit-expected"
                          {...field}
                          placeholder="[3,4]"
                          className="mt-1 border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100 font-mono"
                        />
                      )}
                    />
                    {errorsSubmit.expected && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorsSubmit.expected.message}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Add Submit Test Case
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk">
          <Card className="bg-white dark:bg-[#0F0F12] border-gray-200 dark:border-[#1F1F23]">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Bulk Upload Test Cases</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Upload multiple test cases via JSON
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitBulk(onBulkUpload)} className="space-y-4">
                <div className="relative">
                  <Label htmlFor="bulk-json" className="text-gray-700 dark:text-gray-300">
                    JSON Data
                  </Label>
                  <div className="flex justify-end mb-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setBulkValue("bulkJson", exampleJson)}
                      className="border-gray-200 dark:border-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
                    >
                      Load Example
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyExampleJson}
                      className="border-gray-200 dark:border-[#1F1F23] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Example
                    </Button>
                  </div>
                  <Controller
                    name="bulkJson"
                    control={bulkControl}
                    render={({ field }) => (
                      <Textarea
                        id="bulk-json"
                        {...field}
                        placeholder={exampleJson}
                        className="min-h-40 font-mono text-sm border-gray-200 dark:border-[#1F1F23] dark:bg-[#0F0F12] text-gray-900 dark:text-gray-100"
                      />
                    )}
                  />
                  {errorsBulk.bulkJson && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errorsBulk.bulkJson.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Upload Bulk Test Cases
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestCasesView;