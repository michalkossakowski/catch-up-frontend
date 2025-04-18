import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './SchoolingItem.css';

import { SchoolingDto } from '../../dtos/SchoolingDto';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
interface SchoolingItemProps {
  schooling?: SchoolingDto;
}
const SchoolingItem: React.FC<SchoolingItemProps> = ({
  schooling,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(schooling?.content ?? '<h3>Start Editing</h3>');
      setLoading(false);
    }
  }, [schooling?.content]);

  const editor = useEditor({
      extensions: [StarterKit],
  });

  return (
  <>
    {loading ? 
      <Loading/>
    :
      <EditorContent editor={editor} className='w-100'/>
    }
  </>
  );
};
export default SchoolingItem; 