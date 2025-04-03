
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RefreshCw, Clock, CheckCircle, XCircle, ArrowLeft, Plus, Terminal, Server, Menu, Maximize2, Minimize2, Download, Settings, Code as CodeIcon } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import * as monaco from 'monaco-editor';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import MainNavbar from '@/components/MainNavbar';
import { TestCase, TestCaseRunOnly, ProblemMetadata, TestResult, ExecutionResult, ApiResponsePayload, GenericResponse } from '@/api/types/problem-execution';
import { useTheme } from '@/hooks/theme-provider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const API_BASE_URL = 'http://localhost:7000/api/v1';

const mapDifficulty = (difficulty: string): string => {
  switch (difficulty) {
    case 'E': return 'Easy';
    case 'M': return 'Medium';
    case 'H': return 'Hard';
    default: return difficulty;
  }
};

const fetchProblemById = async (problemId: string): Promise<ProblemMetadata> => {
  const response = await fetch(`${API_BASE_URL}/problems/metadata?problem_id=${problemId}`);
  if (!response.ok) throw new Error('Failed to fetch problem');
  const data = await response.json();
  const problemData = data.payload || data;
  return {
    problem_id: problemData.problem_id || '',
    title: problemData.title || 'Untitled',
    description: problemData.description || '',
    tags: problemData.tags || [],
    testcase_run: problemData.testcase_run || { run: [] }, // Ensure testcase_run is always defined
    difficulty: mapDifficulty(problemData.difficulty || ''),
    supported_languages: problemData.supported_languages || [],
    validated: problemData.validated || false,
    placeholder_maps: problemData.placeholder_maps || {},
  };
};

const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const Timer: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isActive) interval = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur-sm rounded-md shadow-md border border-zinc-700/40" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
        <Clock className="h-3.5 w-3.5 text-green-500" />
        <span className="font-medium tracking-wide">{formatTime(time)}</span>
      </div>
      <div className="h-3.5 w-px bg-zinc-700/50 mx-0.5"></div>
      <div className="flex space-x-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsActive(true)} 
          disabled={isActive} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Start
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => { setIsActive(false); setTime(0); }} 
          className="h-6 px-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700"
        >
          Reset
        </Button>
      </div>
    </motion.div>
  );
};

const ProblemDescription: React.FC<{ problem: ProblemMetadata }> = ({ problem }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      className="p-4 overflow-y-auto h-full bg-background border-r border-border/50 relative"
      initial={{ opacity: 0, x: -20 }} 
      animate={{ opacity: 1, x: 0 }} 
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">{problem.title}</h2>
        <div className="flex gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
            problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground">
              {tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-foreground mt-5 mb-3" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-md font-medium text-foreground mt-3 mb-1" {...props} />,
              p: ({ node, ...props }) => <p className="text-muted-foreground mb-3" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-4 text-muted-foreground space-y-1 mb-3" {...props} />,
              li: ({ node, ...props }) => <li className="text-muted-foreground" {...props} />,
              code: ({ node, ...props }) => <code className="px-1.5 py-0.5 bg-muted rounded text-sm text-primary" {...props} />,
              pre: ({ node, ...props }) => <pre className="p-3 bg-muted/80 rounded-md my-3 overflow-x-auto" {...props} />,
            }}
          >
            {problem.description}
          </ReactMarkdown>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/problems')} 
        className="absolute bottom-4 left-4 border-border/50 hover:bg-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> View All Problems
      </Button>
    </motion.div>
  );
};

