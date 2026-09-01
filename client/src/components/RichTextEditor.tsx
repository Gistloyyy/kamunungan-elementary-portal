/* Paper Garden style: the editor behaves like a school-office writing sheet, with ink rules, compact controls, and a tactile upload status. */
import { useEffect, useRef, useState } from "react";
import { Bold, ImagePlus, Link2, List, ListOrdered, Loader2 } from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  onImageUpload: (file: File, onProgress: (progress: number) => void) => Promise<string>;
  onError?: (message: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, onImageUpload, onError, placeholder = "What do families need to know or do next?" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);

  function currentHtml() { return editorRef.current?.innerHTML || ""; }
  function run(command: "bold" | "insertUnorderedList" | "insertOrderedList") { editorRef.current?.focus(); document.execCommand(command); onChange(currentHtml()); }
  function addLink() { editorRef.current?.focus(); const url = window.prompt("Paste the link URL"); if (!url) return; const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`; document.execCommand("createLink", false, normalized); onChange(currentHtml()); }
  async function uploadImage(file?: File) {
    if (!file) return;
    setUploading(true); setUploadProgress(0);
    try {
      const url = await onImageUpload(file, setUploadProgress);
      editorRef.current?.focus();
      document.execCommand("insertHTML", false, `<p><img src="${url}" alt="" /></p><p><br></p>`);
      onChange(currentHtml());
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false); setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return <div className="rich-editor"><div className="rich-editor__toolbar" role="toolbar" aria-label="Formatting options"><button type="button" title="Bold" aria-label="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => run("bold")}><Bold size={16} /></button><span className="toolbar-rule" aria-hidden="true" /><button type="button" title="Bulleted list" aria-label="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => run("insertUnorderedList")}><List size={17} /></button><button type="button" title="Numbered list" aria-label="Numbered list" onMouseDown={(event) => event.preventDefault()} onClick={() => run("insertOrderedList")}><ListOrdered size={17} /></button><button type="button" title="Add link" aria-label="Add link" onMouseDown={(event) => event.preventDefault()} onClick={addLink}><Link2 size={16} /></button><button type="button" title="Insert image" aria-label="Insert image" disabled={uploading} onMouseDown={(event) => event.preventDefault()} onClick={() => fileInputRef.current?.click()}>{uploading ? <Loader2 className="spin" size={16} /> : <ImagePlus size={16} />}</button><input ref={fileInputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(event) => uploadImage(event.target.files?.[0])} /><span className="rich-editor__hint">{uploading ? `Uploading ${uploadProgress}%` : "Format your note"}</span></div><div ref={editorRef} className="rich-editor__surface" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" data-placeholder={placeholder} onInput={(event) => onChange(event.currentTarget.innerHTML)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") { event.preventDefault(); run("bold"); } }} /></div>;
}
