
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  isCompleted?: boolean;
  onClick: () => void;
  compact?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  index,
  isSelected,
  isCompleted = false,
  onClick,
  compact = false
}) => {
  if (compact) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative px-4 py-2 rounded-md border transition-all",
          isSelected 
            ? "bg-green-600/20 border-green-500/60 text-green-400 shadow-lg shadow-green-500/10" 
            : "bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium">P{index + 1}</span>
          {isCompleted && (
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
          )}
        </div>
        {problem.difficulty && (
          <div className="absolute -top-2 -right-2">
            <Badge variant="outline" className={cn(
              "text-xs py-0 px-1.5",
              problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
              problem.difficulty === 'Medium' ? 'text-amber-500 border-amber-500/30' :
                'text-red-500 border-red-500/30'
            )}>
              {problem.difficulty === 'Easy' ? 'E' : 
               problem.difficulty === 'Medium' ? 'M' : 'H'}
            </Badge>
          </div>
        )}
      </motion.button>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected 
          ? 'bg-primary/20 border-primary/50 shadow-lg shadow-primary/10' 
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
      
      <div className={`w-full gap-1 hover:bg-primary/20 transition-colors px-3 py-1.5 rounded-md text-center ${
        isSelected ? 'bg-primary/10 text-primary' : ''
      }`}>
        Solve Problem
      </div>
    </motion.div>
  );
};

export default ProblemCard;
