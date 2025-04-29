
import React from 'react';
import { FileCode } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MOCK_PROBLEMS } from '../../services/challengeSocketService';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface ProblemsListProps {
  problemIds: string[];
  selectedProblemId: string | null;
  onProblemSelect: (problemId: string) => void;
}

const ProblemsList: React.FC<ProblemsListProps> = ({
  problemIds, 
  selectedProblemId,
  onProblemSelect
}) => {
  const selectedProblem = selectedProblemId ? MOCK_PROBLEMS[selectedProblemId] : null;

  return (
    <>
      <CardHeader className="pb-2 border-b border-zinc-800/60">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <FileCode className="h-5 w-5 text-primary mr-2" />
            Problems
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                {selectedProblem ? (
                  <span>Problem: {selectedProblem.title}</span>
                ) : (
                  <span>Select Problem</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-zinc-900 border border-zinc-700">
              {problemIds.map((problemId, index) => {
                const problem = MOCK_PROBLEMS[problemId] || { 
                  id: problemId, 
                  title: `Problem ${index + 1}`,
                  difficulty: 'Unknown',
                  description: 'No description available'
                };
                
                return (
                  <DropdownMenuItem 
                    key={problemId} 
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                      selectedProblemId === problemId ? 'bg-primary/20' : 'hover:bg-zinc-800'
                    }`}
                    onClick={() => onProblemSelect(problemId)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center font-mono text-xs bg-zinc-700/70 text-zinc-300 rounded-full w-6 h-6">
                        {index + 1}
                      </div>
                      <span>{problem.title}</span>
                    </div>
                    <Badge variant="outline" className={`
                      ${problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                        problem.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                          'text-red-500 border-red-500/30'}
                    `}>
                      {problem.difficulty}
                    </Badge>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {selectedProblem ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-800/30 border border-zinc-700/30 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">{selectedProblem.title}</h3>
              <Badge variant="outline" className={`
                ${selectedProblem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                  selectedProblem.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                    'text-red-500 border-red-500/30'}
              `}>
                {selectedProblem.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-zinc-400">{selectedProblem.description}</p>
            <Button 
              size="sm" 
              className="mt-3 w-full bg-primary hover:bg-primary/90"
              onClick={() => onProblemSelect(selectedProblemId!)}
            >
              Solve Problem
            </Button>
          </motion.div>
        ) : (
          <div className="text-center py-6 text-zinc-400">
            Select a problem to view details
          </div>
        )}
      </CardContent>
    </>
  );
};

export default ProblemsList;
