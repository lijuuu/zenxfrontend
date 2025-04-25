import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Listbox } from '@headlessui/react';
import { Check, ChevronsUpDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from '@/hooks/useUser';
import { createChallenge } from '@/api/challengeApi';
import { CreateChallengeRequest, Challenge } from '@/types/challengeTypes';
import { DatePicker } from "@/components/ui/date-picker"

interface CreateChallengeFormData {
  title: string;
  difficulty: string;
  isPrivate: boolean;
  selectedProblems: string[];
  timeLimit: number;
  expectedStart?: Date;
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  isPrivate: z.boolean().default(false),
  selectedProblems: z.string().array().nonempty({
    message: "Please select at least one problem.",
  }),
  timeLimit: z.number().min(1, {
    message: "Time limit must be at least 1 minute.",
  }),
  expectedStart: z.date().optional(),
});

interface CreateChallengeFormProps {
  problems: { id: string; title: string }[];
  closeModal: () => void;
  onChallengeCreated: (challenge: Challenge) => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({ problems, closeModal, onChallengeCreated }) => {
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();
  const { toast } = useToast();
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  const form = useForm<CreateChallengeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "Easy",
      isPrivate: false,
      selectedProblems: [],
      timeLimit: 60,
    },
  });

  const handleSubmit: SubmitHandler<CreateChallengeFormData> = async (values: CreateChallengeFormData) => {
    try {
      setLoading(true);
      
      // Convert the form data to the API request format
      const request: CreateChallengeRequest = {
        title: values.title,
        creator_id: userData?.userID || "",
        difficulty: values.difficulty,
        is_private: values.isPrivate,
        problem_ids: values.selectedProblems,
        time_limit: values.timeLimit * 60, // Convert minutes to seconds
        expected_start: values.expectedStart ? new Date(values.expectedStart).getTime() : undefined
      };
      
      const response = await createChallenge(request);
      
      if (response.success) {
        // Create a proper Challenge object from the response
        const createdChallenge: Challenge = {
          id: response.payload.id,
          title: values.title,
          creatorId: userData?.userID || "",
          difficulty: values.difficulty,
          isPrivate: values.isPrivate,
          status: "created",
          password: response.payload.password,
          problemIds: values.selectedProblems,
          timeLimit: values.timeLimit * 60,
          createdAt: Date.now(),
          isActive: true,
          participantIds: [],
        };
        
        onChallengeCreated(createdChallenge);
        toast.success("Challenge created successfully!");
        closeModal();
      } else {
        toast.error(response.error?.message || "Failed to create challenge");
      }
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast.error("An error occurred while creating the challenge");
    } finally {
      setLoading(false);
    }
  };

  const toggleProblemSelection = (problemId: string) => {
    if (selectedProblems.includes(problemId)) {
      setSelectedProblems(selectedProblems.filter((id) => id !== problemId));
    } else {
      setSelectedProblems([...selectedProblems, problemId]);
    }
    form.setValue("selectedProblems", selectedProblems);
  };

  useEffect(() => {
    form.setValue("selectedProblems", selectedProblems);
  }, [selectedProblems, form]);

  return (
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <FormLabel className="text-base">Private Challenge</FormLabel>
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
                <Listbox value={selectedProblems} onChange={setSelectedProblems} multiple>
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selectedProblems.length > 0
                          ? `${selectedProblems.length} problems selected`
                          : 'Select problems'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronsUpDown
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                      {problems.map((problem) => (
                        <Listbox.Option
                          key={problem.id}
                          className={({ active, selected }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                            }`
                          }
                          value={problem.id}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {problem.title}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <Check className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
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

        <FormField
          control={form.control}
          name="expectedStart"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-1.5">
              <FormLabel>Expected Start Time</FormLabel>
              <DatePicker
                onSelect={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Challenge"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateChallengeForm;
