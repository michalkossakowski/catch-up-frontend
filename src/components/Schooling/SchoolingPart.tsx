import { useEffect, useState } from "react";
import {
  editSchoolingPart,
  getSchoolingPart,
} from "../../services/schoolingService";
import Loading from "../Loading/Loading";
import { SchoolingPartDto } from "../../dtos/SchoolingPartDto";
import TipTap from "../TextEditor/TipTap";
import MaterialItem from "../MaterialManager/MaterialItem";
import { OnActionEnum } from "../../Enums/OnActionEnum";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
interface SchoolingPartProps {
  partId?: number;
  changePartState?: (partId: number, state: boolean) => void;
  editMode?: boolean;
  order?: number;
  actionTrigger?: OnActionEnum;
  numberofParts?: number;
  schoolingId?: number;
  nextPartId?: number;
  previousPartId?: number;
}
const SchoolingPart: React.FC<SchoolingPartProps> = ({
  partId,
  changePartState,
  editMode = false,
  actionTrigger = -1,
  order = 0,
  numberofParts = 0,
  schoolingId = 0,
  nextPartId,
  previousPartId,
}) => {
  const [loading, setLoading] = useState(true);
  const [schoolingPart, setSchoolingPart] = useState<SchoolingPartDto | null>(
    null
  );
  const [editorContent, setEditorContent] = useState<string>("");

  const [editedSchoolingPart, setEditedSchoolingPart] =
    useState<SchoolingPartDto | null>(null);

  useEffect(() => {
    fetchSchoolingPart(partId);
  }, [partId]);

  const fetchSchoolingPart = async (partId?: number) => {
    getSchoolingPart(partId!)
      .then((res) => {
        setSchoolingPart(res);
        setEditedSchoolingPart(res);
        console.log(res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
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
      order: editedSchoolingPart?.order,
      materialsId: editedSchoolingPart?.materialsId,
    }).then((res) => {});
  };
  const materialCreated = (materialId: number) => {
    if (!editedSchoolingPart) return;
    editedSchoolingPart.materialsId = materialId;
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-100">
          <h2 className="text-start mb-4">{editedSchoolingPart?.title}</h2>
          <TipTap
            content={editedSchoolingPart?.content ?? "<h3>Start Editing</h3>"}
            editable={editMode}
            onContentChange={(html) => {
              setEditorContent(html);
              setEditedSchoolingPart(
                (prev) => (prev ? { ...prev, content: html } : null)
              );
            }}
          />
          <br></br>
          {!editMode && editedSchoolingPart?.materialsId != undefined && editedSchoolingPart.materialsId > 0 && (
            <MaterialItem
              key={editedSchoolingPart?.materialsId}
              materialId={editedSchoolingPart?.materialsId}
              enableDownloadFile={true}
              enableAddingFile={false}
              enableRemoveFile={false}
              enableEdittingMaterialName={false}
            />
          )}
          {editMode && (
            <MaterialItem
              materialId={editedSchoolingPart?.materialsId}
              materialCreated={materialCreated}
              enableAddingFile={true}
              enableDownloadFile={true}
              enableRemoveFile={true}
              enableEdittingMaterialName={true}
            />
          )}
          {!editMode &&(
            <div className='d-flex justify-content-between mt-4 w-100 padding-20'>
                {previousPartId && <Button variant='primary' as={Link} to={`/Schooling/${schoolingId}/part/${previousPartId}`} ><i className='bi-arrow-left' style={{color:'white'}}> </i>Previous</Button>}
                {nextPartId && <Button variant='primary' className={!previousPartId ? 'ms-auto' : ''} as={Link} to={`/Schooling/${schoolingId}/part/${nextPartId}`}>Next <i style={{color:'white'}} className='bi-arrow-right'></i></Button>}
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default SchoolingPart;