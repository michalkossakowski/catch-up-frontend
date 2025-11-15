import { Card, Col, Row, Container, Button } from "react-bootstrap";
import SchoolingItem from "./SchoolingItem";
import SchoolingProgressBar from "./SchoolingProgressBar/SchoolingProgressBar";
import { useEffect, useState } from "react";
import { getSchooling, editSchooling } from "../../services/schoolingService";
import { SchoolingDto } from "../../dtos/SchoolingDto";
import { useParams } from "react-router-dom";
import SchoolingPart from "./SchoolingPart";
import "./Schooling.scss";
import { OnActionEnum } from "../../Enums/OnActionEnum";
import { FeedbackButton } from "../Feedback/FeedbackButton";
import { ResourceTypeEnum } from "../../Enums/ResourceTypeEnum";

const Schooling: React.FC = () => {
  const { schoolingId, partId } = useParams();

  const [schooling, setSchooling] = useState<SchoolingDto | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [actionTrigger, setActionTrigger] = useState<OnActionEnum>(-1);

  useEffect(() => {
    fetchSchooling();
  }, []);

  const fetchSchooling = async () => {
    if (!schoolingId) return;
    getSchooling(Number(schoolingId))
      .then((res) => {
        setSchooling(res);
      })
      .catch((err) => {
        console.error(err);
      });
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
  };

  const handleSaveButtonClick = () => {
    setActionTrigger(OnActionEnum.Saved);
    setEditMode(false);
    setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
  };

  const handleCancelButtonClick = () => {
    setActionTrigger(OnActionEnum.CancelSave);
    setEditMode(false);
    setTimeout(() => setActionTrigger(OnActionEnum.None), 100);
  };

  return (
    <Container className="py-4">
      <div className="utility-menu d-flex justify-content-end align-items-center pb-3">
        {editMode ? (
          <>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => handleSaveButtonClick()}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => handleCancelButtonClick()}
            >
              Cancel
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            className="me-2"
            onClick={() => setEditMode(true)}
          >
            <i className='bi-pencil' style={{color: 'white'}}> </i>
            Start Editing
          </Button>
        )}
        <FeedbackButton resourceId={schooling?.id!} resourceType={ResourceTypeEnum.Schooling} receiverId={schooling?.creatorId!} />
      </div>
      <Row>
        <Col md={3} className="p-0 pe-4 border-end">
          <SchoolingProgressBar schooling={schooling ?? undefined} />
        </Col>
        <Col md={9} className="p-0 ps-4">
          <Card className="schooling-card w-100">
            <Card.Body>
              {partId != undefined && (
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
              )}
              {partId == undefined && (
                <>
                  <h2>{schooling?.title}</h2>
                  <p className="text-secondary mt-4">
                    {schooling?.shortDescription}
                  </p>
                  <hr />
                  <span className="mt-4 text-secondary">
                    Select a part to start learning.
                  </span>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Schooling;