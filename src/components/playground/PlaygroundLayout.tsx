import React, { useEffect, useState } from 'react';
import { Play, RefreshCw, ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Loader3 from '../ui/loader3';
import CodeResetModal from '@/components/common/CodeResetModal';
import { ProblemDescriptionLayout } from './ProblemDescription';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Timer } from './Timer';
import { ProblemMetadata, ExecutionResult, TestCase } from '@/api/types';
import { themes, ThemeInfo } from "@/components/playground/EditorThemes"


interface PlaygroundLayoutProps {
  problem: ProblemMetadata | null;
  isLoading: boolean;
  isMobile: boolean;
  hideBackButton?: boolean;
  showDescription: boolean;
  setShowDescription: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  output: string[];
  executionResult: ExecutionResult | null;
  isExecuting: boolean;
  customTestCases: TestCase[];
  consoleTab: 'output' | 'tests' | 'custom';
  setConsoleTab: (value: 'output' | 'tests' | 'custom') => void;
  isResetModalOpen: boolean;
  handleCodeExecution: (type: string) => void;
  handleResetCode: () => void;
  confirmResetCode: () => void;
  cancelResetCode: () => void;
  handleResetOutput: () => void;
  handleAddCustomTestCase: (input: string, expected: string) => void;
  navigate: (path: string) => void;
}

export const PlaygroundLayout: React.FC<PlaygroundLayoutProps> = ({
  problem,
  isLoading,
  isMobile,
  hideBackButton,
  showDescription,
  setShowDescription,
  language,
  setLanguage,
  code,
  setCode,
  output,
  executionResult,
  isExecuting,
  customTestCases,
  consoleTab,
  setConsoleTab,
  isResetModalOpen,
  handleCodeExecution,
  handleResetCode,
  confirmResetCode,
  cancelResetCode,
  handleResetOutput,
  handleAddCustomTestCase,
  navigate,
}) => {
  //editorTheme state
  const [editorTheme, setEditorTheme] = useState<ThemeInfo>({ name: 'vs-dark', backgroundColor: '#1e1e1e' });

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


  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
        <Loader3 className="h-8 w-8 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950/60 text-zinc-300">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-red-500">Problem Not Found</h1>
          <p className="text-zinc-400">
            We couldn't find the problem you're looking for. Please check the URL and try again.
          </p>
          {!hideBackButton && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 mt-4 text-sm px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Problem List
            </Button>
          )}
        </div>
      </div>
    );
  }


  return (
    <div className="relative min-h-screen min-w-full bg-black flex flex-col">
      <div className="h-12 px-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {!hideBackButton && (
            <ArrowLeft
              className="h-5 w-5 text-zinc-500 cursor-pointer hover:text-green-500 transition-colors"
              onClick={() => navigate("/problems")}
            />
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDescription(!showDescription)}
              className="text-zinc-300 hover:text-green-500"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 truncate">
            <Timer />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="text-xs rounded-md border-black px-2 py-1 focus:ring-0 focus:outline-none"
            style={{ backgroundColor: '#1e1e1e', outline: 'none', boxShadow: 'none' }}
          >
            {problem.supportedLanguages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={editorTheme.name}
            onChange={e => {
              const selectedTheme = themes.find(t => t.name === e.target.value);
              if (selectedTheme) {
                setEditorTheme({
                  name: selectedTheme.name,
                  backgroundColor: selectedTheme.data?.rules[0]?.background || '#1e1e1e',
                });
              }
            }}
            className="text-xs rounded-md border-black px-2 py-1 focus:ring-1"
            style={{ backgroundColor: '#1e1e1e', outline: 'none', boxShadow: 'none' }}
          >
            {themes.map(theme => (
              <option
                key={theme.name}
                value={theme.name}
                style={{ backgroundColor: '#1e1e1e' }}
              >
                {theme.name[0].toUpperCase() + theme?.name.slice(1).toLowerCase()}
              </option>

            ))}
          </select>


          <Button
            onClick={() => handleCodeExecution('run')}
            className="h-8 bg-yellow-700 hover:bg-yellow-800 text-zinc-300 border border-zinc-700 text-xs px-3"
            disabled={isExecuting}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Run
          </Button>
          <Button
            onClick={() => handleCodeExecution('submit')}
            className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs px-3"
            disabled={isExecuting}
          >
            Submit
          </Button>
          <Button
            onClick={handleResetCode}
            className="h-8 bg-red-600 hover:bg-red-700 text-white text-xs px-3"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction={isMobile ? "vertical" : "horizontal"}>
          {isMobile ? (
            showDescription && (
              <ResizablePanel
                defaultSize={40}
                minSize={30}
                maxSize={60}
                className="bg-zinc-900/60"
              >
                <ProblemDescriptionLayout problem={problem} hideBackButton={true} userCode={code} changeUserCode={setCode} handleCodeExecution={handleCodeExecution} isExecuting={isExecuting} />
              </ResizablePanel>
            )
          ) : (
            <>
              <ResizablePanel
                defaultSize={30}
                minSize={25}
                maxSize={50}
                className="bg-zinc-900/60"
              >
                <ProblemDescriptionLayout problem={problem} hideBackButton={true} />
              </ResizablePanel>
              <ResizableHandle className="w-1.5 bg-zinc-900/60" />
            </>
          )}

          <ResizablePanel defaultSize={isMobile ? (showDescription ? 60 : 100) : 70} className="flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={isMobile ? 60 : 70} minSize={10} maxSize={80}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  loading={isLoading}
                  editorTheme={editorTheme}
                />
              </ResizablePanel>
              <ResizableHandle className="h-1.5 bg-zinc-900/60" />
              <ResizablePanel defaultSize={isMobile ? 40 : 30} minSize={20}>
                <Console
                  output={output}
                  executionResult={executionResult}
                  isMobile={isMobile}
                  onResetOutput={handleResetOutput}
                  testCases={problem.testcaseRun?.run || []}
                  activeTab={consoleTab}
                  setActiveTab={setConsoleTab}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <CodeResetModal
        isOpen={isResetModalOpen}
        onResetCancel={cancelResetCode}
        onResetConfirm={confirmResetCode}
      />
    </div>
  );
};