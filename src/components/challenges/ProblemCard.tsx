
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProblemCardProps {
  problem: {
    id: string;
    title: string;
    difficulty: string;
    description: string;
  };
  index: number;
  isSelected: boolean;
  onClick: () => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  isSelected,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className={`p-4 rounded-lg min-w-[280px] border transition-all cursor-pointer ${
        isSelected 
          ? 'bg-primary/20 border-primary/50' 
          : 'bg-zinc-800/30 border-zinc-700/30 hover:border-zinc-600/60'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="flex items-center gap-2">
          <div className="flex items-center justify-center font-mono text-xs bg-zinc-700/70 text-zinc-300 rounded-full w-6 h-6">
            {index + 1}
          </div>
          <h3 className="font-medium">{problem.title || `Problem ${index + 1}`}</h3>
        </span>
        <Badge variant="outline" className={`
          ${problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
            problem.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
              'text-red-500 border-red-500/30'}
        `}>
          {problem.difficulty || 'Unknown'}
        </Badge>
      </div>
      
      <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
        {problem.description || 'No description available'}
      </p>
      
      <Button
        size="sm"
        variant="outline"
        className="w-full gap-1 hover:bg-primary/20 transition-colors"
      >
        Solve <ChevronRight className="h-3 w-3" />
      </Button>
    </motion.div>
  );
};

export default ProblemCard;
