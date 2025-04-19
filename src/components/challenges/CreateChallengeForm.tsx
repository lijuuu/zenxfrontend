import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, XCircle, Calendar as CalendarIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useProblemList } from "@/services/useProblemList";
import { Checkbox } from "@/components/ui/checkbox";
import { createChallenge } from "@/api/challengeApi";
import { Challenge } from "@/api/types";

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

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
  scheduledStart: z.date().optional(),
});

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
      scheduledStart: undefined,
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

  const onSubmit = async (formData: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const newChallenge = await createChallenge({
        title: formData.title,
        difficulty: formData.difficulty,
        problem_ids: selectedProblems.map(p => p.id),
        is_private: formData.isPrivate,
        time_limit: formData.timeLimit,
        access_code: formData.isPrivate ? formData.accessCode : undefined,
        start_at: formData.scheduledStart ? new Date(formData.scheduledStart) : undefined
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
          <DialogTitle>Create New Challenge</DialogTitle>
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
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
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
                    <FormDescription>
                      Only users with the access code can join.
                    </FormDescription>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Scheduled Start</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Select Problems</FormLabel>
              {problemsLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 border rounded-md">
                  {problems?.map((problem) => (
                    <div key={problem.id} className="flex items-center justify-between">
                      <label
                        htmlFor={`problem-${problem.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed flex-1"
                      >
                        {problem.title}
                      </label>
                      <Checkbox
                        id={`problem-${problem.id}`}
                        checked={selectedProblems.find(p => p.id === problem.id) !== undefined}
                        onCheckedChange={() => handleProblemSelect(problem.id, problem.title)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Challenge"
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

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

function FormDescription({
  className,
  ...props
}: FormDescriptionProps) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