const CodeEditor: React.FC<{ value: string; onChange: (value: string) => void; language: string }> = ({ value, onChange, language }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();
  const [fontSize, setFontSize] = useState(14);
  
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => { 
      if (editorRef.current) editorRef.current.layout(); 
    });
    const container = document.getElementById('editor-container');
    if (container) resizeObserver.observe(container);
    return () => { 
      if (container) resizeObserver.unobserve(container); 
    };
  }, []);

  return (
    <motion.div 
      id="editor-container" 
      className="w-full h-full overflow-hidden rounded-md bg-background border border-border/50 shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || '')}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: fontSize,
          lineHeight: 22,
          fontFamily: '"JetBrains Mono", monospace, Consolas, "Courier New"',
          tabSize: 2,
          wordWrap: 'on',
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { 
            verticalScrollbarSize: 6, 
            horizontalScrollbarSize: 6,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            vertical: 'visible',
            horizontal: 'visible',
            verticalSliderSize: 6,
            horizontalSliderSize: 6
          },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          contextmenu: true,
          suggest: { 
            showMethods: true, 
            showFunctions: true, 
            showConstructors: true, 
            showFields: true, 
            showVariables: true, 
            showClasses: true, 
            showInterfaces: true 
          },
          lineDecorationsWidth: 10,
          renderLineHighlight: 'all',
          colorDecorators: true,
          guides: {
            indentation: true,
            highlightActiveIndentation: true,
            bracketPairs: true
          },
          renderValidationDecorations: 'on',
          fixedOverflowWidgets: true
        }}
      />
    </motion.div>
  );
};

