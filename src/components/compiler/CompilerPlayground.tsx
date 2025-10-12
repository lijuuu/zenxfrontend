
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, Maximize2, Minimize2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { RootState } from '@/store';
import { SiJavascript, SiPython, SiGo, SiCplusplus } from 'react-icons/si';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from 'react-router-dom';
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import CodeEditor from './CodeEditor';
import Output from './Output';
import FileSystem from './FileSystem';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { defineAllThemes, themes, ThemeInfo } from '@/components/playground/EditorThemes';
import { runCode } from '@/store/slices/compilerSlice';
import { toast } from 'sonner';
import { CheckCheck, Copy, Download, PlayIcon } from 'lucide-react';

//define language options
export const languages = [
  {
    value: 'javascript',
    file: 'js',
    req: 'js',
    label: 'JavaScript',
    icon: <SiJavascript className="h-4 w-4 text-yellow-400" />
  },
  {
    value: 'python',
    file: 'py',
    req: 'python',
    label: 'Python',
    icon: <SiPython className="h-4 w-4 text-blue-400" />
  },
  {
    value: 'go',
    file: 'go',
    req: 'go',
    label: 'Go',
    icon: <SiGo className="h-4 w-4 text-cyan-400" />
  },
  {
    value: 'cpp',
    file: 'cpp',
    req: 'cpp',
    label: 'C++',
    icon: <SiCplusplus className="h-4 w-4 text-purple-400" />
  }
];

// Define types
export interface File {
  id: string;
  name: string;
  language: string;
  content: string;
  createdAt: string;
  lastModified: string;
}

export interface CompilerResult {
  output?: string;
  status_message?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
}

const FONT_SIZES = [10, 12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 26, 28, 30];

