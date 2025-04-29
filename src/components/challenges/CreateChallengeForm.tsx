
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import { createChallenge } from '@/api/challengeApi';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Challenge } from '@/api/challengeTypes';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks/useAppSelector';

// Form schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters."
  }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  isPrivate: z.boolean().default(false),
  selectedProblems: z.string().array().nonempty({
    message: "Please select at least one problem."
  }),
  timeLimit: z.number().min(1, {
    message: "Time limit must be at least 1 minute."
  })
});

interface ProblemOption {
  id: string;
  title: string;
  difficulty: string;
}

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (challenge: Challenge) => void;
  problems?: ProblemOption[];
}

const CreateChallengeForm = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  problems = [] 
}: CreateChallengeFormProps) => {
  const [loading, setLoading] = useState(false);
  const userProfile = useAppSelector(state => state.auth.userProfile);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "Easy",
      isPrivate: false,
      selectedProblems: [],
      timeLimit: 60
    }
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      // Convert the form data to the API request format
      const response = await createChallenge({
        title: values.title,
        difficulty: values.difficulty,
        problemIds: values.selectedProblems,
        isPrivate: values.isPrivate,
        timeLimit: values.timeLimit * 60,
        creatorId: userProfile?.userID || ""
      });
      
      // Create a proper Challenge object from the response
      const createdChallenge: Challenge = {
        id: response.id,
        title: values.title,
        creatorId: userProfile?.userID || "",
        difficulty: values.difficulty,
        isPrivate: values.isPrivate,
        status: "created",
        password: response.password,
        problemIds: values.selectedProblems,
        timeLimit: values.timeLimit * 60,
        createdAt: Date.now(),
        isActive: true,
        participantIds: [],
        userProblemMetadata: {}
      };
      
      toast.success("Challenge created successfully!");
      onSuccess(createdChallenge);
      onClose();
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error("An error occurred while creating the challenge");
    } finally {
      setLoading(false);
    }
  };

  const toggleProblemSelection = (problemId: string) => {
    setSelectedProblems(prev => {
      if (prev.includes(problemId)) {
        return prev.filter(id => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };
  
  useEffect(() => {
    form.setValue("selectedProblems", selectedProblems);
  }, [selectedProblems, form]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create Challenge</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Challenge Title" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a difficulty" />
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
              
              <FormField
                control={form.control}
                name="isPrivate"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Private Challenge
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="selectedProblems"
                render={() => (
                  <FormItem>
                    <FormLabel>Problems</FormLabel>
                    <div className="relative">
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={popoverOpen}
                            className="w-full justify-between"
                          >
                            {selectedProblems.length > 0 ? `${selectedProblems.length} problems selected` : "Select problems"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search problems..." />
                            <CommandEmpty>No problems found.</CommandEmpty>
                            <CommandList>
                              <CommandGroup>
                                {problems.map((problem) => {
                                  const isSelected = selectedProblems.includes(problem.id);
                                  return (
                                    <CommandItem
                                      key={problem.id}
                                      onSelect={() => {
                                        toggleProblemSelection(problem.id);
                                      }}
                                    >
                                      <div className="flex items-center justify-between w-full">
                                        <span>{problem.title}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline">{problem.difficulty}</Badge>
                                          {isSelected && <Check className="h-4 w-4" />}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {selectedProblems.length > 0 && (
                        problems
                          .filter(p => selectedProblems.includes(p.id))
                          .map(problem => (
                            <Badge 
                              key={problem.id}
                              variant="secondary"
                              className="py-1 px-2 flex items-center gap-1"
                            >
                              {problem.title}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 rounded-full"
                                onClick={() => toggleProblemSelection(problem.id)}
                              >
                                <span className="sr-only">Remove</span>
                                <Check className="h-2 w-2" />
                              </Button>
                            </Badge>
                          ))
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Time Limit in minutes"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Challenge"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeForm;
