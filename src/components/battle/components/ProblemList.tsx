
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, CheckCircle } from 'lucide-react';
import { Problem } from '../types';
import { getDifficultyColor } from '../utils/colorUtils';

interface ProblemListProps {
  problems: Problem[];
  currentProblemIndex: number;
  onProblemSelect: (index: number) => void;
  completedCount?: number;
}

const ProblemList: React.FC<ProblemListProps> = ({ 
  problems, 
  currentProblemIndex, 
  onProblemSelect,
  completedCount = 1 
}) => {
  const totalProblems = problems.length;
  const progressPercentage = (completedCount / totalProblems) * 100;
  
  return (
    <div className="w-full md:w-[250px] md:min-w-[250px] border-r border-zinc-800 flex flex-col bg-zinc-900/40">
      <div className="p-3 border-b border-zinc-800">
        <h3 className="font-medium flex items-center gap-1.5">
          <Code className="h-4 w-4 text-green-500" />
          Challenge Problems
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {problems.map((problem, index) => (
          <button
            key={problem.id}
            className={`flex flex-col p-3 border-b border-zinc-800/50 text-left hover:bg-zinc-800/50 transition-colors w-full
              ${currentProblemIndex === index ? 'bg-zinc-800/70' : ''}`}
            onClick={() => onProblemSelect(index)}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{problem.title}</span>
              {index === 0 && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <div className="flex items-center justify-between mt-1">
              <Badge className={`${getDifficultyColor(problem.difficulty)} text-white`}>
                {problem.difficulty}
              </Badge>
              <span className="text-xs text-zinc-500">#{index + 1}</span>
            </div>
          </button>
        ))}
      </div>
      
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Your Progress</h4>
            <span className="text-xs text-zinc-400">{completedCount}/{totalProblems} completed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
