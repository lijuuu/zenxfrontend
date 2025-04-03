
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCheck, PlayIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from "@monaco-editor/react";
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { toast } from 'sonner';
import { runCode } from '@/store/slices/compilerSlice';
import { File } from '@/api/types/compiler';
import * as monaco from 'monaco-editor';
import { languages } from './CompilerLayout';
import { useAppDispatch } from '@/hooks/useAppDispatch';

interface CodeEditorProps {
  className?: string;
  isMobile: boolean;
}

const CodeEditor = ({ className, isMobile }: CodeEditorProps) => {
  const dispatch = useAppDispatch();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Get state from Redux store
  const { code, language, files, currentFile } = useSelector((state: RootState) =>
    state.xCodeCompiler ? state.xCodeCompiler : { code: '', language: 'javascript', files: [], currentFile: null }
  );

  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleRun = () => {
    if (dispatch) {
      const reqLang = languages.find((lang) => lang.value === language)?.req || '';
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
    <div className={cn("w-full h-full flex flex-col p-4 bg-background", className)}>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-foreground">
          {currentFile ? files.find((f: File) => f.id === currentFile)?.name || 'Editor' : 'Editor'}
        </div>
        <div className="flex space-x-2">
          {!isMobile && (
            <div className="flex items-center gap-2 opacity-60 hover:opacity-85">
              <label htmlFor="font-size-slider" className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                font size:
              </label>
              <input
                id="font-size-slider"
                type="range"
                min="8"
                max="30"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-40 h-2 bg-black dark:bg-white rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{fontSize}px</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="border-border/50 hover:bg-muted"
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
            className="border-border/50 hover:bg-muted"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            download
          </Button>
          <Button
            onClick={handleRun}
            disabled={!code.trim()}
            size="sm"
            className="gap-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            <span>run</span>
          </Button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 rounded-md overflow-hidden border border-border/50"
      >
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme= {"vs-dark"}
          options={{
            minimap: { enabled: true },
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
    </div>
  );
};

export default CodeEditor;