const Console: React.FC<{
  output: string[];
  executionResult: ExecutionResult | null;
  onReset: () => void;
  testCases: TestCase[];
  customTestCases: TestCase[];
  onAddCustomTestCase: (input: string, expected: string) => void;
  activeTab: 'output' | 'tests' | 'custom';
  setActiveTab: (tab: 'output' | 'tests' | 'custom') => void;
}> = ({ 
  output = [], 
  executionResult, 
  onReset, 
  testCases = [], 
  customTestCases = [], 
  onAddCustomTestCase, 
  activeTab, 
  setActiveTab 
}) => {
  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current && activeTab === 'output') {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output, activeTab]);

  const handleAddCustomTestCase = () => {
    if (customInput && customExpected) {
      onAddCustomTestCase(customInput, customExpected);
      setCustomInput('');
      setCustomExpected('');
    }
  };

  // Function to prettify JSON but keep formatting
  const formatTestCase = (jsonString: string) => {
    try {
      // We're displaying the raw JSON string as requested
      return jsonString;
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <motion.div 
      className="h-full overflow-hidden flex flex-col bg-background border-t border-border/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2 bg-muted/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
          <h3 className="text-sm font-medium text-foreground">Console</h3>
          <div className="flex text-xs ml-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab('output')} 
              className={`px-2 py-1 h-7 rounded-l-md ${activeTab === 'output' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Terminal className="h-3.5 w-3.5 mr-1" />
              Output
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('tests')} 
              className={`px-2 py-1 h-7 ${activeTab === 'tests' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Server className="h-3.5 w-3.5 mr-1" />
              Test Cases
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setActiveTab('custom')} 
              className={`px-2 py-1 h-7 rounded-r-md ${activeTab === 'custom' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Custom Tests
            </Button>
          </div>
        </div>
        <motion.button 
          onClick={onReset} 
          className="px-2 py-1 rounded-md flex items-center gap-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <RefreshCw className="h-4 w-4" /> Reset
        </motion.button>
      </div>
      
      <div className="overflow-y-auto p-3 font-mono text-sm flex-grow bg-muted/20">
        {activeTab === 'output' ? (
          output.length > 0 ? (
            <div className="space-y-1">
              {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {line.startsWith('[Error]') ? 
                    <span className="text-red-400">{line}</span> : 
                    line.match(/Array|Object|ProblemID|Language|IsRunTestcase|ExecutionResult/) ? 
                    <span className="text-green-500">{line}</span> : 
                    <span className="text-foreground/80">{line}</span>
                  }
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          ) : (
            <div className="text-muted-foreground italic">Run your code to see output here...</div>
          )
        ) : activeTab === 'tests' ? (
          <div>
            <h4 className="text-foreground font-medium mb-2">Run Test Cases</h4>
            {testCases.length > 0 ? (
              <div className="space-y-2">
                {testCases.map((tc, i) => (
                  <div key={tc.id || i} className="p-2.5 rounded-md bg-muted/50 border border-border/50 hover:border-border transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground/80 font-medium">Test Case {i + 1}</span>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i ? (
                        <XCircle className="h-4 w-4 text-red-500" />
                      ) : executionResult && executionResult.passedTestCases > i ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                    <div className="ml-4 mt-1.5 text-xs space-y-1.5">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Input:</span>
                        <pre className="text-green-500 font-mono bg-muted p-2 rounded overflow-x-auto">{formatTestCase(tc.input)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-muted p-2 rounded overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                      </div>
                      {executionResult && executionResult.failedTestCase && executionResult.failedTestCase.testCaseIndex === i && (
                        <>
                          {JSON.stringify(executionResult.failedTestCase.received) && 
                            <div className="flex flex-col">
                              <span className="text-muted-foreground mb-1">Received:</span>
                              <pre className="text-red-400 font-mono bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase.received, null, 2)}</pre>
                            </div>
                          }
                          {executionResult.failedTestCase.error && 
                            <div className="flex flex-col">
                              <span className="text-muted-foreground mb-1">Error:</span>
                              <pre className="text-red-400 font-mono bg-muted p-2 rounded overflow-x-auto">{executionResult.failedTestCase.error}</pre>
                            </div>
                          }
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">No run test cases available.</div>
            )}
            
            {executionResult && (
              <div className="mt-4 p-3 bg-muted/50 border border-border/50 rounded-md">
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-foreground font-medium">Test Results Summary</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${executionResult.overallPass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {executionResult.overallPass ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="p-2 rounded bg-muted">
                      <div className="text-muted-foreground text-xs">Total</div>
                      <div className="text-foreground font-medium">{executionResult.totalTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-green-500/10">
                      <div className="text-green-400 text-xs">Passed</div>
                      <div className="text-green-300 font-medium">{executionResult.passedTestCases}</div>
                    </div>
                    <div className="p-2 rounded bg-red-500/10">
                      <div className="text-red-400 text-xs">Failed</div>
                      <div className="text-red-300 font-medium">{executionResult.failedTestCases}</div>
                    </div>
                  </div>
                </div>
                
                {executionResult.failedTestCase?.testCaseIndex !== undefined && executionResult.failedTestCase?.testCaseIndex !== -1 && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 mt-3">
                    <h4 className="text-red-400 font-medium mb-2">Failed Test Case Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex">
                        <span className="text-muted-foreground w-24 inline-block">Test Case:</span>
                        <span className="text-foreground/80">{executionResult.failedTestCase?.testCaseIndex + 1}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Input:</span>
                        <pre className="text-green-500 font-mono bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.input, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Expected:</span>
                        <pre className="text-green-500 font-mono bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.expected, null, 2)}</pre>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground mb-1">Received:</span>
                        <pre className="text-red-400 font-mono bg-muted p-2 rounded overflow-x-auto">{JSON.stringify(executionResult.failedTestCase?.received, null, 2)}</pre>
                      </div>
                      {executionResult.failedTestCase?.error && 
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-1">Error:</span>
                          <pre className="text-red-400 font-mono bg-muted p-2 rounded overflow-x-auto">{executionResult.failedTestCase?.error}</pre>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-5 p-3 rounded-md border border-border/50 bg-muted/40">
              <h4 className="text-foreground font-medium mb-3">Add Custom Test Case</h4>
              <Input
                placeholder='e.g., { "nums": [2,7,11,15], "target": 9 }'
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="mb-2 bg-muted/80 text-foreground border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <Input
                placeholder="e.g., [0,1]"
                value={customExpected}
                onChange={(e) => setCustomExpected(e.target.value)}
                className="mb-3 bg-muted/80 text-foreground border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
              <Button 
                onClick={handleAddCustomTestCase} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Test Case
              </Button>
            </div>
            
            <div>
              <h4 className="text-foreground font-medium mb-2 flex items-center">
                <span>Custom Test Cases</span>
                {customTestCases.length > 0 && 
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {customTestCases.length}
                  </span>
                }
              </h4>
              
              {customTestCases.length > 0 ? (
                <div className="space-y-2">
                  {customTestCases.map((tc, i) => (
                    <div key={i} className="p-2.5 rounded-md bg-muted/50 border border-border/50 hover:border-border transition-colors">
                      <div className="text-xs font-medium text-muted-foreground mb-1.5">Custom Test #{i+1}</div>
                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs mb-1">Input:</span>
                          <pre className="text-green-500 font-mono bg-muted p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.input)}</pre>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-xs mb-1">Expected:</span>
                          <pre className="text-green-500 font-mono bg-muted p-2 rounded text-xs overflow-x-auto">{formatTestCase(tc.expected)}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground italic py-4 text-center bg-muted/20 rounded-md border border-dashed border-border/50">
                  No custom test cases added yet...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Playground: React.FC = () => {
  const [problemId, setProblemId] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [problem, setProblem] = useState<ProblemMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customTestCases, setCustomTestCases] = useState<TestCase[]>([]);
  const [consoleTab, setConsoleTab] = useState<'output' | 'tests' | 'custom'>('tests');
  const isMobile = useIsMobile();
  const [outputExpanded, setOutputExpanded] = useState<boolean>(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const languageOptions = [
    {
      value: 'javascript',
      label: 'JavaScript',
    },
    {
      value: 'python',
      label: 'Python',
    },
    {
      value: 'go',
      label: 'Go',
    },
    {
      value: 'cpp',
      label: 'C++',
    }
  ];

  const toggleOutputPanel = () => {
    if (isMobile) {
      setOutputExpanded(!outputExpanded);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlProblemId = queryParams.get('problem_id') || '';
    setProblemId(urlProblemId);

    if (!urlProblemId) {
      setIsLoading(false);
      return;
    }

    const storedLanguage = localStorage.getItem('language');

    setIsLoading(true);
    fetchProblemById(urlProblemId)
      .then(data => {
        setProblem(data);
        const firstLang = storedLanguage && data.supported_languages.includes(storedLanguage)
          ? storedLanguage
          : data.supported_languages[0] || 'go';
        setLanguage(firstLang);
        localStorage.setItem('language', firstLang);

        const codeKey = `${urlProblemId}_${firstLang}`;
        const storedCode = localStorage.getItem(codeKey);
        setCode(storedCode || data.placeholder_maps[firstLang] || '');
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching problem:', error);
        // Set a default problem to prevent undefined states
        setProblem({
          problem_id: '',
          title: 'Error Loading Problem',
          description: 'Failed to load problem data. Please try again later.',
          tags: [],
          testcase_run: { run: [] },
          difficulty: 'Unknown',
          supported_languages: ['javascript', 'go', 'python', 'cpp'],
          placeholder_maps: {
            javascript: '// Write your JavaScript solution here\n',
            go: '// Write your Go solution here\npackage main\n',
            python: '# Write your Python solution here\n',
            cpp: '// Write your C++ solution here\n#include <string>\n',
          },
        });
        setLanguage(storedLanguage || 'javascript');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (problem && language) {
      const codeKey = `${problem.problem_id}_${language}`;
      const storedCode = localStorage.getItem(codeKey);
      setCode(storedCode || problem.placeholder_maps[language] || '');
      setOutput([]);
      setExecutionResult(null);
      localStorage.setItem('language', language);
    }
  }, [problem, language]);

  useEffect(() => {
    if (problemId && language && code) {
      const codeKey = `${problemId}_${language}`;
      localStorage.setItem(codeKey, code);
    }
  }, [code, problemId, language]);

  const handleCodeExecution = useCallback(async (type: string) => {
    if (!problem) return;

    setIsExecuting(true);
    setOutput([]);
    setExecutionResult(null);

    const allTestCases = type === 'run' ? [...problem.testcase_run.run, ...customTestCases] : problem.testcase_run.run;

    try {
      const response = await fetch(`${API_BASE_URL}/problems/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem_id: problem.problem_id,
          language: language,
          user_code: code,
          is_run_testcase: type === 'run',
        }),
      });

      const data: GenericResponse = await response.json();
      const payload: ApiResponsePayload = data.payload;
      const executionResult: ExecutionResult = payload.rawoutput;

      if (!data.success) {
        let errorMessage = executionResult.failedTestCase?.error || 'Unknown error';
        if (executionResult.syntaxError) {
          errorMessage = `Syntax Error: ${executionResult.syntaxError}`;
        } else if (data.error) {
          errorMessage = `${data.error.errorType}: ${data.error.message}`;
        }

        setOutput([`[Error] ${errorMessage}`]);
        setExecutionResult(executionResult);
        setConsoleTab('output');

        toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
          description: errorMessage,
        });
      } else {
        setOutput([
          `ProblemID: ${payload.problem_id}`,
          `Language: ${payload.language}`,
          `IsRunTestcase: ${payload.is_run_testcase}`,
          `ExecutionResult: ${JSON.stringify(executionResult, null, 2)}`,
        ]);
        setExecutionResult(executionResult);

        if (type === 'run') {
          if (executionResult.overallPass) {
            toast.success('Run Successful', {
              description: `All ${executionResult.totalTestCases} test cases passed!`,
            });
            setConsoleTab('output');
          } else {
            toast.warning('Run Partially Successful', {
              description: `${executionResult.passedTestCases} of ${executionResult.totalTestCases} test cases passed.`,
            });
            setConsoleTab('tests');
          }
        } else if (type === 'submit') {
          if (executionResult.overallPass) {
            toast.success('Submission Accepted', {
              description: 'All test cases passed! Great job!',
            });
            setConsoleTab('output');
          } else {
            toast.error('Submission Failed', {
              description: `${executionResult.failedTestCases} test case(s) failed. Check the details.`,
            });
            setConsoleTab('tests');
          }
        }
      }
    } catch (error) {
      const errorMsg = (error as Error).message || 'Network error occurred';
      setOutput([`[Error] ${errorMsg}`]);
      setConsoleTab('output');
      
      toast.error(`${type === 'run' ? 'Run' : 'Submit'} Failed`, {
        description: 'Network or server error occurred.',
      });
    } finally {
      setIsExecuting(false);
    }
  }, [problem, language, code, customTestCases]);

  const handleRunCode = () => handleCodeExecution('run');
  const handleSubmitCode = () => handleCodeExecution('submit');

  const resetConsole = () => {
    setOutput([]);
    setExecutionResult(null);
  };

  const handleCustomTestCase = (input: string, expected: string) => {
    const newTestCase: TestCase = {
      id: `custom-${Date.now()}`,
      input,
      expected,
    };
    setCustomTestCases([...customTestCases, newTestCase]);
    toast.success('Test case added', {
      description: 'Custom test case has been added successfully.',
    });
  };

  return (
    <SidebarProvider>
      <div className="bg-background transition-colors duration-300 h-screen w-full flex flex-col overflow-hidden">
        {!isLoading && problem && (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {!isMobile && (
              <>
                <ResizablePanel defaultSize={30} minSize={25} maxSize={40} className="overflow-hidden">
                  <ProblemDescription problem={problem} />
                </ResizablePanel>
                <ResizableHandle className="w-1.5 bg-border/30" />
              </>
            )}
            
            <ResizablePanel defaultSize={isMobile ? 100 : 70} className="flex flex-col">
              <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  {isMobile && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => navigate('/problems')} 
                      className="h-8 w-8"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <div>
                    <h2 className="text-sm font-medium text-foreground">{problem.title}</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                      <Timer />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-border/50">
                        {languageOptions.find(l => l.value === language)?.label || 'Select Language'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background border-border/50">
                      {languageOptions
                        .filter(lang => problem.supported_languages.includes(lang.value))
                        .map(lang => (
                          <DropdownMenuItem 
                            key={lang.value} 
                            onClick={() => setLanguage(lang.value)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            {lang.label}
                          </DropdownMenuItem>
                        ))
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="default" size="sm" onClick={handleRunCode} disabled={isExecuting || !code.trim()}>
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    Run
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleSubmitCode} 
                    disabled={isExecuting || !code.trim()}
                  >
                    Submit
                  </Button>
                </div>
              </div>
              
              <ResizablePanelGroup direction="vertical" className="flex-grow">
                <ResizablePanel defaultSize={60} className="overflow-hidden">
                  <CodeEditor value={code} onChange={setCode} language={language} />
                </ResizablePanel>
                <ResizableHandle className="h-1.5 bg-border/30" />
                <ResizablePanel defaultSize={40} className="overflow-hidden">
                  <Console 
                    output={output}
                    executionResult={executionResult}
                    onReset={resetConsole}
                    testCases={problem.testcase_run.run}
                    customTestCases={customTestCases}
                    onAddCustomTestCase={handleCustomTestCase}
                    activeTab={consoleTab}
                    setActiveTab={setConsoleTab}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        
        {isLoading && (
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-foreground">Loading problem...</p>
            </div>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default Playground;
