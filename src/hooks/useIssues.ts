
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'bug' | 'feature' | 'question';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  comments?: IssueComment[];
}

export interface IssueComment {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// This simulates storage without DB calls by using localStorage
export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  // Load issues from localStorage on mount
  useEffect(() => {
    const loadIssues = () => {
      try {
        const savedIssues = localStorage.getItem('zenx_issues');
        if (savedIssues) {
          setIssues(JSON.parse(savedIssues));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load issues:', error);
        setIsLoading(false);
      }
    };

    loadIssues();
  }, []);

  // Save issues to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('zenx_issues', JSON.stringify(issues));
    }
  }, [issues, isLoading]);

  const addIssue = (title: string, description: string, type: Issue['type']) => {
    if (!userProfile) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to report an issue.",
        variant: "destructive",
      });
      return;
    }

    const newIssue: Issue = {
      id: `issue_${Date.now()}`,
      title,
      description,
      type,
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: {
        id: userProfile.userID || 'unknown',
        name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Anonymous',
        avatar: userProfile.avatarURL,
      },
      comments: [],
    };

    setIssues(prev => [newIssue, ...prev]);
    
    toast({
      title: "Issue reported",
      description: "Thank you for your feedback!",
    });
    
    return newIssue;
  };

  const addComment = (issueId: string, content: string) => {
    if (!userProfile) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to comment.",
        variant: "destructive",
      });
      return;
    }

    const newComment: IssueComment = {
      id: `comment_${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      createdBy: {
        id: userProfile.userID || 'unknown',
        name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Anonymous',
        avatar: userProfile.avatarURL,
      },
    };

    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { 
              ...issue, 
              comments: [...(issue.comments || []), newComment] 
            }
          : issue
      )
    );
    
    toast({
      description: "Comment added",
    });
    
    return newComment;
  };

  const updateIssueStatus = (issueId: string, status: Issue['status']) => {
    if (!userProfile) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to update an issue.",
        variant: "destructive",
      });
      return;
    }

    setIssues(prev => 
      prev.map(issue => 
        issue.id === issueId 
          ? { ...issue, status } 
          : issue
      )
    );
    
    toast({
      description: `Issue status updated to ${status}`,
    });
  };

  return {
    issues,
    isLoading,
    addIssue,
    addComment,
    updateIssueStatus,
  };
};