const CompilerPlayground = () => {
  const dispatch = useAppDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState<ThemeInfo>({ name: 'vs-dark', backgroundColor: '#1e1e1e' });
  const [copied, setCopied] = useState(false);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => { loader.init().then(monacoInstance => defineAllThemes(monacoInstance)); }, []);
  // Get state from Redux store
  const { language, files, currentFile, code } = useSelector((state: RootState) =>
    state.xCodeCompiler ? state.xCodeCompiler : { language: 'javascript', files: [], currentFile: null, code: '' }
  );

  // Handle mobile vs desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const localStorageTheme = localStorage.getItem("editorTheme");
    if (localStorageTheme) {
      try {
        const parsedTheme = JSON.parse(localStorageTheme);
        if (
          parsedTheme &&
          typeof parsedTheme.name === "string" &&
          typeof parsedTheme?.backgroundColor === "string"
        ) {
          setEditorTheme(parsedTheme);
        }
      } catch (e) {
        localStorage.removeItem("editorTheme");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("editorTheme", JSON.stringify(editorTheme));
  }, [editorTheme]);

  // Toggle output panel on mobile
  const toggleOutputPanel = () => {
    if (isMobile) {
      setOutputExpanded(!outputExpanded);
    }
  };

  // Set language handler
  const handleSetLanguage = (lang: string, fileExtension: string) => {
    if (dispatch) {
      // Here we assume you have these actions in your Redux setup
      dispatch({ type: 'xCodeCompiler/setLanguage', payload: lang });
      dispatch({ type: 'xCodeCompiler/setFile', payload: fileExtension });
    }
  };

  // Code editor related handlers:
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const handleRun = () => {
    if (dispatch) {
      const reqLang = languages.find((langObj) => langObj.value === language)?.req || '';
      dispatch(runCode({ code, reqLang }));
    }
  };
  const handleCodeChange = (value: string | undefined) => {
    if (dispatch) {
      dispatch({ type: 'xCodeCompiler/setCode', payload: value || '' });
    }
  };
  const handleDownload = () => {
    const currentLang = languages.find(l => l.value === language);
    const extension = currentLang?.file || 'txt';
    const filename = `code.${extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <>
      <FileSystem />
      <div className="bg-background transition-colors duration-300 h-screen w-full flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="flex items-center justify-between border-b border-border/50 p-2 h-12 bg-muted/20">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-8 w-8 p-0 hover:bg-muted rounded-md">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>

            <div
              className="relative flex items-center cursor-pointer"
              onMouseEnter={() => setShowToolTip(true)}
              onMouseLeave={() => setShowToolTip(false)}
              onClick={() => navigate("/")}
            >
              <span className="font-medium text-foreground relative">zenx</span>

              {showToolTip && (
                <div className="absolute w-40 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-md mt-1 z-50">
                  Want to go back to home? Click here
                </div>
              )}

              <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">
                compiler
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-4 w-full justify-between">
            <div className="flex items-center">
              {/* zenx text and sidebar remain unchanged (left part) */}
            </div>
            <div className="flex items-center gap-4">
              {/* font/theme group */}
              <div className="flex items-center gap-4">
                {/* font size */}
                {!isMobile ? (
                  <div className="flex items-center gap-2">
                    <label htmlFor="font-size-select" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">font size:</label>
                    <select
                      id="font-size-select"
                      value={fontSize}
                      onChange={e => setFontSize(Number(e.target.value))}
                      className="px-2 py-1 border rounded bg-background text-xs"
                      style={{ width: 64 }}
                    >
                      {FONT_SIZES.map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFontSize(prev => Math.max(FONT_SIZES[0], prev - 1))}
                      className="border-border/50 hover:bg-muted"
                      style={{ minWidth: 32 }}
                      aria-label="Decrease font size"
                    >-</Button>
                    <span className="px-2 select-none text-xs">{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFontSize(prev => Math.min(FONT_SIZES[FONT_SIZES.length - 1], prev + 1))}
                      className="border-border/50 hover:bg-muted"
                      style={{ minWidth: 32 }}
                      aria-label="Increase font size"
                    >+</Button>
                  </div>
                )}
                {/* theme select */}
                <div className="flex items-center gap-2">
                  <label htmlFor="theme-select" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">theme:</label>
                  <select
                    id="theme-select"
                    value={editorTheme.name}
                    onChange={e => {
                      const selectedTheme = themes.find(t => t.name === e.target.value);
                      if (selectedTheme) {
                        setEditorTheme({
                          name: selectedTheme.name,
                          backgroundColor: selectedTheme.data.rules[0]?.background || '#1e1e1e',
                        });
                      }
                    }}
                    className="text-xs rounded border-black px-1 py-0.5 focus:ring-1"
                    style={{ backgroundColor: '#1e1e1e', outline: 'none', boxShadow: 'none', height: '24px' }}
                  >
                    {themes.map(theme => (
                      <option key={theme.name} value={theme.name} style={{ backgroundColor: '#1e1e1e' }}>
                        {theme.name.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* vertical divider */}
              <div className="border-l h-6 mx-4 border-border/50" />

              {/* copy/download/language/run group */}
              <div className="flex items-center gap-1 md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="border-border/50 hover:bg-muted w-full sm:w-auto scale-90"
                  style={{ fontSize: '90%', padding: '0.22rem 0.36rem' }}
                >
                  {copied ? (
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="border-border/50 hover:bg-muted w-full sm:w-auto scale-90"
                  style={{ fontSize: '90%', padding: '0.22rem 0.36rem' }}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  download
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-2 md:px-3 border-border/50 hover:bg-muted">
                      <span className="flex items-center">
                        {languages.find(l => l.value === language)?.icon}
                        <span className="hidden sm:inline ml-2">
                          {languages.find(l => l.value === language)?.label}
                        </span>
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border/50">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.value}
                        onClick={() => handleSetLanguage(lang.value, lang.file)}
                        className="hover:bg-muted flex items-center"
                      >
                        <span className="mr-2">{lang.icon}</span> {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={handleRun}
                  disabled={!code?.trim()}
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto ml-2"
                >
                  <PlayIcon className="h-3.5 w-3.5" />
                  <span>run</span>
                </Button>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted"
                    onClick={toggleOutputPanel}
                    title={outputExpanded ? "Show Editor" : "Show Output"}
                  >
                    {outputExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow overflow-hidden bg-background">
          {isMobile ? (
            <div className="h-full">
              <div
                className="h-full transition-all duration-300"
                style={{ display: outputExpanded ? 'none' : 'block' }}
              >
                <CodeEditor
                  className="h-full"
                  isMobile={true}
                  fontSize={fontSize}
                  editorTheme={editorTheme}
                  language={language}
                  code={code}
                  onCodeChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </div>
              <div
                className="h-full transition-all duration-300"
                style={{ display: outputExpanded ? 'block' : 'none' }}
              >
                <Output className="h-full" />
              </div>
            </div>
          ) : (
            <ResizablePanelGroup direction="horizontal" className="bg-background">
              <ResizablePanel defaultSize={65} minSize={40} className="flex flex-col overflow-hidden">
                <CodeEditor
                  className="flex-grow"
                  isMobile={false}
                  fontSize={fontSize}
                  editorTheme={editorTheme}
                  language={language}
                  code={code}
                  onCodeChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-border/50" />
              <ResizablePanel defaultSize={35} maxSize={45} minSize={20} className="overflow-hidden">
                <Output className="h-full" />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </>
  );
};

export default CompilerPlayground;
