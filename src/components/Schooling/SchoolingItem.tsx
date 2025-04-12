import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import './SchoolingItem.css';
const SchoolingItem: React.FC = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Start editing...</p>',
    });

  return (
    <EditorContent editor={editor} className='w-100'/>
  );
};
export default SchoolingItem;