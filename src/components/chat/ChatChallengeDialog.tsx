
import React, { useState } from 'react';
import { useProblems } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ProblemMetadata } from '@/api/types';

interface ChatChallengeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChallenge: (challenge: {
    id: string;
    title: string;
    creatorId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    isPrivate: boolean;
    accessCode?: string;
    problemIds: string[];
    timeLimit: number;
    createdAt: string;
    isActive: boolean;
    participantIds: string[];
  }) => void;
}

const ChatChallengeDialog: React.FC<ChatChallengeDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreateChallenge 
}) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isPrivate, setIsPrivate] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  // Fetch available problems
  const { data: problems = [], isLoading } = useProblems();

  const handleCreateChallenge = () => {
    // Generate a mock challenge for demo
    const newChallenge = {
      id: `challenge-${Date.now()}`,
      title,
      creatorId: 'current-user-id', // This would come from auth
      difficulty,
      isPrivate,
      accessCode: isPrivate ? `AC-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : undefined,
      problemIds: selectedProblems,
      timeLimit,
      createdAt: new Date().toISOString(),
      isActive: true,
      participantIds: ['current-user-id']
    };

    onCreateChallenge(newChallenge);
    onClose();
    
    // Reset form
    setTitle('');
    setDifficulty('Medium');
    setIsPrivate(false);
    setTimeLimit(60);
    setSelectedProblems([]);
  };

  const toggleProblemSelection = (problemId: string) => {
    setSelectedProblems(prev => 
      prev.includes(problemId)
        ? prev.filter(id => id !== problemId)
        : [...prev, problemId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Coding Challenge</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your challenge"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <RadioGroup 
              value={difficulty} 
              onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Hard')}
              className="flex space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Easy" id="easy" />
                <Label htmlFor="easy" className="cursor-pointer">Easy</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="Hard" id="hard" />
                <Label htmlFor="hard" className="cursor-pointer">Hard</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Time Limit (minutes)</Label>
            <Select 
              value={timeLimit.toString()} 
              onValueChange={(value) => setTimeLimit(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="private" 
              checked={isPrivate} 
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
            />
            <Label htmlFor="private" className="cursor-pointer">Make this challenge private</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Select Problems</Label>
            {isLoading ? (
              <div>Loading problems...</div>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
                {problems.map((problem: ProblemMetadata) => (
                  <div key={problem.problem_id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={problem.problem_id} 
                      checked={selectedProblems.includes(problem.problem_id)}
                      onCheckedChange={() => toggleProblemSelection(problem.problem_id)}
                    />
                    <Label htmlFor={problem.problem_id} className="cursor-pointer">
                      {problem.title} ({problem.difficulty})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleCreateChallenge} 
            disabled={!title || selectedProblems.length === 0}
          >
            Create Challenge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatChallengeDialog;
