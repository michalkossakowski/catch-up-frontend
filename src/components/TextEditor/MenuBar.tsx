import { Editor } from "@tiptap/react";
import "./MenuBar.scss"
interface MenuBarProps {
  editor: Editor;
}
const MenuBar: React.FC<MenuBarProps> = ({
  editor,
}) => {

  if (!editor) {
    return null
  }

  return (
    <div className="menu-bar">
      <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
        <div className="btn-group me-2" role="group">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={`btn btn-outline-light ${editor.isActive('bold') ? 'active' : ''}`}
          >
            <i className="bi bi-type-bold"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={`btn btn-outline-light ${editor.isActive('italic') ? 'active' : ''}`}
          >
            <i className="bi bi-type-italic"></i>          
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={`btn btn-outline-light ${editor.isActive('strike') ? 'active' : ''}`}
          >
            <i className="bi bi-type-strikethrough"></i>
        </button>
        </div>


        <div className="btn-group me-2" role="group">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`btn btn-outline-light ${editor.isActive('paragraph') ? 'active' : ''}`}
          >
            <i className="bi bi-paragraph"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 1 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h1"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h2"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h3"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h4"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 5 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h5"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={`btn btn-outline-light ${editor.isActive('heading', { level: 6 }) ? 'active' : ''}`}
          >
            <i className="bi bi-type-h6"></i>
          </button>
        </div>


        <div className="btn-group me-2" role="group">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn btn-outline-light ${editor.isActive('bulletList') ? 'active' : ''}`}
          >
            <i className="bi bi-list-ul"></i>          
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn btn-outline-light ${editor.isActive('orderedList') ? 'active' : ''}`}
          >
            <i className="bi bi-list-ol"></i>
          </button>
        </div>


        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`btn btn-outline-light me-2`}
        >
          <i className="bi bi-blockquote-left"></i>
        </button>


        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={`btn btn-outline-light me-2 ${editor.isActive('blockquote') ? 'active' : ''}`}  
        >
          <i className="bi bi-hr"></i>
        </button>


        <button 
            onClick={() => editor.chain().focus().toggleHighlight().run()} 
            className={`btn btn-outline-light me-2 ${editor.isActive('highlight') ? 'active' : ''}`}>
          <i className="bi bi-highlighter"></i>          
        </button>

        {/* Aligment */}
        <div className="btn-group me-2" role="group">
          <button 
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run()
            }} 
            className={`btn btn-outline-light ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
            >
              <i className="bi bi-justify-left"></i>
          </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`btn btn-outline-light ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`} 
            >
              <i className="bi bi-text-center"></i>
            </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('right').run()} 
            className={`btn btn-outline-light ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
            >
              <i className="bi bi-justify-right"></i>
            </button>
          <button 
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`btn btn-outline-light ${editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}`} 
            >
              <i className="bi bi-justify"></i>
          </button>
        </div>

        <div className="btn-group me-2" role="group">
          <button onClick={() => editor.chain().focus().clearNodes().run()} 
            className={`btn btn-outline-light`}
          >
            Clear Marks
          </button>
          <button onClick={() => editor.chain().focus().clearNodes().run()} 
            className={`btn btn-outline-light`}
          >
            Clear Nodes
          </button>
        </div>

        <div className="btn-group me-2" role="group">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
            className={`btn btn-outline-light`}  
          >
            <i className="bi bi-arrow-counterclockwise"></i>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .redo()
                .run()
            }
            className={`btn btn-outline-light`}  
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        </div>


      </div>
    </div>
  )
}
export default MenuBar;