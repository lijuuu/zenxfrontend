import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle, XCircle, Flag, Trophy, Brain, Search, Check, Sparkles, Settings, Puzzle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChallengeConfig, ChallengeDocument } from "@/api/challengeTypes";
import { useProblemList } from "@/services/useProblemList";
import { useCreateChallenge } from "@/services/useChallenges";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import MainNavbar from "@/components/common/MainNavbar";
import bgGradient from "@/assets/challengegradient.png";

interface ProblemCountMetadata {
  easy: number;
  medium: number;
  hard: number;
}

interface SelectedProblem {
  id: string;
  title: string;
  difficulty: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Challenge title must be at least 2 characters.",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  isPrivate: z.boolean().default(false),
  timeLimit: z.number().min(300, {
    message: "Time limit must be at least 5 minutes.",
  }).default(3600),
  config: z.object({
    maxEasyQuestions: z.number().min(0).default(0),
    maxMediumQuestions: z.number().min(0).default(0),
    maxHardQuestions: z.number().min(0).default(0),
    maxUsers: z.number().min(1).default(30),
  }),
}).refine(
  (data) => {
    const totalQuestions = data.config.maxEasyQuestions + data.config.maxMediumQuestions + data.config.maxHardQuestions;
    return totalQuestions <= 10;
  },
  {
    message: "Select up to 10 problems in total.",
    path: ["config"],
  }
);

