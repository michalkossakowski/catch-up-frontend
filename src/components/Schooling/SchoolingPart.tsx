import { act, useEffect, useState } from 'react';
import { editSchoolingPart, getSchoolingPart, updateUserSchoolingPartState } from '../../services/schoolingService';
import Loading from '../Loading/Loading';
import { SchoolingPartDto } from '../../dtos/SchoolingPartDto';
import TipTap from '../TextEditor/TipTap';
import MaterialItem from '../MaterialManager/MaterialItem';
import { OnActionEnum } from '../../Enums/OnActionEnum';
interface SchoolingPartProps {
    partId?: number;
    isDone?: boolean;
    changePartState?: (partId: number, state: boolean) => void;
    editMode?: boolean;
    order?: number;
    actionTrigger?: OnActionEnum;
}
const SchoolingPart: React.FC<SchoolingPartProps> = ({
    partId,
    isDone,
    changePartState,
    editMode = false,
    actionTrigger = -1,
    order = 0,
}) => {
    const [loading, setLoading] = useState(true);
    const [schoolingPart, setSchoolingPart] = useState<SchoolingPartDto | null>(null);    
    const [editorContent, setEditorContent] = useState<string>('');

    const [editedSchoolingPart, setEditedSchoolingPart] = useState<SchoolingPartDto | null>(null); 


    useEffect(() => {
        fetchSchoolingPart(partId);
    }, [partId]);

    const fetchSchoolingPart = async (partId?: number) => {
        getSchoolingPart(partId!).then((res) => {
            setSchoolingPart(res);
            setEditedSchoolingPart(res);
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const markPartAsComplete = async () => {
        changePartState?.(partId!, true);
        updateUserSchoolingPartState(schoolingPart?.schoolingUserId!, partId!, true);
    }
    
    const markPartAsIncomplete = async () => {
        changePartState?.(partId!, false);
        updateUserSchoolingPartState(schoolingPart?.schoolingUserId!, partId!, false);
    }

    useEffect(() => {
        console.log("Action Trigger: ", actionTrigger);
        switch (actionTrigger) {
            case OnActionEnum.Saved:
                updateSchoolingPart();
                break;
            case OnActionEnum.CancelSave:
                setEditedSchoolingPart(schoolingPart);
                break;
            default:
                break;
        }
      }, [actionTrigger]);
    
    const updateSchoolingPart = async () => {
        editSchoolingPart({
            id: editedSchoolingPart?.id!,
            title: editedSchoolingPart?.title!,
            content: editorContent,
            shortDescription: editedSchoolingPart?.shortDescription!,
            iconFileId: editedSchoolingPart?.iconFile?.id ?? undefined,
            materialsId: editedSchoolingPart?.materials ?? [],
        }).then((res) => {
            console.log(res);
        });
    }

  return (
  <>
    {loading ? 
        <Loading/>
    :
        <div className='w-100'>
            <h3 className='text-start'>{order}. {editedSchoolingPart?.title}</h3>
            <TipTap
                content={editedSchoolingPart?.content ?? '<h3>Start Editing</h3>'}
                editable={editMode}
                onContentChange={(html) => {
                    setEditorContent(html);
                    setEditedSchoolingPart(prev => prev ? { ...prev, content: html } : null);
                  }}
            />
            { editedSchoolingPart?.materials?.map((id ,index ) => (
                <MaterialItem 
                    key={id} 
                    materialId={id}
                    enableDownloadFile={true}
                    enableAddingFile={false}
                    enableEdittingFile={false}
                    enableRemoveFile={false}
                    enableEdittingMaterialName={false}
                    showMaterialName={false}
                    nameTitle={index+1+". Attached Material"}
                />
            ))}
            {isDone ? 
                <button className='btn btn-primary mt-3 mb-3 ' onClick={markPartAsIncomplete}>Mark as incomplete</button>
            :
                <button className='btn btn-primary mt-3 mb-3 ' onClick={markPartAsComplete}>Mark as complete</button>
            }
        </div>
    }
  </>
  );
};
export default SchoolingPart; 