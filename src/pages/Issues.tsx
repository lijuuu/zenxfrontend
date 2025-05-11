
import React, { useState } from 'react';
import MainNavbar from '@/components/common/MainNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue, useIssues } from '@/hooks/useIssues';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bug, HelpCircle, Lightbulb, MessageSquare, FileText, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

// Form schema for creating a new issue
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(['bug', 'feature', 'question'], { 
    required_error: "Please select an issue type" 
  }),
});

// Form schema for adding a comment
const commentSchema = z.object({
  content: z.string().min(1, { message: "Comment cannot be empty" }),
});

const IssuesPage: React.FC = () => {
  const { issues, isLoading, addIssue, addComment, updateIssueStatus } = useIssues();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Form for creating a new issue
  const issueForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'bug',
    },
  });

  // Form for adding a comment
  const commentForm = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  // Handle form submission for creating a new issue
  const onSubmitIssue = (values: z.infer<typeof formSchema>) => {
    addIssue(values.title, values.description, values.type);
    issueForm.reset();
    setIsNewIssueOpen(false);
  };

  // Handle form submission for adding a comment
  const onSubmitComment = (values: z.infer<typeof commentSchema>) => {
    if (activeIssue) {
      addComment(activeIssue.id, values.content);
      commentForm.reset();
      setIsCommentDialogOpen(false);
    }
  };

  // Filter issues based on active filter
  const filteredIssues = issues.filter(issue => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return issue.status === 'open';
    if (activeFilter === 'in-progress') return issue.status === 'in-progress';
    if (activeFilter === 'resolved') return issue.status === 'resolved';
    if (activeFilter === 'closed') return issue.status === 'closed';
    if (activeFilter === 'bugs') return issue.type === 'bug';
    if (activeFilter === 'features') return issue.type === 'feature';
    if (activeFilter === 'questions') return issue.type === 'question';
    return true;
  });

  // Get icon for issue type
  const getIssueTypeIcon = (type: Issue['type']) => {
    switch (type) {
      case 'bug':
        return <Bug className="h-4 w-4 text-red-500" />;
      case 'feature':
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'question':
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get badge style for issue status
  const getStatusBadgeStyle = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case 'in-progress':
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case 'resolved':
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case 'closed':
        return "bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20";
    }
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/issues' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <MainNavbar />

      <main className="page-container py-8 pt-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Issues & Feedback</h1>
            <p className="text-zinc-400 mt-1">
              Report bugs, request features, or ask questions about the platform
            </p>
          </div>

          <Dialog open={isNewIssueOpen} onOpenChange={setIsNewIssueOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                Report an Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <DialogTitle className="text-xl">Report an Issue</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Please provide details about the issue you're experiencing.
                </DialogDescription>
              </DialogHeader>
              <Form {...issueForm}>
                <form onSubmit={issueForm.handleSubmit(onSubmitIssue)} className="space-y-4">
                  <FormField
                    control={issueForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief summary of the issue" 
                            {...field} 
                            className="bg-zinc-800 border-zinc-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={issueForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-zinc-800 border-zinc-700">
                              <SelectValue placeholder="Select issue type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="bug">Bug Report</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="question">Question</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-zinc-500">
                          Select the category that best describes your issue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={issueForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Detailed description of the issue or request"
                            className="min-h-[120px] bg-zinc-800 border-zinc-700"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-zinc-500">
                          Please include steps to reproduce if reporting a bug
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Submit Issue</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-zinc-800/50">
              <TabsTrigger value="all" onClick={() => setActiveFilter('all')}>All</TabsTrigger>
              <TabsTrigger value="bugs" onClick={() => setActiveFilter('bugs')}>Bugs</TabsTrigger>
              <TabsTrigger value="features" onClick={() => setActiveFilter('features')}>Features</TabsTrigger>
              <TabsTrigger value="questions" onClick={() => setActiveFilter('questions')}>Questions</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <Select onValueChange={setActiveFilter} defaultValue="all">
                <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredIssues.length === 0 ? (
              <Card className="bg-zinc-800/40 border border-zinc-700/40 overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-16 w-16 text-zinc-500 mb-4" />
                  <CardTitle className="text-xl mb-2">No issues found</CardTitle>
                  <CardDescription className="text-center max-w-md mb-6">
                    {activeFilter === 'all' 
                      ? "There are no issues reported yet. Be the first to report an issue!"
                      : "No issues match the current filter."}
                  </CardDescription>
                  <Dialog open={isNewIssueOpen} onOpenChange={setIsNewIssueOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-500 hover:bg-green-600">
                        Report an Issue
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredIssues.map((issue) => (
                  <Card key={issue.id} className="bg-zinc-800/40 border border-zinc-700/40 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {getIssueTypeIcon(issue.type)}
                          <Badge className={`${getStatusBadgeStyle(issue.status)}`}>
                            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-zinc-400">
                          {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <CardTitle className="text-xl mt-2">{issue.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="text-zinc-300 whitespace-pre-line">
                        {issue.description}
                      </div>
                      
                      <div className="flex items-center mt-4">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={issue.createdBy.avatar} />
                          <AvatarFallback>
                            {issue.createdBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-zinc-400">
                          Reported by {issue.createdBy.name}
                        </span>
                      </div>

                      {issue.comments && issue.comments.length > 0 && (
                        <div className="mt-4">
                          <Separator className="my-4 bg-zinc-700/50" />
                          <div className="text-sm text-zinc-400 flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            {issue.comments.length} {issue.comments.length === 1 ? 'comment' : 'comments'}
                          </div>
                          <div className="space-y-3 mt-3">
                            {issue.comments.slice(0, 1).map((comment) => (
                              <div key={comment.id} className="bg-zinc-800/70 rounded-md p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="h-5 w-5">
                                    <AvatarImage src={comment.createdBy.avatar} />
                                    <AvatarFallback>
                                      {comment.createdBy.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">
                                    {comment.createdBy.name}
                                  </span>
                                  <span className="text-xs text-zinc-500">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                  </span>
                                </div>
                                <p className="text-zinc-300 text-sm">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                            {issue.comments.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-zinc-400 hover:text-white w-full justify-center"
                                onClick={() => setActiveIssue(issue)}
                              >
                                View all {issue.comments.length} comments
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between pt-1">
                      <Dialog open={isCommentDialogOpen && activeIssue?.id === issue.id} onOpenChange={(open) => {
                        setIsCommentDialogOpen(open);
                        if (open) setActiveIssue(issue);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Comment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-zinc-800">
                          <DialogHeader>
                            <DialogTitle>Add Comment</DialogTitle>
                          </DialogHeader>
                          <Form {...commentForm}>
                            <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="space-y-4">
                              <FormField
                                control={commentForm.control}
                                name="content"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Textarea
                                        placeholder="Type your comment here..."
                                        className="min-h-[100px] bg-zinc-800 border-zinc-700"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <DialogFooter>
                                <Button type="submit">Add Comment</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>

                      {issue.status !== 'resolved' && issue.status !== 'closed' && (
                        <Select onValueChange={(value) => updateIssueStatus(issue.id, value as Issue['status'])} defaultValue={issue.status}>
                          <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700">
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bugs">
            {/* The tab content will be filtered by the activeFilter state */}
          </TabsContent>
          
          <TabsContent value="features">
            {/* The tab content will be filtered by the activeFilter state */}
          </TabsContent>
          
          <TabsContent value="questions">
            {/* The tab content will be filtered by the activeFilter state */}
          </TabsContent>
        </Tabs>

        {/* Issue Detail Dialog */}
        <Dialog open={!!activeIssue && !isCommentDialogOpen} onOpenChange={(open) => !open && setActiveIssue(null)}>
          {activeIssue && (
            <DialogContent className="sm:max-w-[700px] bg-zinc-900 border-zinc-800">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  {getIssueTypeIcon(activeIssue.type)}
                  <Badge className={`${getStatusBadgeStyle(activeIssue.status)}`}>
                    {activeIssue.status.charAt(0).toUpperCase() + activeIssue.status.slice(1)}
                  </Badge>
                </div>
                <DialogTitle className="text-xl">{activeIssue.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-zinc-400">
                  <span>Reported {formatDistanceToNow(new Date(activeIssue.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage src={activeIssue.createdBy.avatar} />
                      <AvatarFallback>
                        {activeIssue.createdBy.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {activeIssue.createdBy.name}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="text-zinc-200 whitespace-pre-line mb-6">
                {activeIssue.description}
              </div>
              
              <Separator className="my-4 bg-zinc-700/50" />
              
              <div className="text-sm font-medium flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4" />
                {activeIssue.comments?.length || 0} {(activeIssue.comments?.length || 0) === 1 ? 'Comment' : 'Comments'}
              </div>
              
              {activeIssue.comments && activeIssue.comments.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {activeIssue.comments.map((comment) => (
                    <div key={comment.id} className="bg-zinc-800/70 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={comment.createdBy.avatar} />
                          <AvatarFallback>
                            {comment.createdBy.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {comment.createdBy.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-zinc-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-zinc-400">
                  No comments yet. Be the first to comment!
                </div>
              )}
              
              <Separator className="my-4 bg-zinc-700/50" />
              
              <div className="flex justify-between items-center">
                <Dialog open={isCommentDialogOpen && activeIssue?.id === activeIssue.id} onOpenChange={(open) => {
                  setIsCommentDialogOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                {activeIssue.status !== 'resolved' && activeIssue.status !== 'closed' && (
                  <Select onValueChange={(value) => updateIssueStatus(activeIssue.id, value as Issue['status'])} defaultValue={activeIssue.status}>
                    <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
};

export default IssuesPage;
