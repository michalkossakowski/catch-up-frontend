import './SchoolingItem.css';

import { SchoolingDto } from '../../dtos/SchoolingDto';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import TipTap from '../TextEditor/TipTap';
interface SchoolingItemProps {
  schooling?: SchoolingDto;
  editMode?: boolean;
}
const SchoolingItem: React.FC<SchoolingItemProps> = ({
  schooling,
  editMode = false,
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



  return (
  <>
    {loading ? 
      <Loading />
    :
      <TipTap content={content} editable={editMode} />
    }
  </>
  )
};
export default SchoolingItem; 