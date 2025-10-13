import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, CheckCheck, PlayIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Editor from "@monaco-editor/react";
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { toast } from 'sonner';
import { runCode } from '@/store/slices/compilerSlice';
import { File } from '@/api/types';
import * as monaco from 'monaco-editor';
import { languages } from './CompilerPlayground';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { loader } from '@monaco-editor/react';
import { defineAllThemes } from '@/components/playground/EditorThemes';
import { themes, ThemeInfo } from "@/components/playground/EditorThemes"

interface CodeEditorProps {
  className?: string;
  isMobile: boolean;
  // pass these from parent now
  fontSize: number;
  editorTheme: ThemeInfo;
  language: string;
  code: string;
  onCodeChange: (value: string | undefined) => void;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onRun: () => void;
}

function getLineHeight(fontSize: number): number {
  // Monaco default is about 1.6x font size. We'll use 1.5x but ensure a minimum.
  return Math.max(Math.round(fontSize * 1.5), fontSize + 6);
}

const CodeEditor = ({ className, isMobile, fontSize, editorTheme, language, code, onCodeChange, onMount, onRun }: CodeEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    loader.init().then(monacoInstance => defineAllThemes(monacoInstance));
  }, []);


  // Update editor content when code prop changes
  useEffect(() => {
    if (editorRef.current && code !== undefined) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);


  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Register Ctrl+Enter keybinding for run
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      }, 'compilerRunCode');
    }

    // Add a keydown listener to catch key events and prevent default behavior
    editor.onKeyDown((e) => {
      if (e.ctrlKey && e.keyCode === monaco.KeyCode.Enter && !e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        if (onRun) {
          onRun();
        }
      }
    });

    //call the original onMount if provided
    if (onMount) {
      onMount(editor);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full h-full flex flex-col p-2  bg-background", className)}
    >
      <div id="compiler-editor-container" className="flex-1 rounded-md overflow-hidden border border-border/50">
        <Editor
          key={`editor-${language}`} // Force re-render when language changes
          height="100%"
          language={language}
          value={code}
          onChange={onCodeChange}
          onMount={handleEditorMount}
          theme={editorTheme.name}
          options={{
            minimap: { enabled: !isMobile },
            scrollBeyondLastLine: false,
            fontSize: fontSize,
            lineHeight: getLineHeight(fontSize),
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
              showVariables: true,
              showClasses: true,
              showInterfaces: true
            },
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
      </div>
    </motion.div>
  );
};

export default CodeEditor;