import React from 'react';
import { CodeAnalysis } from '@/services/geminiService';

interface ComplexityGraphProps {
  analysis: CodeAnalysis;
}

export const ComplexityGraph: React.FC<ComplexityGraphProps> = ({ analysis }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'low':
        return 'text-green-400 bg-green-900/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'high':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-zinc-400 bg-zinc-900/20';
    }
  };

  const getComplexityScore = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0;
    }
  };

  const complexityScore = getComplexityScore(analysis.complexity.overallComplexity);
  const maxScore = 3;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Complexity Analysis</h3>

      {/*overall complexity indicator*/}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-zinc-300 font-medium">Overall Complexity</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(analysis.complexity.overallComplexity)}`}>
            {analysis.complexity.overallComplexity}
          </span>
        </div>

        {/*complexity bar*/}
        <div className="w-full bg-zinc-800 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${complexityScore === 1 ? 'bg-green-500' :
                complexityScore === 2 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            style={{ width: `${(complexityScore / maxScore) * 100}%` }}
          />
        </div>

        <p className="text-zinc-400 text-sm">{analysis.complexity.explanation}</p>
      </div>

      {/*time and space complexity*/}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
          <h4 className="text-zinc-300 font-medium mb-2">Time Complexity</h4>
          <div className="text-green-400 font-mono text-lg">{analysis.complexity.timeComplexity}</div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
          <h4 className="text-zinc-300 font-medium mb-2">Space Complexity</h4>
          <div className="text-blue-400 font-mono text-lg">{analysis.complexity.spaceComplexity}</div>
        </div>
      </div>

      {/*issues summary*/}
      {analysis.issues.length > 0 && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
          <h4 className="text-zinc-300 font-medium mb-3">Issues Found</h4>
          <div className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded bg-zinc-800/50">
                <div className={`w-2 h-2 rounded-full mt-2 ${issue.type === 'error' ? 'bg-red-500' :
                    issue.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`} />
                <div className="flex-1">
                  <div className="text-zinc-300 text-sm">{issue.message}</div>
                  {issue.suggestion && (
                    <div className="text-zinc-400 text-xs mt-1">💡 {issue.suggestion}</div>
                  )}
                  {issue.line && (
                    <div className="text-zinc-500 text-xs mt-1">Line {issue.line}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/*improvements summary*/}
      {analysis.improvements.length > 0 && (
        <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
          <h4 className="text-zinc-300 font-medium mb-3">Suggested Improvements</h4>
          <div className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <div key={index} className="p-2 rounded bg-zinc-800/50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-zinc-300 text-sm">{improvement.description}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${improvement.impact === 'High' ? 'bg-red-900/20 text-red-400' :
                      improvement.impact === 'Medium' ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-green-900/20 text-green-400'
                    }`}>
                    {improvement.impact} Impact
                  </span>
                </div>
                {improvement.code && (
                  <pre className="text-xs text-green-400 mt-2 bg-zinc-900/50 p-2 rounded overflow-x-auto">
                    {improvement.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/*summary*/}
      <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-md p-4">
        <h4 className="text-zinc-300 font-medium mb-2">Summary</h4>
        <p className="text-zinc-400 text-sm">{analysis.summary}</p>
      </div>
    </div>
  );
};
