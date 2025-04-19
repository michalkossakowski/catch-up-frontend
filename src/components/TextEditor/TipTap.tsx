import "./Tiptap.css"
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from "./MenuBar";

interface TipTapProps {
  content?: string;
  editable?: boolean;
}
const TipTap: React.FC<TipTapProps> = ({
  content = "<h3>Start Editinsg</h3>",
  editable = false,
}) => {  
  
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, 
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
  ]

  const editorProps = {
    attributes: {
      class: "custom-editor", 
    },
  };
  return (
    <div>
      <EditorProvider 
        slotBefore={<MenuBar />} 
        extensions={extensions} 
        content={content} 
        editorProps={editorProps} 
        editable={editable}>
      </EditorProvider>
    </div>
  )
}
export default TipTap;