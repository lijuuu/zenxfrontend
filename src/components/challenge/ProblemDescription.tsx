
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProblemMetadata } from '@/types/challengeTypes';

interface ProblemDescriptionProps {
  problem: ProblemMetadata;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 overflow-y-auto h-full border-r border-border relative"
    >
      <div className="space-y-4 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-semibold text-primary">{problem.title}</h2>
          <div className={`text-xs px-2.5 py-1 rounded-full text-primary-foreground inline-flex items-center w-fit ${
            problem.difficulty === "Easy" ? "bg-green-600" :
            problem.difficulty === "Medium" ? "bg-yellow-600" : "bg-red-600"
          }`}>
            {problem.difficulty}
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {problem.tags.map((tag: string, i: number) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50">
              {tag}
            </span>
          ))}
        </div>

        <div className="text-sm text-foreground/90 pt-2">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-primary mt-4 mb-2" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-md font-semibold text-foreground mt-4 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm font-medium text-foreground mt-3 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-foreground/90 mb-2" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 text-primary space-y-1 mb-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-foreground/90" {...props} />,
              code: ({ node, ...props }) => <code className="text-primary rounded-md my-2" {...props} />,
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
