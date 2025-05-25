import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './SchoolingItem.css';
import { useEffect, useState } from 'react';
import { getSchoolingPart, updateUserSchoolingPartState } from '../../services/schoolingService';
import Loading from '../Loading/Loading';
import { Button } from 'react-bootstrap';
import { SchoolingPartDto } from '../../dtos/SchoolingPartDto';

interface SchoolingPartProps {
    partId?: number;
    isDone?: boolean;
    changePartState?: (partId: number, state: boolean) => void;
}
const SchoolingPart: React.FC<SchoolingPartProps> = ({
    partId,
    isDone,
    changePartState,
}) => {

    const [loading, setLoading] = useState(true);
    const [schoolingPart, setSchoolingPart] = useState<SchoolingPartDto | null>(null);
    useEffect(() => {
        fetchSchoolingPart(partId);
    }, [partId]);

    const fetchSchoolingPart = async (partId?: number) => {
        getSchoolingPart(partId!).then((res) => {
            setSchoolingPart(res);
            if (editor) {
                editor.commands.setContent(res?.content ?? '<h3>Start Editing</h3>');
            }
        })
        .finally(() => {
            setLoading(false);
        })
    }
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<h3>Start Editing</h3>',
    });

    const markPartAsComplete = async () => {
        changePartState?.(partId!, true);
        updateUserSchoolingPartState(schoolingPart?.schoolingUserId!, partId!, true);
    }
    
    const markPartAsIncomplete = async () => {
        changePartState?.(partId!, false);
        updateUserSchoolingPartState(schoolingPart?.schoolingUserId!, partId!, false);
    }
  return (
  <>
    {loading ? 
        <Loading/>
    :
        <div className='w-100'>
            <EditorContent editor={editor} className='w-100'/>
            {isDone ? 
                <Button variant='danger' className='mt-3' onClick={markPartAsIncomplete}>Mark as incomplete</Button>
            :
                <Button variant='success' className='mt-3' onClick={markPartAsComplete}>Mark as complete</Button>
            }
        </div>
    }
  </>
  );
};
export default SchoolingPart; 