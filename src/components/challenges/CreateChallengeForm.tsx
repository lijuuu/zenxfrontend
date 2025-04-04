
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { createChallenge } from "@/api/challengeApi";
import { Challenge, User as UserType } from "@/api/types";
import {
  FileCode,
  Lock,
  Unlock,
  Copy,
  Check,
  Clock,
  X,
  Plus,
  Users,
  Search,
  CheckCircle,
  User,
  ChevronsUpDown,
  AlertCircle
} from "lucide-react";
import UserSearch from "./UserSearch";
import { searchUsers } from "@/api/challengeApi";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  isPrivate: z.boolean(),
  timeLimit: z.string(),
  problemIds: z.array(z.string()).min(1, "Select at least one problem"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: Challenge) => void;
}

// Create a simplified Friend type that doesn't need all User properties
interface FriendItem {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  isOnline?: boolean;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [accessCode, setAccessCode] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [problems, setProblems] = useState([
    { id: "p1", title: "Two Sum", difficulty: "Easy" },
    { id: "p2", title: "Valid Parentheses", difficulty: "Easy" },
    { id: "p3", title: "Merge Two Sorted Lists", difficulty: "Easy" },
    { id: "p4", title: "LRU Cache", difficulty: "Medium" },
    { id: "p5", title: "Longest Substring", difficulty: "Medium" },
    { id: "p6", title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
    { id: "p7", title: "Reverse Linked List", difficulty: "Easy" },
    { id: "p8", title: "Trapping Rain Water", difficulty: "Hard" },
    { id: "p9", title: "Word Search II", difficulty: "Hard" },
  ]);
  const [selectedFriends, setSelectedFriends] = useState<FriendItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Mock friends
  const friends: FriendItem[] = [
    { id: '1', username: 'sophiew', fullName: 'Sophie Williams', profileImage: 'https://i.pravatar.cc/300?img=9', isOnline: true },
    { id: '2', username: 'tsmith', fullName: 'Taylor Smith', profileImage: 'https://i.pravatar.cc/300?img=5', isOnline: false },
    { id: '3', username: 'mchen', fullName: 'Mike Chen', profileImage: 'https://i.pravatar.cc/300?img=3', isOnline: true },
    { id: '4', username: 'alexj', fullName: 'Alex Johnson', profileImage: 'https://i.pravatar.cc/300?img=4', isOnline: false },
    { id: '5', username: 'ewilson', fullName: 'Emma Wilson', profileImage: 'https://i.pravatar.cc/300?img=2', isOnline: true },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "medium",
      isPrivate: false,
      timeLimit: "30",
      problemIds: [],
    },
  });

  const isPrivate = form.watch("isPrivate");

  const generateAccessCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setAccessCode(code);
  };

  React.useEffect(() => {
    if (isPrivate && !accessCode) {
      generateAccessCode();
    }
  }, [isPrivate]);

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard",
    });
  };

  const toggleProblem = (problemId: string) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
    form.setValue("problemIds", selectedProblems.includes(problemId)
      ? selectedProblems.filter((id) => id !== problemId)
      : [...selectedProblems, problemId]);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFriendSelection = (friend: FriendItem | UserType) => {
    // Create a FriendItem from either a FriendItem or UserType
    const friendItem: FriendItem = {
      id: friend.id,
      username: friend.username,
      fullName: friend.fullName,
      profileImage: friend.profileImage || '',
      isOnline: 'isOnline' in friend ? friend.isOnline : undefined
    };
    
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.id === friendItem.id);
      return isSelected 
        ? prev.filter(f => f.id !== friendItem.id)
        : [...prev, friendItem];
    });
  };

  const goToNextTab = () => {
    if (activeTab === "basic") {
      setActiveTab("problems");
    } else if (activeTab === "problems") {
      setActiveTab("invite");
    }
  };

  const goToPrevTab = () => {
    if (activeTab === "problems") {
      setActiveTab("basic");
    } else if (activeTab === "invite") {
      setActiveTab("problems");
    }
  };

  const onSubmit = async (data: FormValues) => {
    // Make sure problemIds is set correctly
    data.problemIds = selectedProblems;
    
    if (data.problemIds.length === 0) {
      toast({
        title: "No problems selected",
        description: "Please select at least one problem",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const challenge = await createChallenge({
        title: data.title,
        difficulty: data.difficulty,
        problemIds: data.problemIds,
        isPrivate: data.isPrivate,
        timeLimit: parseInt(data.timeLimit),
        invitedUsers: selectedFriends.map(f => f.id),
      });

      toast({
        title: "Challenge created!",
        description: data.isPrivate
          ? `Your private challenge has been created. Access code: ${accessCode}`
          : "Your challenge has been created successfully.",
      });

      if (onSuccess) {
        onSuccess(challenge);
      }

      // Reset form
      form.reset();
      setSelectedProblems([]);
      setSelectedFriends([]);
      setAccessCode("");
      onClose();
    } catch (error) {
      console.error("Failed to create challenge:", error);
      toast({
        title: "Failed to create challenge",
        description: "There was an error creating your challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileCode className="mr-2 h-5 w-5 text-green-500" />
            Create Challenge
          </DialogTitle>
          <DialogDescription>
            Set up a new coding challenge for yourself or friends
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="invite">Invite Friends</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Algorithm Sprint" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your challenge..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-2 mt-2"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="easy"
                                id="r-easy"
                                className="sr-only"
                              />
                              <FormLabel
                                htmlFor="r-easy"
                                className={cn(
                                  "px-2 py-1 text-xs rounded-full cursor-pointer",
                                  field.value === "easy"
                                    ? "bg-green-500 text-white"
                                    : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                )}
                              >
                                Easy
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="medium"
                                id="r-medium"
                                className="sr-only"
                              />
                              <FormLabel
                                htmlFor="r-medium"
                                className={cn(
                                  "px-2 py-1 text-xs rounded-full cursor-pointer",
                                  field.value === "medium"
                                    ? "bg-amber-500 text-white"
                                    : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                )}
                              >
                                Medium
                              </FormLabel>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem
                                value="hard"
                                id="r-hard"
                                className="sr-only"
                              />
                              <FormLabel
                                htmlFor="r-hard"
                                className={cn(
                                  "px-2 py-1 text-xs rounded-full cursor-pointer",
                                  field.value === "hard"
                                    ? "bg-red-500 text-white"
                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                )}
                              >
                                Hard
                              </FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Limit</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex flex-col space-y-1 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="15" id="time-15" />
                              <FormLabel htmlFor="time-15">15 minutes</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="30" id="time-30" />
                              <FormLabel htmlFor="time-30">30 minutes</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="60" id="time-60" />
                              <FormLabel htmlFor="time-60">1 hour</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center">
                          {field.value ? (
                            <Lock className="mr-2 h-4 w-4 text-orange-500" />
                          ) : (
                            <Unlock className="mr-2 h-4 w-4 text-green-500" />
                          )}
                          {field.value ? "Private Challenge" : "Public Challenge"}
                        </FormLabel>
                        <FormDescription>
                          {field.value
                            ? "Only invited users can join with an access code"
                            : "Anyone can join the challenge"}
                        </FormDescription>
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

                {isPrivate && (
                  <div className="p-3 bg-orange-50/30 dark:bg-orange-900/10 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium flex items-center gap-1">
                        <Lock className="h-4 w-4 text-orange-500" />
                        Access Code
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7"
                          onClick={generateAccessCode}
                        >
                          Regenerate
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7"
                          onClick={copyAccessCode}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="font-mono text-lg bg-orange-100/80 dark:bg-orange-900/30 px-4 py-2 rounded text-orange-800 dark:text-orange-300 tracking-widest">
                        {accessCode}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Share this code with your friends to join your private challenge
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="problems" className="space-y-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Select Problems</h3>
                  <Badge variant="outline">
                    Selected: {selectedProblems.length}
                  </Badge>
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {problems.map((problem) => (
                      <Card
                        key={problem.id}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedProblems.includes(problem.id)
                            ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5"
                            : "hover:bg-accent/5"
                        )}
                        onClick={() => toggleProblem(problem.id)}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{problem.title}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  problem.difficulty === "Easy"
                                    ? "bg-green-100/50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50"
                                    : problem.difficulty === "Medium"
                                    ? "bg-amber-100/50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50"
                                    : "bg-red-100/50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50"
                                )}
                              >
                                {problem.difficulty}
                              </Badge>
                            </div>
                          </div>
                          {selectedProblems.includes(problem.id) ? (
                            <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[hsl(var(--accent-green))]">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full flex items-center justify-center border border-dashed border-muted-foreground">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>

                {selectedProblems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
                    <p>No problems selected</p>
                    <p className="text-xs">Please select at least one problem</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="invite" className="space-y-4 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Invite Friends</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>Selected: {selectedFriends.length}</span>
                  </Badge>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <Button 
                    type="button"
                    onClick={handleSearch} 
                    className="accent-color"
                    disabled={searchQuery.length < 2 || isSearching}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                <Tabs defaultValue="friends" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="friends">Friends</TabsTrigger>
                    <TabsTrigger value="search">Search Results</TabsTrigger>
                  </TabsList>

                  <TabsContent value="friends" className="pt-4">
                    <ScrollArea className="h-[200px] pr-4">
                      {friends.length > 0 ? (
                        <div className="space-y-2">
                          {friends.map((friend) => (
                            <Card 
                              key={friend.id} 
                              className={cn(
                                "cursor-pointer transition-colors",
                                selectedFriends.some(f => f.id === friend.id)
                                  ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5" 
                                  : "hover:bg-accent/5"
                              )}
                              onClick={() => toggleFriendSelection(friend)}
                            >
                              <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="relative mr-3">
                                    <img 
                                      src={friend.profileImage} 
                                      alt={friend.fullName} 
                                      className="w-10 h-10 rounded-full"
                                    />
                                    {friend.isOnline && (
                                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></span>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm">{friend.fullName}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      @{friend.username} • {friend.isOnline ? 'Online' : 'Offline'}
                                    </p>
                                  </div>
                                </div>
                                
                                {selectedFriends.some(f => f.id === friend.id) ? (
                                  <CheckCircle className="h-5 w-5 text-[hsl(var(--accent-green))]" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-dashed border-muted-foreground"></div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                          <User className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                          <p className="text-muted-foreground">No friends found</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="search" className="pt-4">
                    <ScrollArea className="h-[200px] pr-4">
                      {searchResults.length > 0 ? (
                        <div className="space-y-2">
                          {searchResults.map((user) => (
                            <Card 
                              key={user.id} 
                              className={cn(
                                "cursor-pointer transition-colors",
                                selectedFriends.some(f => f.id === user.id)
                                  ? "border-[hsl(var(--accent-green))] bg-[hsl(var(--accent-green))]/5" 
                                  : "hover:bg-accent/5"
                              )}
                              onClick={() => toggleFriendSelection(user)}
                            >
                              <CardContent className="p-3 flex items-center justify-between">
                                <div className="flex items-center">
                                  <img 
                                    src={user.profileImage} 
                                    alt={user.fullName} 
                                    className="w-10 h-10 rounded-full mr-3"
                                  />
                                  <div>
                                    <h4 className="font-medium text-sm">{user.fullName}</h4>
                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                  </div>
                                </div>
                                
                                {selectedFriends.some(f => f.id === user.id) ? (
                                  <CheckCircle className="h-5 w-5 text-[hsl(var(--accent-green))]" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border border-dashed border-muted-foreground"></div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : searchQuery.length > 1 ? (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                          <p className="text-muted-foreground">No users found</p>
                          <p className="text-xs text-muted-foreground">Try a different search term</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                          <Search className="h-10 w-10 text-muted-foreground mb-2 opacity-40" />
                          <p className="text-muted-foreground">Search for users</p>
                          <p className="text-xs text-muted-foreground">Enter at least 2 characters</p>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                {selectedFriends.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected Friends ({selectedFriends.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFriends.map(friend => (
                        <Badge 
                          key={friend.id}
                          className="flex items-center gap-1 py-1 pl-1 pr-2"
                        >
                          <img 
                            src={friend.profileImage} 
                            alt={friend.username}
                            className="w-5 h-5 rounded-full"
                          />
                          <span>{friend.fullName}</span>
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer opacity-70 hover:opacity-100" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFriendSelection(friend);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between items-center mt-6 pt-4 border-t">
              <div>
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPrevTab}
                  >
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                {activeTab !== "invite" ? (
                  <Button
                    type="button"
                    className="accent-color"
                    onClick={goToNextTab}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="accent-color"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      "Creating Challenge..."
                    ) : (
                      <>
                        <FileCode className="mr-2 h-4 w-4" />
                        Create Challenge
                      </>
                    )}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
