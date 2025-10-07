import React from "react";
import { Code, Clock, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProblemProgress {
  score?: number;
  timeTaken?: number;
  completedAt?: number;
}

interface ProblemCardProps {
  problemId: string;
  userProgress?: ProblemProgress;
  onClick: () => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ 
  problemId, 
  userProgress, 
  onClick 
}) => {
  const isCompleted = !!userProgress?.completedAt;
  
  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 bg-zinc-900 border-zinc-800"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600" />
            )}
            <div>
              <h3 className="font-semibold text-sm">Problem #{problemId.substring(0, 8)}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                {isCompleted ? "Completed" : "Not attempted"}
              </p>
            </div>
          </div>
          <Code className="h-5 w-5 text-zinc-600" />
        </div>

        {isCompleted && userProgress && (
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Clock className="h-3 w-3" />
              <span>{Math.floor((userProgress.timeTaken || 0) / 1000)}s</span>
            </div>
            <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-200">
              {userProgress.score || 0} pts
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemCard;
