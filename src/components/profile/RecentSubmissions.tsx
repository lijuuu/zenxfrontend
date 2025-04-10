import React, { useState } from 'react';
import { useRecentSubmissions } from '@/services/useGetSubmissionHistory';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Loader2, Award, Swords } from 'lucide-react';
import {
  SiJavascript,
  SiPython,
  SiGo,
  SiCplusplus,
  SiRust,
  SiPhp,
  SiRuby,
  SiSwift,
  SiC
} from 'react-icons/si';
import { Submission } from '@/api/types';

interface RecentSubmissionsProps {
  userId?: string;
}

// Updated language logo mapping using Simple Icons
const languageIcons: Record<string, JSX.Element> = {
  'javascript': <SiJavascript className="h-4 w-4 text-yellow-500" />,
  'python': <SiPython className="h-4 w-4 text-blue-500" />,
  'c': <SiC className="h-4 w-4 text-gray-600" />,
  'cpp': <SiCplusplus className="h-4 w-4 text-blue-700" />,
  'rust': <SiRust className="h-4 w-4 text-orange-600" />,
  'go': <SiGo className="h-4 w-4 text-cyan-500" />,
  'php': <SiPhp className="h-4 w-4 text-indigo-600" />,
  'ruby': <SiRuby className="h-4 w-4 text-red-700" />,
  'swift': <SiSwift className="h-4 w-4 text-orange-500" />,
};

const getStatusBadge = (status: Submission['status'], isFirst: boolean) => {
  const baseBadge = (content: JSX.Element, className: string) => (
    <Badge className={`flex items-center gap-1 ${className}`}>
      {content}
      {isFirst && status === "SUCCESS" && (
        <Award className="h-3 w-3 text-yellow-200 dark:text-yellow-400" />
      )}
    </Badge>
  );

  switch (status) {
    case 'SUCCESS':
      return baseBadge(
        <><Check className="h-3 w-3" /> Success</>,
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      );
    case 'FAILED':
      return baseBadge(
        <><X className="h-3 w-3" /> Failed</>,
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      );
    case 'PROCESSING':
      return baseBadge(
        <><Loader2 className="h-3 w-3 animate-spin" /> Processing</>,
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      );
    case 'PENDING':
      return baseBadge(
        <><Clock className="h-3 w-3" /> Pending</>,
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getDifficultyBadge = (difficulty: Submission['difficulty']) => {
  const difficultyMap: Record<Submission['difficulty'], { text: string; className: string }> = {
    'E': { text: 'Easy', className: 'text-green-600 dark:text-green-400 border-green-200' },
    'M': { text: 'Medium', className: 'text-amber-600 dark:text-amber-400 border-amber-200' },
    'H': { text: 'Hard', className: 'text-red-600 dark:text-red-400 border-red-200' },
  };

  const config = difficultyMap[difficulty];
  return config ? (
    <Badge variant="outline" className={config.className}>
      {config.text}
    </Badge>
  ) : null;
};

const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({ userId }) => {
  const [page, setPage] = useState(1); 

  const { data: submissions = [], isLoading, error } = useRecentSubmissions({
    userId,
    limit: 50, 
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="border border-border/50 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-between items-center">
              <div className="w-40 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !submissions.length) {
    return (
      <div className="text-center py-8 border border-dashed rounded-lg">
        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium">No Submissions Yet</h3>
        <p className="text-muted-foreground mt-1">Battle some problems to see your history!</p>
      </div>
    );
  }

  // Reverse submissions to show most recent first
  const reversedSubmissions = [...submissions].reverse();

  // Pagination logic
  const pageSize = 5;
  const totalPages = Math.ceil(reversedSubmissions.length / pageSize);
  const paginatedSubmissions = reversedSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div className="space-y-4">
      {paginatedSubmissions.map((submission) => (
        <div
          key={submission.id}
          className={`border border-border/50 rounded-lg p-4 transition-all duration-200 hover:shadow-sm ${submission.status === 'SUCCESS' && submission.isFirst
              ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/50'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
        >
          <div className="flex justify-between items-center">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {submission.title}
            </div>
            {getStatusBadge(submission.status, submission.isFirst)}
          </div>

          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                {languageIcons[submission.language.toLowerCase()] || (
                  <SiC className="h-4 w-4 text-gray-500" />
                )}
                <span>{capitalizeFirstLetter(submission.language)}</span>
              </Badge>
              {getDifficultyBadge(submission.difficulty)}
              {submission.score > 0 && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400"
                >
                  <Swords className="h-3 w-3" />
                  <span>+{submission.score} XP</span>
                </Badge>
              )}
            </div>
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
              {new Date(submission.submittedAt).toLocaleString(undefined, {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </span>
          </div>
        </div> 
      ))}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={isFirstPage}
          className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${!isFirstPage ? 'hover:bg-gray-300 dark:hover:bg-gray-600' : ''}`}
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={isLastPage}
          className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${!isLastPage ? 'hover:bg-gray-300 dark:hover:bg-gray-600' : ''}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const capitalizeFirstLetter = (text: string) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export default RecentSubmissions;