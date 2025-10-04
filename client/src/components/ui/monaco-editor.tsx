import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

interface MonacoEditorProps {
  value: string;
  language?: string;
  onChange?: (value: string) => void;
  height?: string;
  theme?: "vs-dark" | "light";
  readOnly?: boolean;
}

export function MonacoEditor({
  value,
  language = "javascript",
  onChange,
  height = "100%",
  theme = "vs-dark",
  readOnly = false,
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Configure Monaco Editor
    monaco.editor.defineTheme("ai-mtaani-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6A7280" },
        { token: "keyword", foreground: "8B5CF6" },
        { token: "string", foreground: "10B981" },
        { token: "number", foreground: "F59E0B" },
      ],
      colors: {
        "editor.background": "#1C1C28",
        "editor.foreground": "#E5E7EB",
        "editorLineNumber.foreground": "#6B7280",
        "editor.selectionBackground": "#374151",
        "editor.lineHighlightBackground": "#1F2937",
      },
    });

    // Create editor instance
    const editor = monaco.editor.create(editorRef.current, {
      value,
      language,
      theme: theme === "vs-dark" ? "ai-mtaani-dark" : "vs",
      readOnly,
      minimap: { enabled: false },
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      lineNumbers: "on",
      wordWrap: "on",
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: "selection",
      smoothScrolling: true,
    });

    editorInstanceRef.current = editor;

    // Listen for content changes
    const disposable = editor.onDidChangeModelContent(() => {
      if (onChange) {
        onChange(editor.getValue());
      }
    });

    return () => {
      disposable.dispose();
      editor.dispose();
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorInstanceRef.current && editorInstanceRef.current.getValue() !== value) {
      editorInstanceRef.current.setValue(value);
    }
  }, [value]);

  // Update editor language when prop changes
  useEffect(() => {
    if (editorInstanceRef.current) {
      const model = editorInstanceRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <div 
      ref={editorRef} 
      className="monaco-editor-container"
      style={{ height }}
      data-testid="monaco-editor"
    />
  );
}
