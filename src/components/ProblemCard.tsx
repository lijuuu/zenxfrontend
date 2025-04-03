
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface ProblemCardProps {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  solved?: boolean;
}

const ProblemCard = ({ id, title, difficulty, tags, solved }: ProblemCardProps) => {
  // Define difficulty class mappings
  const difficultyClasses = {
    Easy: "bg-green-500 text-white dark:bg-green-600",
    Medium: "bg-amber-500 text-white dark:bg-amber-600",
    Hard: "bg-red-500 text-white dark:bg-red-600"
  };

  return (
    <Link to={`/problems/${id}`}>
      <div className={cn(
        "problem-card relative h-full group",
        "hover:border-zinc-300 dark:hover:border-zinc-700 transition-all",
        solved && "border-green-200 dark:border-green-900/50"
      )}>
        {solved && (
          <div className="absolute top-4 right-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
        )}
        
        <div className={cn(
          "inline-block text-xs font-medium px-3 py-1.5 rounded-full",
          difficultyClasses[difficulty]
        )}>
          {difficulty}
        </div>
        
        <h3 className="text-xl font-bold mt-3 mb-4 group-hover:text-zenblue transition-colors">
          {title}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="tag-pill">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ProblemCard;
