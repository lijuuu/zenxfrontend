
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Submission } from "@/api/types";

interface SubmissionHistoryProps {
  submissions?: Submission[];
  isLoading?: boolean;
  limit?: number;
}

const SubmissionHistory = ({ submissions, isLoading = false, limit }: SubmissionHistoryProps) => {
  const displaySubmissions = limit && submissions ? submissions.slice(0, limit) : submissions;
  
  if (isLoading) {
    return (
      <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4z">Recent Submissions</h2>
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-zinc-700/30 h-16 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );    
  }
  
  if (!displaySubmissions || displaySubmissions.length === 0) {
    return (
      <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6 text-center">
        <h2 className="text-lg font-medium mb-4">Recent Submissions</h2>
        <p className="text-zinc-400 py-10">No submissions found</p>
        <Button className="bg-green-500 hover:bg-green-600">Solve Problems</Button>
      </div>
    );
  }
  
  return (
    <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Recent Submissions</h2>
      <div className="space-y-3">
        {displaySubmissions.map((submission) => (
          <div 
            key={submission.id} 
            className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg p-4 hover:bg-zinc-800/80 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {submission.status === "SUCCESS" ? (
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                ) : submission.status === "PROCESSING" ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium group-hover:text-green-400 transition-colors">
                    {submission.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span className="text-zinc-400">
                      {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                    </span>
                    <div 
                      className={`px-2 py-0.5 rounded-full ${
                        submission.difficulty === "E" 
                          ? "bg-green-500/20 text-green-400" 
                          : submission.difficulty === "M"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {submission.difficulty === "E" ? "Easy" : 
                        submission.difficulty === "M" ? "Medium" : "Hard"}
                    </div>
                    <div className="px-2 py-0.5 bg-zinc-700/50 rounded-full">
                      {submission.language}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className={`text-sm font-medium ${
                  submission.status === "SUCCESS" 
                    ? "text-green-400" 
                    : submission.status === "PROCESSING"
                      ? "text-blue-400"
                      : "text-red-400"
                }`}>
                  {submission.status}
                </div>
                
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2 hover:bg-zinc-700/50">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Code
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {limit && submissions && submissions.length > limit && (
          <div className="text-center mt-4">
            <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              View All Submissions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;
