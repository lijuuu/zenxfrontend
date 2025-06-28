
import React from 'react';
import { FileCode } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MOCK_PROBLEMS } from '../../services/challengeSocketService';
import { motion } from 'framer-motion';
import ProblemCard from './ProblemCard';

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
  return (
    <>
      <CardHeader className="pb-2 border-b border-zinc-800/60">
        <CardTitle className="text-lg flex items-center">
          <FileCode className="h-5 w-5 text-primary mr-2" />
          Problems
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {problemIds.map((problemId, index) => {
            const problem = MOCK_PROBLEMS[problemId] || { 
              id: problemId, 
              title: `Problem ${index + 1}`,
              difficulty: 'Medium',
              description: 'No description available'
            };
            
            const isCompleted = false; // This should be determined from the challenge metadata
            
            return (
              <motion.div
                key={problemId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ProblemCard
                  problem={problem}
                  index={index}
                  isSelected={selectedProblemId === problemId}
                  isCompleted={isCompleted}
                  onClick={() => onProblemSelect(problemId)}
                  compact={false}
                />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </>
  );
};

export default ProblemsList;
