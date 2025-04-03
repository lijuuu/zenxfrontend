
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Settings, Menu, Maximize2, Minimize2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
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

// Define language options
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

const CompilerLayout = () => {
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const navigate = useNavigate();
  
  // Get state from Redux store
  const { language, files, currentFile } = useSelector((state: RootState) => 
    state.xCodeCompiler ? state.xCodeCompiler : { language: 'javascript', files: [], currentFile: null }
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

  return (
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
            <span className="font-medium text-foreground relative">xcode</span>
            
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

        <div className="flex items-center gap-1 md:gap-2">
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

          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
            <Settings className="h-4 w-4" />
          </Button>
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
              <CodeEditor className="h-full" isMobile={true} />
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
              <CodeEditor className="flex-grow" isMobile={false} />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-border/50" />
            <ResizablePanel defaultSize={35} maxSize={45} minSize={20} className="overflow-hidden">
              <Output className="h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default CompilerLayout;
