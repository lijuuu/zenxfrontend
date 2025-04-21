
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, PlusCircle, XCircle, Flag, Trophy, Brain, Search, Check, Sparkles, Settings, Puzzle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Challenge } from "@/api/challengeTypes";
import { useProblemList } from "@/services/useProblemList";
import { useCreateChallenge, useUserChallengeHistory } from "@/services/useChallenges";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Challenge title must be at least 2 characters.",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  isPrivate: z.boolean().default(false),
  accessCode: z.string().optional()
    .superRefine((val, ctx) => {
      // Check if we're validating accessCode and if isPrivate is true
      if (ctx.path.includes('accessCode')) {
        const formData = ctx.path[0] ? ctx : { data: undefined };
        const isPrivate = formData.data?.isPrivate;
        
        if (isPrivate && (!val || val.length < 4)) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 4,
            type: "string",
            inclusive: true,
            message: "Access code must be at least 4 characters for private challenges."
          });
          return false;
        }
      }
      return true;
    }),
  timeLimit: z.number().min(300, {
    message: "Time limit must be at least 5 minutes.",
  }).default(3600),
});

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

interface SelectedProblem {
  id: string;
  title: string;
  difficulty: string;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("metadata");
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
      accessCode: "",
      timeLimit: 3600,
    },
  });

  // Watch isPrivate to conditionally validate accessCode
  const isPrivate = form.watch("isPrivate");

  useEffect(() => {
    if (!isPrivate) {
      form.setValue("accessCode", "");
    }
  }, [isPrivate, form]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSelectedProblems([]);
      setSearchQuery("");
      setActiveTab("metadata");
    }
  }, [isOpen, form]);

  const handleProblemSelect = (problem: SelectedProblem) => {
    const isSelected = selectedProblems.find(p => p.id === problem.id);
    
    if (isSelected) {
      setSelectedProblems(selectedProblems.filter(p => p.id !== problem.id));
    } else {
      // Limit to 10 problems max
      if (selectedProblems.length >= 10) {
        toast.warning("Maximum 10 problems allowed", {
          description: "Please remove some problems before adding more."
        });
        return;
      }
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const filteredProblems = problems?.filter(problem =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
      case "E":
        return <Flag className="h-4 w-4 text-green-500" />;
      case "Medium":
      case "M":
        return <Brain className="h-4 w-4 text-yellow-500" />;
      case "Hard":
      case "H":
        return <Trophy className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getColorsByDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
      case "E":
        return "border-green-200 bg-green-50 dark:border-green-950 dark:bg-green-950/30";
      case "Medium":
      case "M":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-950 dark:bg-yellow-950/30";
      case "Hard":
      case "H":
        return "border-red-200 bg-red-50 dark:border-red-950 dark:bg-red-950/30";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/30";
    }
  };

  const canAdvanceToProblems = () => {
    return form.getValues().title.length >= 2;
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
    if (selectedProblems.length === 0) {
      toast.error("Please select at least one problem.");
      return;
    }

    try {
      const newChallenge = await createChallengeMutation.mutateAsync({
        title: formData.title,
        difficulty: formData.difficulty,
        problemIds: selectedProblems.map(p => p.id),
        isPrivate: formData.isPrivate,
        timeLimit: formData.timeLimit,
        accessCode: formData.isPrivate ? formData.accessCode : undefined,
      });

      // Invalidate queries to refetch the latest data
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['user-challenge-history'] });

      if (onSuccess) {
        onSuccess(newChallenge);
      }

      // Navigate to the challenge room
      toast.success(`Challenge "${formData.title}" created! Redirecting to challenge room...`);
      setTimeout(() => {
        navigate(`/challenge-room/${newChallenge.id}`);
      }, 1500);

      onClose();
    } catch (error) {
      console.error("Failed to create challenge:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Create New Challenge
          </DialogTitle>
          <DialogDescription>
            Design your own coding challenge and invite friends to compete!
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Challenge Details
            </TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" />
              Select Problems ({selectedProblems.length}/10)
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <TabsContent value="metadata" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter challenge title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Easy" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-green-500" />
                                <span>Easy</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Medium" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-yellow-500" />
                                <span>Medium</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Hard" className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Trophy className="h-4 w-4 text-red-500" />
                                <span>Hard</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Private Challenge</FormLabel>
                        <DialogDescription>
                          Only users with the access code can join.
                        </DialogDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("isPrivate") && (
                  <FormField
                    control={form.control}
                    name="accessCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter access code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (seconds)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter time limit in seconds"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={goToProblemsTab}
                    className="bg-primary/90 hover:bg-primary"
                  >
                    Continue to Problem Selection
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="problems" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-lg font-medium">Select Problems</FormLabel>
                    <span className="text-sm text-muted-foreground">
                      {selectedProblems.length}/10 problems selected
                    </span>
                  </div>

                  <div className="flex items-center border rounded-md px-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search problems by title..."
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {problemsLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[300px] rounded-md border p-1">
                      <div className="space-y-1 p-2">
                        {filteredProblems.map((problem) => (
                          <div
                            key={problem.problem_id}
                            className={`flex items-center justify-between rounded-md p-2 cursor-pointer transition-colors hover:bg-accent/50 ${selectedProblems.find(p => p.id === problem.problem_id)
                                ? 'bg-accent/50'
                                : ''
                              }`}
                            onClick={() => handleProblemSelect({
                              id: problem.problem_id,
                              title: problem.title,
                              difficulty: problem.difficulty
                            })}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {getDifficultyIcon(problem.difficulty)}
                              <div className="flex-1">
                                <p className="text-sm font-medium line-clamp-1">{problem.title}</p>
                                <Badge variant="outline" className={`text-xs mt-1 ${getColorsByDifficulty(problem.difficulty)}`}>
                                  {problem.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-5 h-5 rounded-full border">
                              {selectedProblems.find(p => p.id === problem.problem_id) && (
                                <Check className="h-3 w-3 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}

                        {filteredProblems.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <p>No problems found</p>
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
                      <div className="text-sm font-medium mb-2">Selected Problems ({selectedProblems.length})</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedProblems.map((problem) => (
                          <Badge
                            key={problem.id}
                            variant="secondary"
                            className={`flex items-center gap-1 ${getColorsByDifficulty(problem.difficulty)}`}
                          >
                            {getDifficultyIcon(problem.difficulty)}
                            {problem.title}
                            <XCircle
                              className="h-3 w-3 cursor-pointer hover:text-destructive ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProblemSelect(problem);
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={createChallengeMutation.isPending}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createChallengeMutation.isPending || selectedProblems.length === 0}
                >
                  {createChallengeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Challenge
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
