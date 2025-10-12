import React, { useEffect, useState } from 'react';
import { Play, RefreshCw, ArrowLeft, Menu, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import Loader3 from '../ui/loader3';
import CodeResetModal from '@/components/common/CodeResetModal';
import { ProblemTabs } from './ProblemTabs';
import { CodeEditor } from './CodeEditor';
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
  isResetModalOpen: boolean;
  handleCodeExecution: (type: string) => void;
  handleResetCode: () => void;
  confirmResetCode: () => void;
  cancelResetCode: () => void;
  handleAddCustomTestCase: (input: string, expected: string) => void;
  navigate: (path: string) => void;
  targetTime: number | null;
  timeRemaining: number | null;
  isTargetTimeActive: boolean;
  hasAutoSubmitted: boolean;
  handleSetTargetTime: (minutes: number) => void;
  handleStopTargetTime: () => void;
  formatTime: (seconds: number) => string;
  handleOpenTargetTimeModal: () => void;
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
  isResetModalOpen,
  handleCodeExecution,
  handleResetCode,
  confirmResetCode,
  cancelResetCode,
  handleAddCustomTestCase,
  navigate,
  targetTime,
  timeRemaining,
  isTargetTimeActive,
  hasAutoSubmitted,
  handleSetTargetTime,
  handleStopTargetTime,
  formatTime,
  handleOpenTargetTimeModal,
}) => {
  //editor theme state
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
    <div className="relative h-screen w-full bg-black flex flex-col overflow-hidden">
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


          {/* Target Time Controls */}
          {!isTargetTimeActive ? (
            <Button
              onClick={handleOpenTargetTimeModal}
              size="sm"
              variant="outline"
              className="h-9 border-zinc-600 text-zinc-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 text-sm px-4 font-medium rounded-lg transition-all duration-200"
            >
              <Clock className="h-4 w-4 mr-2" />
              Target Time
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className={`h-8 px-3 rounded flex items-center text-xs font-medium ${timeRemaining && timeRemaining <= 60
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
                }`}>
                <Clock className="h-3.5 w-3.5 mr-1" />
                {timeRemaining ? formatTime(timeRemaining) : '00:00'}
              </div>
              <Button
                onClick={handleStopTargetTime}
                size="sm"
                variant="outline"
                className="h-9 border-zinc-600 text-zinc-300 hover:text-white hover:border-red-500 hover:bg-red-500/10 text-sm px-3 font-medium rounded-lg transition-all duration-200"
              >
                Stop
              </Button>
            </div>
          )}

          <Button
            onClick={() => handleCodeExecution('run')}
            className="h-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg  transition-all duration-200 text-xs px-3 font-medium rounded-md"
            disabled={isExecuting}
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            {isExecuting ? 'Running...' : 'Run'}
          </Button>
          <Button
            onClick={() => handleCodeExecution('submit')}
            className="h-8 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0 shadow-lg  transition-all duration-200 text-xs px-3 font-medium rounded-md"
            disabled={isExecuting}
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isExecuting ? 'animate-spin' : ''}`} />
            {isExecuting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            onClick={handleResetCode}
            className="h-8 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg  transition-all duration-200 text-xs px-3 font-medium rounded-md"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
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
                <ProblemTabs
                  problem={problem}
                  executionResult={executionResult}
                  output={output}
                  hideBackButton={true}
                  code={code}
                  language={language}
                  setCode={setCode}
                />
              </ResizablePanel>
            )
          ) : (
            <>
              <ResizablePanel
                defaultSize={36}
                minSize={25}
                maxSize={50}
                className="bg-zinc-900/60"
              >
                <ProblemTabs
                  problem={problem}
                  executionResult={executionResult}
                  output={output}
                  hideBackButton={true}
                  code={code}
                  language={language}
                  setCode={setCode}
                />
              </ResizablePanel>
              <ResizableHandle className="w-1.5 bg-zinc-900/60" />
            </>
          )}

          <ResizablePanel defaultSize={isMobile ? (showDescription ? 60 : 100) : 64} className="flex flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden ">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                loading={isLoading}
                editorTheme={editorTheme}
              />
            </div>
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