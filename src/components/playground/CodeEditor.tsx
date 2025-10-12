import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import { defineAllThemes } from '@/components/playground/EditorThemes';
import { ThemeInfo } from "@/components/playground/EditorThemes"


interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  loading?: boolean;
  editorTheme?: ThemeInfo;
  onRun?: () => void;
  onSubmit?: () => void;
}

const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 22,
  fontFamily: 'JetBrains Mono, monospace, Consolas, "Courier New"',
  tabSize: 2,
  wordWrap: 'on',
  autoIndent: 'full',
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  smoothScrolling: true,
  padding: { top: 12, bottom: 12 },
  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
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
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  loading,
  editorTheme,
  onRun,
  onSubmit,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    loader.init().then(monacoInstance => defineAllThemes(monacoInstance));
  }, []);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();

    //add custom keybindings
    if (onRun) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRun();
      });
    }

    if (onSubmit) {
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.Enter, () => {
        onSubmit();
      });
    }
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
    <div id="editor-container" className="w-full h-full overflow-hidden rounded-md border relative bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={(v) => onChange(v || '')}
        onMount={handleEditorDidMount}
        options={defaultOptions}
        loading={loading}
        theme={editorTheme?.name}
      />
    </div>
  );
};
