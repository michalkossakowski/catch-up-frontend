import "./Tiptap.scss";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./MenuBar";
import { useEffect } from "react";

interface TipTapProps {
  content?: string;
  editable?: boolean;
  onEditorReady?: (editor: Editor) => void;
  onContentChange?: (html: string) => void;
}

const TipTap: React.FC<TipTapProps> = ({
  content = "<h3>Start Editing</h3>",
  editable = false,
  onEditorReady,
  onContentChange,
}) => {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle,
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Typography,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable,
    editorProps: {
      attributes: { class: "custom-editor" },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onContentChange?.(html);
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  return (
    <>
      {editable && <MenuBar editor={editor!} />}
      <EditorContent editor={editor} className={`${editable ? "start-editing mt-2 mb-2" : ""}`} />
    </>
  );
};

export default TipTap;
