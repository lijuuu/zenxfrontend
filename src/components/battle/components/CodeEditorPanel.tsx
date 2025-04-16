
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, SendHorizontal } from 'lucide-react';
import { Editor } from '@monaco-editor/react';

interface CodeEditorPanelProps {
  code: string;
  language: string;
  isExecuting: boolean;
  onCodeChange: (value: string) => void;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  onSubmitSolution: () => void;
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  language,
  isExecuting,
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onSubmitSolution
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-zinc-800 bg-zinc-900/60 p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="text-xs rounded-md bg-zinc-800 border-zinc-700 text-zinc-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500/30"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-zinc-700 text-zinc-300"
            onClick={onRunCode}
            disabled={isExecuting}
          >
            <Play className="h-3.5 w-3.5 mr-1.5" />
            Run Code
          </Button>
          
          <Button
            size="sm"
            className="bg-green-700 hover:bg-green-600 text-white"
            onClick={onSubmitSolution}
            disabled={isExecuting}
          >
            <SendHorizontal className="h-3.5 w-3.5 mr-1.5" />
            Submit
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Editor
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          language={language}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineHeight: 22,
            fontFamily: 'JetBrains Mono, monospace, Consolas, "Courier New"',
            tabSize: 2,
            wordWrap: 'on',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditorPanel;
