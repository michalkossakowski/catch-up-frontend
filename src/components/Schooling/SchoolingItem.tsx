import { SchoolingDto } from '../../dtos/SchoolingDto';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import TipTap from '../TextEditor/TipTap';
interface SchoolingItemProps {
  schooling?: SchoolingDto;
  editMode?: boolean;
  saveTrigger?: boolean;
}
const SchoolingItem: React.FC<SchoolingItemProps> = ({
  schooling,
  editMode = false,
  saveTrigger = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("<h3>Start Editing</h3>");

  useEffect(() => {
    if (schooling?.content) {
      setContent(schooling.content);
    } else {
      setContent("<h3>Start Editinsg</h3>");
    }
    setLoading(false);
  }, [schooling?.content]);

  useEffect(() => {
    if (saveTrigger) {
      console.log("Saving locally...");
    }
  }, [saveTrigger]);

  return (
  <>
    {loading ? 
      <Loading />
    :
      <div className='w-100'>
        <TipTap content={content} editable={editMode} />
      </div>
    }
  </>
  )
};
export default SchoolingItem; 