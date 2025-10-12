import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Award, Swords, Eye, X, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Submission } from '@/api/types';
import {
  SiJavascript,
  SiPython,
  SiGo,
  SiCplusplus,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiC,
} from 'react-icons/si';

interface SubmissionHistoryTabProps {
  submissions: Submission[];
  isLoading: boolean;
  problemId: string;
}

//language logo mapping using simple icons
const languageIcons: Record<string, JSX.Element> = {
  javascript: <SiJavascript className="h-4 w-4 text-yellow-500" />,
  python: <SiPython className="h-4 w-4 text-blue-500" />,
  c: <SiC className="h-4 w-4 text-gray-600" />,
  cpp: <SiCplusplus className="h-4 w-4 text-blue-700" />,
  rust: <SiRust className="h-4 w-4 text-orange-600" />,
  go: <SiGo className="h-4 w-4 text-cyan-500" />,
  php: <SiPhp className="h-4 w-4 text-indigo-600" />,
  ruby: <SiRuby className="h-4 w-4 text-red-700" />,
  swift: <SiSwift className="h-4 w-4 text-orange-500" />,
};

const getStatusBadge = (status: Submission['status'], isFirst: boolean) => {
  const baseBadge = (content: JSX.Element, className: string) => (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {content}
      {isFirst && status === "SUCCESS" && (
        <Award className="h-3 w-3 text-yellow-200" />
      )}
    </span>
  );

  switch (status) {
    case 'SUCCESS':
      return baseBadge(
        <><CheckCircle className="h-3 w-3" /> Success</>,
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      );
    case 'FAILED':
      return baseBadge(
        <><XCircle className="h-3 w-3" /> Failed</>,
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      );
    case 'PROCESSING':
      return baseBadge(
        <><Clock className="h-3 w-3" /> Processing</>,
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      );
    case 'PENDING':
      return baseBadge(
        <><Clock className="h-3 w-3" /> Pending</>,
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      );
    default:
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">{status}</span>;
  }
};

export const SubmissionHistoryTab: React.FC<SubmissionHistoryTabProps> = ({
  submissions,
  isLoading,
  problemId
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [copied, setCopied] = useState(false);

  //filter submissions for current problem and reverse order most recent first
  const problemSubmissions = submissions
    .filter(sub => sub.problemId === problemId)
    .reverse();

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
  };

  const handleCloseDetails = () => {
    setSelectedSubmission(null);
  };

  const handleCopyCode = async () => {
    if (selectedSubmission?.userCode) {
      try {
        await navigator.clipboard.writeText(selectedSubmission.userCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-zinc-500">Loading submission history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problemSubmissions.length) {
    return (
      <div className="h-full overflow-y-auto p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-semibold text-zinc-300">No Submissions Yet</h3>
            <p className="text-zinc-500">Submit your solution to see your submission history</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Your Submissions</h3>
        {problemSubmissions.map((submission) => (
          <div
            key={submission.id}
            className={`border border-zinc-800/80 rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${submission.status === 'SUCCESS' && submission.isFirst
              ? 'bg-green-900/10 border-green-800/50'
              : 'hover:bg-zinc-800/50'
              }`}
          >
            <div className="flex justify-between items-center">
              <div className="font-medium text-zinc-200">
                {submission.title}
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(submission.status, submission.isFirst)}
                <Button
                  onClick={() => handleViewDetails(submission)}
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                  {languageIcons[submission.language.toLowerCase()] || (
                    <SiC className="h-4 w-4 text-gray-500" />
                  )}
                  <span>{submission.language.charAt(0).toUpperCase() + submission.language.slice(1)}</span>
                </span>
                {submission.score > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-900/20 text-purple-400 border border-purple-800/50">
                    <Swords className="h-3 w-3" />
                    <span>+{submission.score} XP</span>
                  </span>
                )}
              </div>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded">
                {new Date(submission.submittedAt).toLocaleString(undefined, {
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedSubmission.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(selectedSubmission.status, selectedSubmission.isFirst)}
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                    {languageIcons[selectedSubmission.language.toLowerCase()] || (
                      <SiC className="h-4 w-4 text-gray-500" />
                    )}
                    <span>{selectedSubmission.language.charAt(0).toUpperCase() + selectedSubmission.language.slice(1)}</span>
                  </span>
                  {selectedSubmission.score > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-900/20 text-purple-400 border border-purple-800/50">
                      <Swords className="h-3 w-3" />
                      <span>+{selectedSubmission.score} XP</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyCode}
                  size="sm"
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                >
                  {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
                <Button
                  onClick={handleCloseDetails}
                  size="sm"
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Submission Info */}
              <div className="p-6 border-b border-zinc-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Submitted:</span>
                    <span className="text-zinc-300 ml-2">
                      {new Date(selectedSubmission.submittedAt).toLocaleString(undefined, {
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Difficulty:</span>
                    <span className="text-zinc-300 ml-2">
                      {selectedSubmission.difficulty === 'E' ? 'Easy' :
                        selectedSubmission.difficulty === 'M' ? 'Medium' : 'Hard'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Status:</span>
                    <span className="text-zinc-300 ml-2">{selectedSubmission.status}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">First Solution:</span>
                    <span className="text-zinc-300 ml-2">
                      {selectedSubmission.isFirst ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Code Display */}
              <div className="flex-1 p-6 overflow-hidden">
                <h4 className="text-sm font-medium text-zinc-400 mb-3">Code Solution</h4>
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg h-full overflow-auto">
                  <pre className="p-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono">
                    <code>{selectedSubmission.userCode}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
