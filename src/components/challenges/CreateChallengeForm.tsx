
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, MinusCircle, Clock, Shield, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProblems, useCreateChallenge } from '@/hooks/useChallengeSystem';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CreateChallengeForm: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isPrivate, setIsPrivate] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [selectedProblemIds, setSelectedProblemIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [problemFilters, setProblemFilters] = useState({ 
    difficulty: 'all', 
    tags: '' 
  });

  // Use the hook to fetch problems
  const { data: problems = [], isLoading: isLoadingProblems } = useProblems({
    search,
    difficulty: problemFilters.difficulty !== 'all' ? problemFilters.difficulty : undefined,
    tags: problemFilters.tags
  });

  const createChallengeMutation = useCreateChallenge();

  const handleCreateChallenge = async () => {
    if (!title) {
      toast.error('Please enter a challenge title');
      return;
    }

    if (selectedProblemIds.length === 0) {
      toast.error('Please select at least one problem');
      return;
    }

    try {
      await createChallengeMutation.mutateAsync({
        title,
        creatorId: "user-1", // In a real app, you'd get this from authentication
        difficulty,
        isPrivate,
        problemIds: selectedProblemIds,
        timeLimit
      });

      // Reset form
      setTitle('');
      setDifficulty('Medium');
      setIsPrivate(false);
      setTimeLimit(60);
      setSelectedProblemIds([]);

      // Navigate to challenges page
      navigate('/challenges');
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const toggleProblemSelection = (problemId: string) => {
    setSelectedProblemIds(prev => 
      prev.includes(problemId) 
        ? prev.filter(id => id !== problemId) 
        : [...prev, problemId]
    );
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
      case 'E':
      case '1':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'Medium':
      case 'M':
      case '2':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'Hard':
      case 'H':
      case '3':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20';
    }
  };

  const mapDifficulty = (diff: string): string => {
    const difficultyMap: Record<string, string> = {
      "1": "Easy",
      "2": "Medium",
      "3": "Hard",
      "E": "Easy",
      "M": "Medium",
      "H": "Hard",
    };
    return difficultyMap[diff] || diff;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Challenge</h1>
          <p className="text-zinc-400">Create a coding challenge to compete with friends or the community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Challenge Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Algorithm Sprint" 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={difficulty} 
                    onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                  <div className="flex items-center mt-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setTimeLimit(prev => Math.max(10, prev - 10))}
                      disabled={timeLimit <= 10}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <Input 
                      id="timeLimit" 
                      type="number" 
                      value={timeLimit} 
                      onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)} 
                      className="mx-2 text-center" 
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setTimeLimit(prev => Math.min(240, prev + 10))}
                      disabled={timeLimit >= 240}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="private">Private Challenge</Label>
                    <p className="text-xs text-zinc-500">Limit access with an invite code</p>
                  </div>
                  <Switch 
                    id="private" 
                    checked={isPrivate} 
                    onCheckedChange={setIsPrivate} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCreateChallenge} 
                  disabled={createChallengeMutation.isPending || title === '' || selectedProblemIds.length === 0}
                >
                  {createChallengeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Challenge
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Problems</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProblemIds.length === 0 ? (
                  <div className="text-center p-4 text-zinc-500">
                    <p>No problems selected</p>
                    <p className="text-xs mt-1">Select problems from the list on the right</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedProblemIds.map(id => {
                      const problem = problems.find(p => p.problem_id === id);
                      return problem ? (
                        <div 
                          key={id} 
                          className="flex items-center justify-between py-2 px-3 bg-zinc-800/40 rounded-md hover:bg-zinc-800/60"
                        >
                          <div>
                            <p className="font-medium">{problem.title}</p>
                            <div className="flex items-center mt-1">
                              <Badge className={`mr-2 ${getDifficultyColor(problem.difficulty)}`}>
                                {mapDifficulty(problem.difficulty)}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleProblemSelection(id)}
                          >
                            <MinusCircle className="h-4 w-4 text-red-400" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-sm text-zinc-400 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{selectedProblemIds.length} problem{selectedProblemIds.length !== 1 ? 's' : ''} selected</span>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Select Problems</CardTitle>
                <div className="mt-2">
                  <Input
                    placeholder="Search problems by title or tag..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Select 
                    value={problemFilters.difficulty} 
                    onValueChange={(value) => setProblemFilters(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Filter by tag..." 
                    value={problemFilters.tags}
                    onChange={(e) => setProblemFilters(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-[200px]"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingProblems ? (
                  <div className="flex justify-center items-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                  </div>
                ) : problems.length === 0 ? (
                  <div className="text-center p-6 text-zinc-500">
                    <p>No problems found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {problems.map((problem) => (
                        <div 
                          key={problem.problem_id} 
                          className={`flex items-start p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedProblemIds.includes(problem.problem_id) 
                              ? 'border-green-500/50 bg-green-500/5' 
                              : 'border-zinc-700/50 hover:border-zinc-500/50'
                          }`}
                          onClick={() => toggleProblemSelection(problem.problem_id)}
                        >
                          <Checkbox 
                            checked={selectedProblemIds.includes(problem.problem_id)}
                            className="mt-1 mr-3"
                            onCheckedChange={() => toggleProblemSelection(problem.problem_id)}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{problem.title}</h3>
                            <div className="flex items-center mt-2 flex-wrap gap-1">
                              <Badge className={`mr-2 ${getDifficultyColor(problem.difficulty)}`}>
                                {mapDifficulty(problem.difficulty)}
                              </Badge>
                              {problem.tags.slice(0, 3).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {problem.tags.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
                                >
                                  +{problem.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {selectedProblemIds.includes(problem.problem_id) && (
                            <Badge className="ml-2 mt-1 bg-green-500/80 text-white">
                              Selected
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChallengeForm;
