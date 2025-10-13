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
  problemId: string;
  title: string;
  difficulty: string;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Challenge title must be at least 2 characters.",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  isPrivate: z.boolean().default(false),
  // store timeLimit in SECONDS; enforce 1 minute min
  timeLimitMillis: z.number().min(60, {
    message: "Time limit must be at least 1 minute.",
  }).max(86400, { // 24 hours
    message: "Time limit must be 24 hours or less.",
  }).default(3600),
  // lobby buffer in SECONDS before start time
  lobbyBufferSeconds: z.number().min(0).max(86400).default(300),
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
  const [problemCounts, setProblemCounts] = useState<ProblemCountMetadata>({ easy: 0, medium: 0, hard: 0 });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [useRandomProblems, setUseRandomProblems] = useState(true);
  const { data: problems, isLoading: problemsLoading } = useProblemList();
  const createChallengeMutation = useCreateChallenge();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "Easy",
      isPrivate: false,
      timeLimitMillis: 3600, // 1 hour default in seconds
      lobbyBufferSeconds: 300, // 5 minutes default lobby
      config: {
        maxEasyQuestions: 0,
        maxMediumQuestions: 0,
        maxHardQuestions: 0,
        maxUsers: 30,
      },
    },
  });

  console.log("problems ", problems)

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

  const handleProblemSelect = (problem: SelectedProblem) => {
    const isSelected = selectedProblems.find(p => p.problemId === problem.problemId);
    const difficulty = problem.difficulty.toLowerCase() as keyof ProblemCountMetadata;
    const currentCount = selectedProblems.filter(p => p.difficulty.toLowerCase() === difficulty).length;

    if (isSelected) {
      setSelectedProblems(selectedProblems.filter(p => p.problemId !== problem.problemId));
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

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    // Clamp timeLimit on submit to ensure backend receives >=1 minute and <=24 hours
    const clampedTimeLimit = Math.max(60, Math.min(formData.timeLimitMillis, 24 * 60 * 60));
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
      const nowUnix = Math.floor(Date.now() / 1000);
      const startTimeUnix = nowUnix + (formData.lobbyBufferSeconds || 0);
      const newChallenge = await createChallengeMutation.mutateAsync({
        title: formData.title,
        processedProblemIds: useRandomProblems ? [] : selectedProblems.map(p => p.problemId),
        isPrivate: formData.isPrivate,
        timeLimitMillis: clampedTimeLimit * 1000,
        startTimeUnix,
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
    <div className="min-h-screen bg-black/80 backdrop-blur-sm text-white pt-16 pb-8">
      <MainNavbar />
      <main className="page-container py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-white" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Challenge</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={createChallengeMutation.isPending}
              className="rounded-md border-gray-600 text-gray-300 hover:bg-gray-800/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              className="bg-white text-black hover:bg-gray-200 relative group py-6 px-8 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300"
              disabled={createChallengeMutation.isPending || isLoadingCounts || !validateProblemSelection(useRandomProblems)}
              onClick={form.handleSubmit(onSubmit)}
            >
              {createChallengeMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  <span>Create Challenge</span>
                </>
              )}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-8">
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

              {/* Challenge Details - Large Card */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 h-full">
                  {/* <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Challenge Details</h2>
                      <p className="text-gray-400">Configure your challenge settings</p>
                    </div>
                  </div> */}

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-white">Challenge Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter challenge title"
                              className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-white">Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-white/50">
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-black/60 backdrop-blur-sm border-gray-600/50">
                                <SelectItem value="Easy" className="flex items-center gap-2 text-white hover:bg-black/40">
                                  <Flag className="h-4 w-4 text-white" />
                                  <span>Easy</span>
                                </SelectItem>
                                <SelectItem value="Medium" className="flex items-center gap-2 text-white hover:bg-black/40">
                                  <Brain className="h-4 w-4 text-white" />
                                  <span>Medium</span>
                                </SelectItem>
                                <SelectItem value="Hard" className="flex items-center gap-2 text-white hover:bg-black/40">
                                  <Trophy className="h-4 w-4 text-white" />
                                  <span>Hard</span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="config.maxUsers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-white">Max Participants</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="30"
                                className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-white/50"
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="timeLimitMillis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-white">Time Limit</FormLabel>
                            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-gray-600/50 rounded-xl p-3">
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="1"
                                  className="bg-transparent border-0 text-white focus:ring-0 text-center"
                                  value={Math.floor((field.value ?? 0) / 3600)}
                                  onChange={(e) => {
                                    const hours = Number(e.target.value);
                                    const current = Number.isFinite(field.value) ? field.value : 0;
                                    const minutes = Math.floor((current % 3600) / 60);
                                    field.onChange((hours * 3600) + (minutes * 60));
                                  }}
                                  min={0}
                                  max={24}
                                />
                              </FormControl>
                              <span className="text-gray-400 text-sm">hrs</span>
                              <div className="h-6 w-px bg-gray-500/50"></div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="bg-transparent border-0 text-white focus:ring-0 text-center"
                                  value={Math.floor(((field.value ?? 0) % 3600) / 60)}
                                  onChange={(e) => {
                                    const minutes = Number(e.target.value);
                                    const current = Number.isFinite(field.value) ? field.value : 0;
                                    const hours = Math.floor(current / 3600);
                                    field.onChange((hours * 3600) + (minutes * 60));
                                  }}
                                  min={0}
                                  max={59}
                                />
                              </FormControl>
                              <span className="text-gray-400 text-sm">min</span>
                            </div>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lobbyBufferSeconds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold text-white">Lobby Buffer</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="300"
                                className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-white/50"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                min={0}
                                max={86400}
                              />
                            </FormControl>
                            <p className="text-xs text-gray-400">seconds</p>
                            <FormMessage className="text-red-400" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border border-gray-600/50 p-4 bg-black/30 backdrop-blur-sm">
                          <div className="space-y-0.5">
                            <FormLabel className="text-sm font-semibold text-white">Private Challenge</FormLabel>
                            <p className="text-xs text-gray-400">
                              Only users with access code can join
                            </p>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="border-gray-500/50 text-white focus:ring-white/50"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Problem Selection - Black Card */}
              <div className="lg:col-span-2">
                <div className="bg-black/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Puzzle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Problem Selection</h2>
                      <p className="text-gray-400 text-sm">Choose your challenges</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-black/30 backdrop-blur-sm rounded-xl p-4">
                      <span className="text-white font-medium">Problems Selected</span>
                      <span className="text-2xl font-bold text-white">
                        {useRandomProblems ? `${totalQuestions}/10` : `${selectedProblems.length}/10`}
                      </span>
                    </div>

                    <Tabs value={useRandomProblems ? "random" : "predefined"} onValueChange={(value) => {
                      setUseRandomProblems(value === "random");
                      setSelectedProblems([]);
                    }} className="w-full">
                      <TabsList className="grid grid-cols-2 w-full bg-black/30 backdrop-blur-sm rounded-xl p-1">
                        <TabsTrigger
                          value="random"
                          className="flex items-center gap-2 py-2 text-sm font-medium text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"
                        >
                          <Sparkles className="h-4 w-4" />
                          Random
                        </TabsTrigger>
                        <TabsTrigger
                          value="predefined"
                          className="flex items-center gap-2 py-2 text-sm font-medium text-white data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"
                        >
                          <Check className="h-4 w-4" />
                          Predefined
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="random" className="space-y-3 mt-4">
                        <div className="space-y-3">
                          <FormField
                            control={form.control}
                            name="config.maxEasyQuestions"
                            render={({ field }) => {
                              const totalQuestions = form.getValues().config.maxEasyQuestions + form.getValues().config.maxMediumQuestions + form.getValues().config.maxHardQuestions;
                              return (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium text-white flex items-center gap-2">
                                    <Flag className="h-4 w-4" />
                                    Easy Problems
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-white/50"
                                      disabled={isLoadingCounts || problemCounts.easy === 0 || totalQuestions >= 10}
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      max={problemCounts.easy}
                                      min={0}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-gray-400">
                                    Available: {problemCounts.easy} problems
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
                                  <FormLabel className="text-sm font-medium text-white flex items-center gap-2">
                                    <Brain className="h-4 w-4" />
                                    Medium Problems
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-white/50"
                                      disabled={isLoadingCounts || problemCounts.medium === 0 || totalQuestions >= 10}
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      max={problemCounts.medium}
                                      min={0}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-gray-400">
                                    Available: {problemCounts.medium} problems
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
                                  <FormLabel className="text-sm font-medium text-white flex items-center gap-2">
                                    <Trophy className="h-4 w-4" />
                                    Hard Problems
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="bg-black/30 backdrop-blur-sm border-gray-600/50 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-white/50"
                                      disabled={isLoadingCounts || problemCounts.hard === 0 || totalQuestions >= 10}
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                      max={problemCounts.hard}
                                      min={0}
                                    />
                                  </FormControl>
                                  <p className="text-xs text-gray-400">
                                    Available: {problemCounts.hard} problems
                                  </p>
                                </FormItem>
                              );
                            }}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="predefined" className="space-y-3 mt-4">
                        <div className="space-y-3">
                          <div className="flex items-center bg-black/30 backdrop-blur-sm border border-gray-600/50 rounded-xl px-3 py-2">
                            <Search className="h-4 w-4 text-gray-400 mr-2" />
                            <Input
                              placeholder="Search problems..."
                              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-gray-400"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>

                          {problemsLoading || isLoadingCounts ? (
                            <div className="flex justify-center items-center h-[150px] bg-black/30 backdrop-blur-sm rounded-xl">
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                                <p className="text-sm text-gray-400">Loading problems...</p>
                              </div>
                            </div>
                          ) : (
                            <ScrollArea className="h-[200px] bg-black/30 backdrop-blur-sm rounded-xl p-3">
                              {filteredProblems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-6 text-center text-gray-400">
                                  <Search className="h-6 w-6 mb-2" />
                                  <p className="text-sm font-medium">No problems found</p>
                                  {searchQuery && (
                                    <p className="text-xs mt-1">Try different search terms</p>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {filteredProblems.map((problem) => (
                                    <div
                                      key={problem.problemId}
                                      onClick={() => handleProblemSelect({
                                        problemId: problem.problemId,
                                        title: problem.title,
                                        difficulty: problem.difficulty,
                                      })}
                                      className={`flex items-center justify-between rounded-lg p-3 transition-all cursor-pointer ${selectedProblems.find(p => p.problemId === problem.problemId)
                                        ? 'bg-black/40 backdrop-blur-sm border border-gray-600/50'
                                        : 'bg-black/20 hover:bg-black/30 border border-transparent'
                                        }`}
                                    >
                                      <div className="flex items-center gap-3 flex-1">
                                        <div>
                                          {getDifficultyIcon(problem.difficulty)}
                                        </div>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-white line-clamp-1">{problem.title}</p>
                                          <Badge
                                            variant="outline"
                                            className={`text-xs mt-1 font-medium border-gray-600/50 text-white`}
                                          >
                                            {problem.difficulty}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className="flex items-center">
                                        {selectedProblems.find(p => p.problemId === problem.problemId) ? (
                                          <Check className="h-4 w-4 text-white" />
                                        ) : (
                                          <PlusCircle className="h-4 w-4 text-gray-400" />
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </ScrollArea>
                          )}

                          {selectedProblems.length > 0 && (
                            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                                  <Check className="h-4 w-4" />
                                  Selected ({selectedProblems.length}/10)
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-white border-gray-600/50 hover:bg-black/40"
                                  onClick={() => setSelectedProblems([])}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Clear
                                </Button>
                              </div>

                              <ScrollArea className="max-h-[100px]">
                                <div className="space-y-1">
                                  {selectedProblems.map((problem) => (
                                    <div
                                      key={problem.problemId}
                                      className="flex items-center justify-between p-2 rounded-lg bg-black/20"
                                    >
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        {getDifficultyIcon(problem.difficulty)}
                                        <span className="text-sm text-white truncate">{problem.title}</span>
                                      </div>
                                      <XCircle
                                        className="h-4 w-4 cursor-pointer hover:text-red-300 text-gray-400"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleProblemSelect(problem);
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default CreateChallenge;