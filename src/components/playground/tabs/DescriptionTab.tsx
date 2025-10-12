import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ProblemMetadata } from '@/api/types';

interface DescriptionTabProps {
  problem: ProblemMetadata;
}

export const DescriptionTab: React.FC<DescriptionTabProps> = ({ problem }) => {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-semibold text-green-600">{problem.title}</h2>
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

        <div className="text-sm text-zinc-300/90">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mt-6 mb-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-base font-semibold text-white mt-6 mb-3 border-b border-zinc-700 pb-1" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-sm font-medium text-white mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-zinc-300/90 mb-1 leading-tight" {...props} />,
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-outside ml-6 text-zinc-300/90 space-y-2 mb-4" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-zinc-300/90 mb-1 leading-tight" {...props} />
              ),
              strong: ({ node, ...props }) => <strong className="text-white font-medium" {...props} />,
              code: ({ node, ...props }) => (
                <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props} />
              ),
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