const CreateChallenge: React.FC = () => {
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("metadata");
  const [problemCounts, setProblemCounts] = useState<ProblemCountMetadata>({ easy: 0, medium: 0, hard: 0 });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [useRandomProblems, setUseRandomProblems] = useState(true);
  const { data: problems, isLoading: problemsLoading } = useProblemList();
  const createChallengeMutation = useCreateChallenge();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAppSelector(state => state.auth.userProfile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "Easy",
      isPrivate: false,
      timeLimit: 3600,
      config: {
        maxEasyQuestions: 0,
        maxMediumQuestions: 0,
        maxHardQuestions: 0,
        maxUsers: 30,
      },
    },
  });

  // Fetch problem count metadata
  useEffect(() => {
    const fetchProblemCounts = async () => {
      try {
        setIsLoadingCounts(true);
        const response = await axiosInstance.get('/problems/count', {
          headers: { 'X-Requires-Auth': 'true' }
        });
        const counts = response.data.payload as ProblemCountMetadata;
        setProblemCounts({
          easy: counts.easy ? counts.easy : 0,
          medium: counts.medium ? counts.medium : 0,
          hard: counts.hard ? counts.hard : 0,
        });
      } catch (error) {
        console.error('Error fetching problem counts:', error);
        toast.error("Failed to load problem counts");
      } finally {
        setIsLoadingCounts(false);
      }
    };

    fetchProblemCounts();
  }, []);

  useEffect(() => {
    if (form.getValues().title) {
      form.reset({
        title: "",
        difficulty: "Easy",
        isPrivate: false,
        timeLimit: 3600,
        config: {
          maxEasyQuestions: 0,
          maxMediumQuestions: 0,
          maxHardQuestions: 0,
          maxUsers: 30,
        },
      });
      setSelectedProblems([]);
      setSearchQuery("");
      setActiveTab("metadata");
      setUseRandomProblems(true);
    }
  }, [form]);

  const handleProblemSelect = (problem: SelectedProblem) => {
    const isSelected = selectedProblems.find(p => p.id === problem.id);
    const difficulty = problem.difficulty.toLowerCase() as keyof ProblemCountMetadata;
    const currentCount = selectedProblems.filter(p => p.difficulty.toLowerCase() === difficulty).length;

    if (isSelected) {
      setSelectedProblems(selectedProblems.filter(p => p.id !== problem.id));
    } else {
      if (selectedProblems.length >= 10) {
        toast.warning("Maximum 10 problems allowed", {
          description: "Please remove some problems before adding more."
        });
        return;
      }
      if (currentCount >= problemCounts[difficulty]) {
        toast.warning(`Maximum ${difficulty} problems (${problemCounts[difficulty]}) reached`);
        return;
      }
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const filteredProblems = problems?.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <Flag className="h-6 w-6 text-green-400 transition-transform hover:scale-110" />;
      case "medium":
        return <Brain className="h-6 w-6 text-yellow-400 transition-transform hover:scale-110" />;
      case "hard":
        return <Trophy className="h-6 w-6 text-red-400 transition-transform hover:scale-110" />;
      default:
        return null;
    }
  };

  const getColorsByDifficulty = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-900/30 border-green-400 text-green-400";
      case "medium":
        return "bg-yellow-900/30 border-yellow-400 text-yellow-400";
      case "hard":
        return "bg-red-900/30 border-red-400 text-red-400";
      default:
        return "bg-gray-800/50 border-gray-600 text-gray-300";
    }
  };

  const canAdvanceToProblems = () => {
    return form.getValues().title.length >= 2;
  };

  const validateProblemSelection = (useRandom: boolean) => {
    const { maxEasyQuestions, maxMediumQuestions, maxHardQuestions } = form.getValues().config;
    const totalConfigQuestions = maxEasyQuestions + maxMediumQuestions + maxHardQuestions;

    if (useRandom) {
      return (
        totalConfigQuestions >= 1 &&
        totalConfigQuestions <= 10 &&
        maxEasyQuestions <= problemCounts.easy &&
        maxMediumQuestions <= problemCounts.medium &&
        maxHardQuestions <= problemCounts.hard
      );
    } else {
      const easyCount = selectedProblems.filter(p => p.difficulty.toLowerCase() === "easy").length;
      const mediumCount = selectedProblems.filter(p => p.difficulty.toLowerCase() === "medium").length;
      const hardCount = selectedProblems.filter(p => p.difficulty.toLowerCase() === "hard").length;

      return (
        easyCount <= problemCounts.easy &&
        mediumCount <= problemCounts.medium &&
        hardCount <= problemCounts.hard &&
        selectedProblems.length >= 1 &&
        selectedProblems.length <= 10
      );
    }
  };

  const goToProblemsTab = () => {
    if (canAdvanceToProblems()) {
      setActiveTab("problems");
    } else {
      form.trigger("title");
      toast.warning("Please complete the challenge details first");
    }
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (!validateProblemSelection(useRandomProblems)) {
      toast.error("Invalid problem selection", {
        description: useRandomProblems
          ? `Select at least 1 and up to 10 problems, not exceeding available problems (Easy: ${problemCounts.easy}, Medium: ${problemCounts.medium}, Hard: ${problemCounts.hard}).`
          : `Select at least 1 and up to 10 problems, not exceeding available problems (Easy: ${problemCounts.easy}, Medium: ${problemCounts.medium}, Hard: ${problemCounts.hard}).`,
      });
      return;
    }

    const config = useRandomProblems
      ? formData.config
      : {
        maxEasyQuestions: selectedProblems.filter(p => p.difficulty.toLowerCase() === "easy").length,
        maxMediumQuestions: selectedProblems.filter(p => p.difficulty.toLowerCase() === "medium").length,
        maxHardQuestions: selectedProblems.filter(p => p.difficulty.toLowerCase() === "hard").length,
        maxUsers: formData.config.maxUsers,
      };

    try {
      const newChallenge = await createChallengeMutation.mutateAsync({
        title: formData.title,
        processedProblemIds: useRandomProblems ? [] : selectedProblems.map(p => p.id),
        isPrivate: formData.isPrivate,
        timeLimit: formData.timeLimit,
        config: { ...config } as ChallengeConfig,
      });

      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge-history'] });

      toast.success(`Challenge "${formData.title}" created! Redirecting to challenges...`);
      setTimeout(() => {
        navigate(`/challenges`);
      }, 1500);
    } catch (error) {
      console.error("Failed to create challenge:", error);
      toast.error("Failed to create challenge");
    }
  };

  const totalQuestions = form.getValues().config.maxEasyQuestions + form.getValues().config.maxMediumQuestions + form.getValues().config.maxHardQuestions;

  return (
    <div
      className="min-h-screen text-foreground pt-16 pb-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${bgGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MainNavbar />
      <main className="page-container py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="h-8 w-8 text-green-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">Create New Challenge</h1>
        </div>
        <p className="text-sm text-gray-300 mb-8">
          Design your own coding challenge and invite friends to compete!
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 bg-gray-800/50 border-gray-600 rounded-lg p-1">
            <TabsTrigger
              value="metadata"
              className="flex items-center gap-2 py-2 text-sm font-medium text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400 data-[state=active]:shadow-sm rounded-md"
            >
              <Settings className="h-4 w-4" />
              Challenge Details
            </TabsTrigger>
            <TabsTrigger
              value="problems"
              className="flex items-center gap-2 py-2 text-sm font-medium text-gray-300 data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400 data-[state=active]:shadow-sm rounded-md"
            >
              <Puzzle className="h-4 w-4" />
              Select Problems
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="metadata" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-100">Challenge Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter challenge title"
                            className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-100">Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400">
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-800 border-gray-600 text-gray-300">
                            <SelectItem value="Easy" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-green-400" />
                                <span>Easy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-yellow-400" />
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Hard" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-red-400" />
                                <span>Hard</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4 bg-gray-800/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium text-gray-100">Private Challenge</FormLabel>
                          <p className="text-xs text-gray-300">
                            Only users with the access code can join.
                          </p>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600 text-green-400 focus:ring-green-400"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-100">Time Limit (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter time limit in seconds"
                            className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            min={300}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="config.maxUsers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-100">Maximum Participants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter maximum number of participants"
                          className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          min={1}
                          max={30}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={goToProblemsTab}
                    className="bg-green-600 hover:bg-green-700 metallic-button rounded-md"
                    disabled={isLoadingCounts}
                  >
                    Continue to Problem Selection
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="problems" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-medium text-gray-100">Problem Selection</FormLabel>
                    <span className="text-xl font-bold text-gray-100">
                      {useRandomProblems ? `${totalQuestions}/10 problems selected` : `${selectedProblems.length}/10 problems selected`}
                    </span>
                  </div>

                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-100">Selection Method</FormLabel>
                    <p className="text-xs text-gray-300 mb-2">
                      Choose random problems based on difficulty counts or select specific problems manually.
                    </p>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="random"
                          checked={useRandomProblems}
                          onChange={() => {
                            setUseRandomProblems(true);
                            setSelectedProblems([]);
                          }}
                          className="h-5 w-5 text-green-400 focus:ring-green-400"
                        />
                        <label htmlFor="random" className="text-base text-gray-300">Random Selection</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="predefined"
                          checked={!useRandomProblems}
                          onChange={() => {
                            setUseRandomProblems(false);
                            setSelectedProblems([]);
                          }}
                          className="h-5 w-5 text-green-400 focus:ring-green-400"
                        />
                        <label htmlFor="predefined" className="text-base text-gray-300">Predefined Selection</label>
                      </div>
                    </div>
                  </FormItem>

                  {useRandomProblems && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="config.maxEasyQuestions"
                        render={({ field }) => {
                          const totalQuestions = form.getValues().config.maxEasyQuestions + form.getValues().config.maxMediumQuestions + form.getValues().config.maxHardQuestions;
                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-100">Max Easy Questions</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Max easy questions"
                                  className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                                  disabled={isLoadingCounts || problemCounts.easy === 0 || totalQuestions >= 10}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  max={problemCounts.easy}
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                              <p className="text-base font-bold text-gray-100">
                                Available: {problemCounts.easy}
                              </p>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="config.maxMediumQuestions"
                        render={({ field }) => {
                          const totalQuestions = form.getValues().config.maxEasyQuestions + form.getValues().config.maxMediumQuestions + form.getValues().config.maxHardQuestions;
                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-100">Max Medium Questions</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Max medium questions"
                                  className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                                  disabled={isLoadingCounts || problemCounts.medium === 0 || totalQuestions >= 10}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  max={problemCounts.medium}
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                              <p className="text-base font-bold text-gray-100">
                                Available: {problemCounts.medium}
                              </p>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={form.control}
                        name="config.maxHardQuestions"
                        render={({ field }) => {
                          const totalQuestions = form.getValues().config.maxEasyQuestions + form.getValues().config.maxMediumQuestions + form.getValues().config.maxHardQuestions;
                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-100">Max Hard Questions</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Max hard questions"
                                  className="bg-gray-800/50 border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-green-400"
                                  disabled={isLoadingCounts || problemCounts.hard === 0 || totalQuestions >= 10}
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  max={problemCounts.hard}
                                  min={0}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                              <p className="text-base font-bold text-gray-100">
                                Available: {problemCounts.hard}
                              </p>
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  )}

                  {!useRandomProblems && (
                    <>
                      <div className="flex items-center border border-gray-600 rounded-md px-3 py-2 bg-gray-800/50">
                        <Search className="h-4 w-4 text-gray-300" />
                        <Input
                          placeholder="Search problems by title..."
                          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-300"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      {problemsLoading || isLoadingCounts ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-green-400" />
                        </div>
                      ) : (
                        <ScrollArea className="h-[50vh] max-h-[500px] rounded-md border border-gray-600 p-2 bg-gray-800/50">
                          <div className="space-y-2">
                            {filteredProblems.map((problem) => (
                              <div
                                key={problem.problem_id}
                                className={`flex items-center justify-between rounded-md p-3 cursor-pointer transition-all hover:bg-gray-700/50 border border-gray-600 hover:border-green-400 hover:shadow-sm ${selectedProblems.find(p => p.id === problem.problem_id)
                                    ? 'bg-green-900/30 border-green-400'
                                    : ''
                                  }`}
                                onClick={() => handleProblemSelect({
                                  id: problem.problem_id,
                                  title: problem.title,
                                  difficulty: problem.difficulty,
                                })}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {getDifficultyIcon(problem.difficulty)}
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-100 line-clamp-1">{problem.title}</p>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs mt-1 font-medium ${getColorsByDifficulty(problem.difficulty)}`}
                                    >
                                      {problem.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-600 bg-gray-800/50">
                                  {selectedProblems.find(p => p.id === problem.problem_id) && (
                                    <Check className="h-4 w-4 text-green-400" />
                                  )}
                                </div>
                              </div>
                            ))}

                            {filteredProblems.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-8 text-center text-gray-300">
                                <p className="text-sm">No problems found</p>
                                {searchQuery && (
                                  <p className="text-xs mt-1">Try different search terms</p>
                                )}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}

                      {selectedProblems.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-100 mb-2">Selected Problems ({selectedProblems.length})</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {selectedProblems.map((problem) => (
                              <div
                                key={problem.id}
                                className={`flex items-center gap-2 p-2 rounded-md bg-gray-800/50 border border-gray-600 hover:bg-gray-700/50 transition-all ${getColorsByDifficulty(problem.difficulty)}`}
                              >
                                {getDifficultyIcon(problem.difficulty)}
                                <span className="text-sm text-gray-300 truncate max-w-[120px]">{problem.title}</span>
                                <XCircle
                                  className="h-5 w-5 cursor-pointer hover:text-red-400"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProblemSelect(problem);
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              <div className="flex justify-between pt-6 border-t border-gray-600">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={createChallengeMutation.isPending}
                  className="rounded-md border-gray-600 text-gray-300 hover:bg-gray-700/50 metallic-button"
                >
                  Cancel
                </Button>
                <Button
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all duration-300"
                  disabled={createChallengeMutation.isPending || isLoadingCounts || !validateProblemSelection(useRandomProblems)}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {createChallengeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
                      <span className="relative z-10">Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-5 w-5 group-hover:animate-pulse relative z-10" />
                      <span className="relative z-10">Create Challenge</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </main>
    </div>
  );
};

export default CreateChallenge;