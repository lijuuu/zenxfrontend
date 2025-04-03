
import React, { useState, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, CheckCheck, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ReactMarkdown from 'react-markdown';

interface OutputProps {
  className?: string;
}

function Output({ className }: OutputProps) {
  const { loading, result } = useSelector((state: RootState) => state.xCodeCompiler);
  const { code, language } = useSelector((state: RootState) => state.xCodeCompiler);
  const [copied, setCopied] = useState(false);
  const [isErrorExpanded, setIsErrorExpanded] = useState(false);
  const [hints, setHints] = useState<string | null>("");
  const [loadingHints, setLoadingHints] = useState(false);
  const [isHintsModalOpen, setIsHintsModalOpen] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    
    const textToCopy = result.output || result.status_message || result.error || '';
    
    try {
      await navigator.clipboard.writeText(String(textToCopy));
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const fetchHints = async () => {
    setLoadingHints(true);
    try {
      const errorContext = result?.error || result?.status_message || '';
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyATP4kvlgboNEPOz60PtvgeqrLurYO6AoM',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `As a coding assistant, provide 3 concise hints to improve or fix this ${language} code:
                    \`\`\`${language}
                    ${code}
                    \`\`\`
                    ${errorContext ? `The code has the following error: ${errorContext}` : ''}
                    Provide logical answers and exact code to fix or replace within a few lines. Format in markdown with code blocks within 2500 tokens`,
                  },
                ],
              },
            ],
            generationConfig: { temperature: 0.4, maxOutputTokens: 5000 },
            safetySettings: [],
          }),
        }
      );

      const data = await response.json();
      setHints(
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Could not generate hints at this time. Please try again later.'
      );
    } catch (error) {
      setHints('Error fetching hints. Please check your API key and try again.');
      console.error('Error fetching hints:', error);
    } finally {
      setLoadingHints(false);
    }
  };

  const handleShowHints = () => {
    if (!hints) fetchHints();
    setIsHintsModalOpen(true);
  };

  const handleRefreshHints = () => {
    setHints(null);
    fetchHints();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isHintsModalOpen) setIsHintsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHintsModalOpen]);

  // Fixed version of isLongContent function with proper type handling
  const isLongContent = (text: string | undefined): boolean => {
    // If text is null, undefined, or empty, it's not "long"
    if (!text) return false;
    
    // Safely convert to string before using split
    const textStr = String(text);
    return textStr.split('\n').length > 5;
  };

  // Helper function to safely format execution time with type handling
  const formatExecutionTime = (time: string | number | undefined) => {
    if (typeof time === 'string') {
      return time.split('.')[0];
    } else if (typeof time === 'number') {
      return String(time).split('.')[0];
    }
    return time;
  };

  return (
    <div className={cn('h-full bg-background', className)}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 p-2 bg-muted/20 rounded-md border border-border/50">
          <h2 className="text-base font-semibold text-foreground">output</h2>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  onClick={handleShowHints}
                  disabled={loadingHints || !code}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm border flex items-center gap-1 transition-colors',
                    loadingHints
                      ? 'bg-yellow-200/10 text-yellow-600/50 border-yellow-600/10'
                      : 'bg-blue-500/20 text-blue-600 border-blue-600/20 hover:bg-blue-500/30'
                  )}
                  title="get code suggestions"
                >
                  {loadingHints ? 'loading...' : 'suggest hints'}
                </button>
              </SheetTrigger>
              <SheetContent className="w-[90vw] sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <span>code hints</span>
                    <button
                      onClick={handleRefreshHints}
                      disabled={loadingHints}
                      className="p-2 hover:bg-blue-500/20 rounded-md transition-colors"
                      title="Refresh Hints"
                    >
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    </button>
                  </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)]">
                  {loadingHints ? (
                    <div className="space-y-2 p-4">
                      <Skeleton className="w-full h-4 rounded-full bg-blue-200/30 animate-pulse" />
                      <Skeleton className="w-3/4 h-4 rounded-full bg-blue-200/30 animate-pulse" />
                      <Skeleton className="w-1/2 h-4 rounded-full bg-blue-200/30 animate-pulse" />
                    </div>
                  ) : (
                    <motion.div
                      key={hints}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm p-4"
                    >
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            // Fix: Use type assertion for props to access inline property safely
                            const isInline = !match && ((props as any).inline === true || !(className?.includes('language-')));

                            return (
                              <code
                                className={cn(
                                  isInline ? 'bg-muted/30 px-1 py-0.5 rounded' : 'block bg-muted/30 p-2 rounded-md overflow-x-auto my-2',
                                  'text-blue-400',
                                  className
                                )}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                          },
                          pre({ children, ...props }) {
                            return (
                              <pre
                                className="bg-blue-500/10 p-2 rounded-md overflow-x-auto my-2"
                                {...props}
                              >
                                {children}
                              </pre>
                            );
                          },
                        }}
                      >
                        {hints || ''}
                      </ReactMarkdown>
                    </motion.div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {result && (result.output || result.status_message || result.error) && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-muted/30 rounded-md transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <CheckCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            {result && result.execution_time && (
              <div className="bg-green-200/20 text-green-600 px-3 py-1 rounded-md text-sm border border-green-600/20">
                Time: {formatExecutionTime(result.execution_time)} ms
              </div>
            )}
            <div className="flex justify-center items-center">
              {result && result.success === true ? (
                <span className="bg-green-500/20 text-green-600 px-3 py-1 rounded-md text-sm border border-green-600/20">
                  Success
                </span>
              ) : result && result.success === false && (result.status_message || result.error) ? (
                <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-md text-sm border border-red-600/20">
                  Error
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-muted/20 rounded-md border border-border/50">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <Skeleton className="w-3/4 h-4 rounded-full bg-muted animate-pulse" />
                <Skeleton className="w-1/2 h-4 rounded-full bg-muted animate-pulse" />
                <Skeleton className="w-2/3 h-4 rounded-full bg-muted animate-pulse" />
              </motion.div>
            ) : result && result.success === true ? (
              result.output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono whitespace-pre-line"
                >
                  {result.output}
                </motion.div>
              ) : (
                <motion.div
                  key="no-output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center items-center h-full text-muted-foreground"
                >
                  <p>No output available.</p>
                </motion.div>
              )
            ) : result && result.success === false && (result.status_message || result.error) ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono"
              >
                <div className="space-y-2">
                  {result.status_message && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-semibold">Status:</span>
                        {isLongContent(result.status_message) && (
                          <button
                            onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {isErrorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {(isErrorExpanded || !isLongContent(result.status_message)) && (
                        <div className="pl-4 whitespace-pre-line">{result.status_message}</div>
                      )}
                    </div>
                  )}
                  {result.error && (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-semibold">Error:</span>
                        {isLongContent(result.error) && (
                          <button
                            onClick={() => setIsErrorExpanded(!isErrorExpanded)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {isErrorExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                      {(isErrorExpanded || !isLongContent(result.error)) && (
                        <div className="pl-4 border-l-4 border-red-500 whitespace-pre-line">
                          {result.error}
                        </div>
                      )}
                    </div>
                  )}
                  {result.output && (
                    <div className="pl-4 whitespace-pre-line">
                      {result.output}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center h-full text-muted-foreground"
              >
                <p>No result yet. Run your code to see output.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </div>
  );
}

export default Output;
