import { useEffect, useRef } from "react";
import "./richTextEditor.css";

const tools = [
  ["bold", "B"], ["italic", "I"], ["underline", "U"],
  ["formatBlock", "H2", "h2"], ["formatBlock", "Quote", "blockquote"],
  ["insertUnorderedList", "List"], ["insertOrderedList", "1. List"],
  ["justifyLeft", "Left"], ["justifyCenter", "Center"], ["justifyRight", "Right"],
];

const RichTextEditor = ({ value = "", onChange, placeholder = "Write content..." }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value]);
  const run = (command, argument) => {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    onChange(editorRef.current?.innerHTML || "");
  };
  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (url) run("createLink", /^https?:\/\//i.test(url) ? url : `https://${url}`);
  };
  return <div className="rich-editor">
    <div className="rich-editor__toolbar">{tools.map(([command, label, argument]) => <button key={`${command}-${label}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => run(command, argument)}>{label}</button>)}<button type="button" onClick={addLink}>Link</button><button type="button" onClick={() => run("removeFormat")}>Clear</button></div>
    <div ref={editorRef} className="rich-editor__content" contentEditable suppressContentEditableWarning data-placeholder={placeholder} onInput={(event) => onChange(event.currentTarget.innerHTML)} />
  </div>;
};

export default RichTextEditor;
