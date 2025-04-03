
import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import * as monaco from "monaco-editor";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export const CodeEditor = ({ value, onChange, language }: CodeEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [theme, setTheme] = useState<string>("vs-dark");
  
  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
    
    // Add custom theme styling for better aesthetics
    monaco.editor.defineTheme('zenx-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'C678DD' },
        { token: 'string', foreground: '98C379' },
        { token: 'number', foreground: 'D19A66' },
        { token: 'function', foreground: '61AFEF' },
        { token: 'variable', foreground: 'E06C75' },
        { token: 'type', foreground: '56B6C2' }
      ],
      colors: {
        'editor.background': '#1A1D23',
        'editor.foreground': '#ABB2BF',
        'editor.lineHighlightBackground': '#2C313C',
        'editor.selectionBackground': '#3E4452',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorCursor.foreground': '#528BFF',
        'editorWhitespace.foreground': '#3B4048',
        'editorIndentGuide.background': '#3B4048',
        'editor.selectionHighlightBorder': '#3B4048'
      }
    });
    monaco.editor.setTheme('zenx-dark');
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
      className="w-full h-full overflow-hidden rounded-md bg-[#1A1D23] border border-zinc-800 shadow-lg"
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
        theme="zenx-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
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

export default CodeEditor;
