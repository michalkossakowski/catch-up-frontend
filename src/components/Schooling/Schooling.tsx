import { Col, Row } from "react-bootstrap";
import SchoolingItem from "./SchoolingItem";
import SchoolingProgressBar from "./SchoolingProgressBar/SchoolingProgressBar";
import { useEffect, useState } from "react";
import { getSchooling, editSchooling } from "../../services/schoolingService";
import { SchoolingDto } from "../../dtos/SchoolingDto";
import { useParams } from "react-router-dom";
import SchoolingPart from "./SchoolingPart";
import "./Schooling.scss";
import { OnActionEnum } from "../../Enums/OnActionEnum";

const Schooling: React.FC = () => {

    const { schoolingId, partId } = useParams();

    const [isOpen, setIsOpen] = useState(true);
    const [schooling, setSchooling] = useState<SchoolingDto | null>(null);
    const [noPlace, setNoPlace] = useState(window.innerWidth < 1250);
    const [editMode, setEditMode] = useState(false);
    const [actionTrigger, setActionTrigger] = useState<OnActionEnum>(-1);

    useEffect(() => {
        fetchSchooling();
    },[])

    const fetchSchooling = async () => {
        if (!schoolingId) return;
            getSchooling(Number(schoolingId)).then((res) => {
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
            const updatedParts = prevState.schoolingParts.map((part) => {
                if (part.id === partId) {
                    return { ...part, isDone: state };
                }
                return part;
            });
            return { ...prevState, schoolingParts: updatedParts };
        });
    }   
    const resize = (isToSmall: boolean) => {
        setNoPlace(isToSmall);
    }

    const handleSaveButtonClick = () => {
      setActionTrigger(OnActionEnum.Saved);
      setEditMode(false)
      setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
      // try{
      //   editSchooling(schooling!).then((res) => {
      //     setActionTrigger(OnActionEnum.Saved);
      //     setEditMode(false)
      //     setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
      //   })
      // }catch(error){
      //   console.error('Error in saving schooling:', error)
      // }
    }

    const handleCancelButtonClick = () => {
      setActionTrigger(OnActionEnum.CancelSave);
      setEditMode(false)
      setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
    }

    return (
      <>
        <div className="utility-menu d-flex justify-content-end border-2 border-bottom">
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
            <Col sm={noPlace ? 12 : isOpen ? 2 : 1} className={`p-0 m-0 pt-3 border-2 ${!noPlace? "border-end" :""}`}>      
                <SchoolingProgressBar 
                    schooling={schooling ?? undefined}
                    onOpen={onOpen}
                    resize={resize}
                />
            </Col>
            <Col sm={noPlace ? 12 : isOpen ? 10 : 11} className={`p-0 ps-3 pt-3 m-0 d-flex flex-column align-items-center ${noPlace ? "p-4" : "pe-5"}`}>
                {partId != undefined && 
                <>
                  <SchoolingPart
                    order={
                      schooling
                        ? schooling.schoolingParts.findIndex(
                            (p) => p.id === Number(partId)
                          ) + 1
                        : 0
                    }
                    editMode={editMode}
                    partId={Number(partId)}
                    changePartState={changePartState}
                    actionTrigger={actionTrigger}
                    numberofParts={schooling?.schoolingParts.length}
                    schoolingId={Number(schoolingId)}
                  />
                </>
                }
                { partId == undefined &&
                <>
                  <p>{schooling?.shortDescription}</p>
                  <span className="mt-4 text-secondary">Select a part to start learning.</span>
                </>
                } 

            </Col>
        </Row>
      </>
    );
};
export default Schooling;