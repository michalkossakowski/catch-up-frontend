import { SchoolingDto } from '../../dtos/SchoolingDto';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import TipTap from '../TextEditor/TipTap';
import { useNavigate } from 'react-router-dom';
import { OnActionEnum } from '../../Enums/OnActionEnum';
import { editSchooling } from '../../services/schoolingService';

interface SchoolingItemProps {
  schooling?: SchoolingDto;
  editMode?: boolean;
  actionTrigger?: OnActionEnum;
}
const SchoolingItem: React.FC<SchoolingItemProps> = ({
  schooling,
  editMode = false,
  actionTrigger = -1,
}) => {
  const [loading, setLoading] = useState(true);
  const [editorContent, setEditorContent] = useState<string>('');
  const [editedSchooling, setEditedSchooling] = useState<SchoolingDto | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, [schooling]);

  const init = async () => {
      if (schooling?.content) {
      setEditedSchooling(schooling);
      setEditorContent(schooling.content);
      setLoading(false);
    }
  }
  useEffect(() => {
    switch (actionTrigger) {
      case OnActionEnum.Saved:
          updateSchooling();
          break;
      case OnActionEnum.CancelSave:
          setEditedSchooling(schooling ?? null);
          setEditorContent(schooling?.content ?? '');
          break;
      default:
          break;
    }
  }, [actionTrigger]);


  const updateSchooling = async () => {
    if (!editedSchooling) return;
    editSchooling(editedSchooling).then((res) => {});
  }
  const nextEl = () => {
    const partId = schooling?.schoolingParts?.[0]?.id;
    if (partId !== undefined) {
      navigate(`/Schooling/${schooling?.id}/part/${parseInt(partId.toString())}`);
    }
  };

  return (
  <>
    {loading ? 
      <Loading />
    :
      <div className='w-100'>
        <h3 className='text-start'>{schooling?.title}</h3>
        <TipTap
            content={editorContent}
            editable={editMode}
            onContentChange={(html) => {
                setEditorContent(html);
                setEditedSchooling(schooling => schooling ? { ...schooling, content: html } : null);
            }}
        />
      </div>
    }
    <button className='btn btn-primary mt-3 mb-3 ' onClick={() => nextEl()}>Next</button>
  </>
  )
};
export default SchoolingItem;