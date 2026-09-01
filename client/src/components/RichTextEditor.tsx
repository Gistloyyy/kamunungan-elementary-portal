/* Paper Garden style: the editor behaves like a school-office writing sheet, with ink rules and a restrained toolbar rather than a generic SaaS composer. */
import { useEffect, useRef } from "react";
import { Bold, Link2, List, ListOrdered } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder = "What do families need to know or do next?" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);

  function run(command: "bold" | "insertUnorderedList" | "insertOrderedList") {
    editorRef.current?.focus();
    document.execCommand(command);
    onChange(editorRef.current?.innerHTML || "");
  }

  function addLink() {
    editorRef.current?.focus();
    const url = window.prompt("Paste the link URL");
    if (!url) return;
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    document.execCommand("createLink", false, normalized);
    onChange(editorRef.current?.innerHTML || "");
  }

  return <div className="rich-editor"><div className="rich-editor__toolbar" role="toolbar" aria-label="Formatting options"><button type="button" title="Bold" aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => run("bold")}><Bold size={16} /></button><span className="toolbar-rule" aria-hidden="true" /><button type="button" title="Bulleted list" aria-label="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => run("insertUnorderedList")}><List size={17} /></button><button type="button" title="Numbered list" aria-label="Numbered list" onMouseDown={(event) => event.preventDefault()} onClick={() => run("insertOrderedList")}><ListOrdered size={17} /></button><button type="button" title="Add link" aria-label="Add link" onMouseDown={(event) => event.preventDefault()} onClick={addLink}><Link2 size={16} /></button><span className="rich-editor__hint">Format your note</span></div><div ref={editorRef} className="rich-editor__surface" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder={placeholder} onInput={(event) => onChange(event.currentTarget.innerHTML)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") { event.preventDefault(); run("bold"); } }} />
  </div>;
}
