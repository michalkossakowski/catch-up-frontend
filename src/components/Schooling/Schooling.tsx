import { Col, Row } from "react-bootstrap";
import SchoolingItem from "./SchoolingItem";
import SchoolingProgressBar from "./SchoolingProgressBar/SchoolingProgressBar";
import { useEffect, useState } from "react";
import { getUserSchooling } from "../../services/schoolingService";
import { SchoolingDto } from "../../dtos/SchoolingDto";
import { useParams } from "react-router-dom";
import SchoolingPart from "./SchoolingPart";
import "./Schooling.scss";
import { OnActionEnum } from "../../Enums/OnActionEnum";

const Schooling: React.FC = () => {

    const { schoolingId, partId } = useParams();

    const [isOpen, setIsOpen] = useState(true);
    const [schooling, setSchooling] = useState<SchoolingDto | null>(null);
    const [noPlace, setNoPlace] = useState(window.innerWidth < 1050);
    const [editMode, setEditMode] = useState(false);
    const [actionTrigger, setActionTrigger] = useState<OnActionEnum>(-1);

    useEffect(() => {
        fetchSchooling();
    },[])

    const fetchSchooling = async () => {
        if (!schoolingId) return;
            getUserSchooling(Number(schoolingId)).then((res) => {
                setSchooling(res);
            })
            .catch((err) => {
                console.error(err);
            });
    }
    const onOpen = (value: boolean): void => {
        setIsOpen(value);
    };
    const changePartState = (partId: number, state: boolean): void => {
        setSchooling((prevState) => {
            if (!prevState) return null;
            const updatedParts = prevState.schoolingPartProgressBar.map((part) => {
                if (part.id === partId) {
                    return { ...part, isDone: state };
                }
                return part;
            });
            return { ...prevState, schoolingPartProgressBar: updatedParts };
        });
    }   
    const resize = (isToSmall: boolean) => {
        setNoPlace(isToSmall);
    }

    const handleSaveButtonClick = () => {
      setActionTrigger(OnActionEnum.Saved);
      setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
    }

    const handleCancelButtonClick = () => {
      setActionTrigger(OnActionEnum.CancelSave);
      setEditMode(false)
      setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
    }

    return (
      <>
        <div className="utility-menu d-flex justify-content-end me-5 border-bottom">
          {editMode
            ?
              <>
                <a className="me-2" onClick={() => handleSaveButtonClick()}>Save</a>
                <a className="me-2" onClick={() => handleCancelButtonClick()}>Cancel</a>
              </>
            :
              <a className="me-2" onClick={() => setEditMode(true)}>Start Editing</a>    
          }
          <div className="vr"></div>
          <a className="me-2" onClick={() => {}}>Feedback</a>
        </div>
        <Row className={`position-relative p-0 m-0 ${noPlace ? "flex-column" : ""}`}>
            <Col sm={noPlace ? 12 : isOpen ? 3 : 2} className={`p-0 m-0 ps-2 pt-2 ${!noPlace? "border-end" :""}`}>      
                <SchoolingProgressBar 
                    schooling={schooling ?? undefined}
                    onOpen={onOpen}
                    resize={resize}
                />
            </Col>
            <Col sm={noPlace ? 12 : isOpen ? 9 : 10} className={`p-0 ps-3 pt-2 m-0 d-flex flex-column align-items-center ${noPlace ? "p-4" : "pe-5"}`}>
                {partId ? 
                <SchoolingPart
              
                  order={schooling?.schoolingPartProgressBar.find((part) => part.id === Number(partId))?.order ?? 0}
                  editMode={editMode}
                  partId={Number(partId)}
                  isDone={schooling?.schoolingPartProgressBar.find((part) => part.id === Number(partId))?.isDone}
                  changePartState={changePartState}
                  actionTrigger={actionTrigger}
                />
                :
                <SchoolingItem
                    editMode={editMode}
                    schooling={schooling ?? undefined}
                />
                }
            </Col>
        </Row>
      </>
    );
};
export default Schooling;