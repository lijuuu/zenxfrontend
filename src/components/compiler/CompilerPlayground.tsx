
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, Maximize2, Minimize2, HelpCircle, Keyboard, Plus, Minus, Palette, Type } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useCodeExecution } from '@/hooks/useCodeExecution';
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
  // Get initial sample code
  const getInitialSampleCode = () => {
    return `console.log("Hello, World!");
console.log("Welcome to JavaScript!");`;
  };

  // Local state management
  const [code, setCode] = useState<string>(getInitialSampleCode());
  const [language, setLanguage] = useState<string>('javascript');
  const [files, setFiles] = useState<Array<{ id: string, name: string, content: string, language: string }>>([
    { id: 'file1', name: 'main.js', content: getInitialSampleCode(), language: 'javascript' }
  ]);
  const [currentFile, setCurrentFile] = useState<string>('file1');
  const [isMobile, setIsMobile] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(14);
  const [editorTheme, setEditorTheme] = useState<ThemeInfo>({ name: 'vs-dark', backgroundColor: '#1e1e1e' });
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // TanStack Query for code execution
  const { executeCode, isLoading, result, error } = useCodeExecution();

  useEffect(() => { loader.init().then(monacoInstance => defineAllThemes(monacoInstance)); }, []);

  // Load state from localStorage on component mount
  useEffect(() => {
    const loadStateFromStorage = () => {
      try {
        const storedFiles = localStorage.getItem('compiler-files');
        const storedCurrentFile = localStorage.getItem('compiler-current-file');
        const storedLanguage = localStorage.getItem('compiler-language');
        const storedCode = localStorage.getItem('compiler-code');
        const storedFontSize = localStorage.getItem('compiler-font-size');
        const storedTheme = localStorage.getItem('compiler-theme');

        if (storedFiles) {
          const parsedFiles = JSON.parse(storedFiles);
          if (Array.isArray(parsedFiles) && parsedFiles.length > 0) {
            setFiles(parsedFiles);

            if (storedCurrentFile && parsedFiles.find(f => f.id === storedCurrentFile)) {
              setCurrentFile(storedCurrentFile);
              const currentFileData = parsedFiles.find(f => f.id === storedCurrentFile);
              if (currentFileData) {
                setCode(currentFileData.content);
                setLanguage(currentFileData.language);
              }
            } else {
              // Use first file if current file is invalid
              const firstFile = parsedFiles[0];
              setCurrentFile(firstFile.id);
              setCode(firstFile.content);
              setLanguage(firstFile.language);
            }
          }
        }

        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
        if (storedCode) {
          setCode(storedCode);
        }
        if (storedFontSize) {
          setFontSize(parseInt(storedFontSize));
        }
        if (storedTheme) {
          const parsedTheme = JSON.parse(storedTheme);
          setEditorTheme(parsedTheme);
        }
      } catch (error) {
        console.error('Error loading state from localStorage:', error);
      }
    };

    loadStateFromStorage();
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem('compiler-files', JSON.stringify(files));
    }
  }, [files]);

  // Save current file to localStorage whenever it changes
  useEffect(() => {
    if (currentFile) {
      localStorage.setItem('compiler-current-file', currentFile);
    }
  }, [currentFile]);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (code !== undefined) {
      localStorage.setItem('compiler-code', code);
    }
  }, [code]);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (language) {
      localStorage.setItem('compiler-language', language);
    }
  }, [language]);

  // Save font size to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compiler-font-size', fontSize.toString());
  }, [fontSize]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compiler-theme', JSON.stringify(editorTheme));
  }, [editorTheme]);

  // Keep code state in sync with current file (only when switching files, not when editing)
  useEffect(() => {
    const currentFileData = files.find(f => f.id === currentFile);
    if (currentFileData) {
      setCode(currentFileData.content);
    }
  }, [currentFile, files]);

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

  // Initialize theme index
  useEffect(() => {
    const themeIndex = themes.findIndex(t => t.name === editorTheme.name);
    if (themeIndex !== -1) {
      setCurrentThemeIndex(themeIndex);
    }
  }, [editorTheme.name]);

  // Toggle output panel on mobile
  const toggleOutputPanel = () => {
    if (isMobile) {
      setOutputExpanded(!outputExpanded);
    }
  };

  // File management functions
  const updateCurrentFile = (newCode: string, newLanguage?: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(file =>
        file.id === currentFile
          ? { ...file, content: newCode, language: newLanguage || file.language }
          : file
      );
      // Save to localStorage immediately
      localStorage.setItem('compiler-files', JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  const switchToFile = useCallback((fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setCurrentFile(fileId);
      setCode(file.content);
      setLanguage(file.language);

      // Force update the code state immediately
      setTimeout(() => {
        setCode(file.content);
      }, 0);
    }
  }, [files]);

  // Get file extension based on language
  const getFileExtension = (lang: string): string => {
    switch (lang) {
      case 'javascript':
        return 'js';
      case 'python':
        return 'py';
      case 'go':
        return 'go';
      case 'cpp':
        return 'cpp';
      default:
        return 'js';
    }
  };

  // Get proper file name with extension for current language
  const getNewFileName = useCallback((lang: string, fileCount: number): string => {
    const extension = getFileExtension(lang);
    return `file${fileCount + 1}.${extension}`;
  }, []);

  // Get sample code for different languages (only for new empty files)
  const getSampleCode = (language: string): string => {
    switch (language) {
      case 'javascript':
        return `console.log("Hello, World!");
console.log("Welcome to JavaScript!");`;

      case 'python':
        return `print("Hello, World!")
print("Welcome to Python!")`;

      case 'go':
        return `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    fmt.Println("Welcome to Go!")
}`;

      case 'cpp':
        return `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    std::cout << "Welcome to C++!" << std::endl;
    return 0;
}`;

      default:
        return `console.log("Hello, World!");`;
    }
  };

  const createNewFile = useCallback(() => {
    const newId = `file${Date.now()}`;
    const currentLanguage = language; // Use current selected language
    const newFile = {
      id: newId,
      name: getNewFileName(currentLanguage, files.length),
      content: getSampleCode(currentLanguage),
      language: currentLanguage
    };
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    localStorage.setItem('compiler-files', JSON.stringify(updatedFiles));
    switchToFile(newId);
  }, [language, files, switchToFile, getNewFileName]);

  const deleteFile = (fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem('compiler-files', JSON.stringify(updatedFiles));

    if (currentFile === fileId) {
      if (updatedFiles.length > 0) {
        switchToFile(updatedFiles[0].id);
      } else {
        // Create a new default file if no files left
        createNewFile();
      }
    }
  };

  const renameFile = (fileId: string, newName: string) => {
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.map(file =>
        file.id === fileId
          ? { ...file, name: newName }
          : file
      );
      localStorage.setItem('compiler-files', JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  // Clear all localStorage data (useful for debugging or reset)
  const clearAllData = () => {
    localStorage.removeItem('compiler-files');
    localStorage.removeItem('compiler-current-file');
    localStorage.removeItem('compiler-language');
    localStorage.removeItem('compiler-code');
    localStorage.removeItem('compiler-font-size');
    localStorage.removeItem('compiler-theme');

    // Reset to default state
    const defaultFile = {
      id: 'file1',
      name: 'main.js',
      content: getInitialSampleCode(),
      language: 'javascript'
    };
    setFiles([defaultFile]);
    setCurrentFile('file1');
    setCode(getInitialSampleCode());
    setLanguage('javascript');
    setFontSize(14);
    setEditorTheme({ name: 'vs-dark', backgroundColor: '#1e1e1e' });
  };

  // Set language handler
  const handleSetLanguage = (lang: string, fileExtension: string) => {
    setLanguage(lang);
    updateCurrentFile(code, lang);
  };

  // Code editor related handlers:
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRun = useCallback(() => {
    // Get the code directly from the Monaco editor to ensure we have the latest content
    let codeToRun = code;
    if (editorRef.current) {
      codeToRun = editorRef.current.getValue();
    }

    const reqLang = languages.find((langObj) => langObj.value === language)?.req || '';
    executeCode(codeToRun, reqLang);
  }, [code, language, executeCode]);


  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    updateCurrentFile(newCode);
  };
  const handleDownload = useCallback(() => {
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
  }, [code, language]);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  }, [code]);

  // Theme cycling function
  const cycleTheme = useCallback(() => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setCurrentThemeIndex(nextIndex);
    setEditorTheme({
      name: nextTheme.name,
      backgroundColor: nextTheme.data.rules[0]?.background || '#1e1e1e',
    });
    toast.success(`Theme: ${nextTheme.name}`);
  }, [currentThemeIndex]);

  // Font size functions
  const increaseFontSize = useCallback(() => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[currentIndex + 1]);
      toast.success(`Font size: ${FONT_SIZES[currentIndex + 1]}px`);
    }
  }, [fontSize]);

  const decreaseFontSize = useCallback(() => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (currentIndex > 0) {
      setFontSize(FONT_SIZES[currentIndex - 1]);
      toast.success(`Font size: ${FONT_SIZES[currentIndex - 1]}px`);
    }
  }, [fontSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRun();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleRun]);


  return (
    <>
      <FileSystem
        files={files}
        currentFile={currentFile}
        onFileSwitch={switchToFile}
        onCreateFile={createNewFile}
        onDeleteFile={deleteFile}
        onRenameFile={renameFile}
      />

      

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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseFontSize}
                        className="border-border/50 hover:bg-muted h-6 w-6 p-0"
                        title="Decrease font size"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseFontSize}
                        className="border-border/50 hover:bg-muted h-6 w-6 p-0"
                        title="Increase font size"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFontSize}
                      className="border-border/50 hover:bg-muted"
                      style={{ minWidth: 32 }}
                      aria-label="Decrease font size"
                      title="Decrease font size (Ctrl+-)"
                    >-</Button>
                    <span className="px-2 select-none text-xs">{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFontSize}
                      className="border-border/50 hover:bg-muted"
                      style={{ minWidth: 32 }}
                      aria-label="Increase font size"
                      title="Increase font size (Ctrl++)"
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cycleTheme}
                    className="border-border/50 hover:bg-muted h-6 w-6 p-0"
                    title="Cycle theme"
                  >
                    <Palette className="h-3 w-3" />
                  </Button>
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
                  title="Copy code"
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
                  title="Download code"
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
                  onClick={() => handleRun()}
                  disabled={!code?.trim()}
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto ml-2"
                  title="Run code (Ctrl+Enter)"
                >
                  <PlayIcon className="h-3.5 w-3.5" />
                  <span>run</span>
                  <span className="ml-1 text-xs opacity-70">⌃⏎</span>
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
                  onRun={handleRun}
                />
              </div>
              <div
                className="h-full transition-all duration-300"
                style={{ display: outputExpanded ? 'block' : 'none' }}
              >
                <Output className="h-full" result={result} isLoading={isLoading} code={code} language={language} />
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
                  onRun={handleRun}
                />
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-border/50" />
              <ResizablePanel defaultSize={35} maxSize={45} minSize={20} className="overflow-hidden">
                <Output className="h-full" result={result} isLoading={isLoading} code={code} language={language} />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </>
  );
};

export default CompilerPlayground;
