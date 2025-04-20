
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, CheckCircle2, XCircle, Calendar as CalendarIcon, Trophy, Flag, Brain } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createChallenge } from "@/api/challengeApi";
import { Challenge } from "@/api/types";
import { useProblemList } from "@/services/useProblemList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Challenge title must be at least 2 characters.",
  }),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  isPrivate: z.boolean().default(false),
  accessCode: z.string().min(4, {
    message: "Access code must be at least 4 characters.",
  }).optional(),
  timeLimit: z.number().min(300, {
    message: "Time limit must be at least 5 minutes.",
  }).default(3600),
});

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<{ id: string; title: string; }[]>([]);
  const { data: problems, isLoading: problemsLoading } = useProblemList();

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

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      setSelectedProblems([]);
    }
  }, [isOpen, form]);

  const handleProblemSelect = (problemId: string, problemTitle: string) => {
    const isSelected = selectedProblems.find(p => p.id === problemId);
    if (isSelected) {
      setSelectedProblems(selectedProblems.filter(p => p.id !== problemId));
    } else {
      setSelectedProblems([...selectedProblems, { id: problemId, title: problemTitle }]);
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return <Flag className="h-4 w-4 text-green-500" />;
      case "Medium":
        return <Brain className="h-4 w-4 text-yellow-500" />;
      case "Hard":
        return <Trophy className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    if (selectedProblems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one problem.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newChallenge = await createChallenge({
        title: formData.title,
        difficulty: formData.difficulty,
        problemIds: selectedProblems.map(p => p.id),
        isPrivate: formData.isPrivate,
        timeLimit: formData.timeLimit,
        accessCode: formData.isPrivate ? formData.accessCode : undefined,
      });

      toast({
        title: "Success",
        description: `Challenge "${formData.title}" created successfully!`,
      });

      if (onSuccess) {
        onSuccess(newChallenge);
      }

      onClose();
    } catch (error) {
      console.error("Failed to create challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <Flag className="h-4 w-4 text-green-500" />
                          Easy
                        </SelectItem>
                        <SelectItem value="Medium" className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-yellow-500" />
                          Medium
                        </SelectItem>
                        <SelectItem value="Hard" className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-red-500" />
                          Hard
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

            <div className="space-y-4">
              <FormLabel>Select Problems</FormLabel>
              {problemsLoading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {problems?.map((problem) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between space-x-4 rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium">{problem.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {problem.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Checkbox
                          id={`problem-${problem.id}`}
                          checked={selectedProblems.find(p => p.id === problem.id) !== undefined}
                          onCheckedChange={() => handleProblemSelect(problem.id, problem.title)}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              {selectedProblems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProblems.map((problem) => (
                    <Badge
                      key={problem.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {problem.title}
                      <XCircle
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleProblemSelect(problem.id, problem.title)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || selectedProblems.length === 0}>
                {loading ? (
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
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
