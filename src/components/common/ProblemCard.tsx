import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CheckCircle, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  solved: boolean;
  onClick: () => void;
}

const mapDifficulty = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    "1": "Easy",
    "2": "Medium",
    "3": "Hard",
    "E": "Easy",
    "M": "Medium",
    "H": "Hard",
  };
  return difficultyMap[difficulty] || difficulty;
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "E":
    case "Easy":
      return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    case "M":
    case "Medium":
      return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
    case "H":
    case "Hard":
      return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20";
  }
};

const ProblemCard: React.FC<ProblemCardProps> = ({ id, title, difficulty, tags, solved, onClick }) => {

  return (
      <Card
        className={cn(
          "bg-zinc-800/40 border border-zinc-700/40 hover:border-green-500/50 transition-colors cursor-pointer relative h-full group",
          solved && "border-green-200 dark:border-green-900/50"
        )}
        onClick={onClick}
      >
        {solved && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge className={cn(getDifficultyColor(difficulty))}>{mapDifficulty(difficulty)}</Badge>
          </div>
          <CardTitle className="text-lg mt-2 text-white  transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge
                variant="outline"
                className="bg-zinc-800/60 text-zinc-300 border-zinc-700 text-xs"
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
  );
};

export default ProblemCard;