
import React from 'react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import { Problem } from '../types';
import { getDifficultyColor } from '../utils/colorUtils';

interface ProblemDescriptionProps {
  problem: Problem;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  return (
    <div className="overflow-y-auto h-full p-4 bg-zinc-900/30 border-b border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-green-500">
            {problem.title}
          </h2>
          <Badge className={`${getDifficultyColor(problem.difficulty)} text-white`}>
            {problem.difficulty}
          </Badge>
        </div>
        
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>
            {problem.description}
          </ReactMarkdown>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Examples</h3>
          {problem.examples.map((example, i) => (
            <div key={i} className="mb-4 bg-zinc-800/50 p-3 rounded-md border border-zinc-700/50">
              <div className="mb-1">
                <span className="text-zinc-400 text-sm">Input:</span>
                <pre className="bg-zinc-900/70 p-2 rounded mt-1 text-green-500 text-sm overflow-x-auto">
                  {example.input}
                </pre>
              </div>
              <div className="mb-1">
                <span className="text-zinc-400 text-sm">Output:</span>
                <pre className="bg-zinc-900/70 p-2 rounded mt-1 text-green-500 text-sm overflow-x-auto">
                  {example.output}
                </pre>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-zinc-400 text-sm">Explanation:</span>
                  <p className="text-zinc-300 text-sm mt-1">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Constraints</h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-300">
            {problem.constraints.map((constraint, i) => (
              <li key={i}>{constraint}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
