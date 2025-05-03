import * as monaco from 'monaco-editor';
import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  loading?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, language, loading }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [editorTheme, setEditorTheme] = useState<string>('vs-dark');

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
    <div id="editor-container" className="w-full h-full overflow-hidden rounded-md bg-[#1a1a1a] border relative">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || '')}
        onMount={handleEditorDidMount}
        theme={editorTheme}
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
          scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
          lineNumbers: 'on',
          glyphMargin: false,
          folding: true,
          contextmenu: true,
          suggest: { showMethods: true, showFunctions: true, showConstructors: true, showFields: true, showVariables: true, showClasses: true, showInterfaces: true },
        }}
      />
      

    </div>
  );
};