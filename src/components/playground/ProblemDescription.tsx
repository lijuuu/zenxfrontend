import { useNavigate } from "react-router";
import ReactMarkdown from 'react-markdown';
import { ProblemMetadata } from '@/api/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';


interface ProblemDescriptionProps {
  problem: ProblemMetadata;
  hideBackButton?: boolean

}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem, hideBackButton }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 overflow-y-auto h-full bg-zinc-900/70 border-r border-zinc-800 relative"
    // initial={{ opacity: 0, x: -20 }}
    // animate={{ opacity: 1, x: 0 }}
    // transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="space-y-4 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-semibold text-green-500">{problem.title}</h2>
          <div className={`text-xs px-2.5 py-1 rounded-full text-white inline-flex items-center w-fit ${problem.difficulty === "Easy" ? "bg-green-600" :
            problem.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"
            }`}>
            {problem.difficulty}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {problem.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-zinc-300/90 pt-2">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-green-500 mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-md font-semibold text-white mt-4 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm font-medium text-white mt-3 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-zinc-300/90 mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 text-green-500 space-y-1 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-zinc-300/90" {...props} />,
              code: ({ node, ...props }) => <code className="text-green-500 rounded-md my-2" {...props} />,
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
      </div>

      {!hideBackButton && <Button
        variant="outline"
        size="sm"
        onClick={() => navigate("/problems")}
        className="absolute bottom-4 left-4 right-4 w-[calc(100%-2rem)] bg-zinc-800 text-green-500 hover:bg-zinc-700 hover:text-green-400 border-zinc-700"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problems
      </Button>}
    </div>
  );
};