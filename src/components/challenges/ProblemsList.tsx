
import React from 'react';
import { FileCode } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProblemCard from './ProblemCard';
import { MOCK_PROBLEMS } from '../../services/challengeSocketService';

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
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
            {problemIds.map((problemId, index) => (
              <ProblemCard
                key={problemId}
                problem={MOCK_PROBLEMS[problemId] || { 
                  id: problemId, 
                  title: `Problem ${index + 1}`,
                  difficulty: 'Unknown',
                  description: 'No description available'
                }}
                index={index}
                isSelected={selectedProblemId === problemId}
                onClick={() => onProblemSelect(problemId)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ProblemsList;
