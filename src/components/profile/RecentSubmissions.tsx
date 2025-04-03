
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserSubmissions } from '@/api/submissionApi';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface RecentSubmissionsProps {
  userId?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Accepted':
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/50">
          <Check className="h-3 w-3 mr-1" /> Accepted
        </Badge>
      );
    case 'Wrong Answer':
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/50">
          <X className="h-3 w-3 mr-1" /> Wrong
        </Badge>
      );
    case 'Time Limit Exceeded':
      return (
        <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/50">
          <Clock className="h-3 w-3 mr-1" /> TLE
        </Badge>
      );
    case 'Runtime Error':
    case 'Compilation Error':
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/50">
          <AlertTriangle className="h-3 w-3 mr-1" /> Error
        </Badge>
      );
    case 'Processing':
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/50">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

const getDifficultyBadge = (difficulty?: string) => {
  if (!difficulty) return null;
  
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return (
        <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/50">
          Easy
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50">
          Medium
        </Badge>
      );
    case 'hard':
      return (
        <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50">
          Hard
        </Badge>
      );
    default:
      return null;
  }
};

const RecentSubmissions: React.FC<RecentSubmissionsProps> = ({ userId }) => {
  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ['submissions', userId],
    queryFn: () => getUserSubmissions(userId || 'current'),
    enabled: !!userId,
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="border border-border/50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div className="w-40 h-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-20 h-5 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="w-32 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
              <div className="w-24 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error || !submissions || submissions.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
        <h3 className="text-lg font-medium">No Submissions Yet</h3>
        <p className="text-muted-foreground mt-1">
          Start solving problems to see your submissions here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {submissions.slice(0, 5).map((submission) => (
        <div key={submission.id} className="border border-border/50 rounded-lg p-4 hover:bg-accent/5 transition-colors">
          <div className="flex justify-between items-center">
            <div className="font-medium">{submission.problemTitle}</div>
            {getStatusBadge(submission.status)}
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{submission.language}</span>
              {getDifficultyBadge(submission.difficulty || submission.problem?.difficulty)}
            </div>
            
            <div className="flex items-center gap-2">
              {submission.runtime && <span>Runtime: {submission.runtime}</span>}
              {submission.memory && <span>Memory: {submission.memory}</span>}
              <span>
                {new Date(submission.timestamp || submission.submittedAt || '').toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSubmissions;
