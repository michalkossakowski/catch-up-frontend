import { Col, Row } from "react-bootstrap";
import SchoolingItem from "./SchoolingItem";
import SchoolingProgressBar from "./SchoolingProgressBar/SchoolingProgressBar";
import { useEffect, useState } from "react";
import { getUserSchooling } from "../../services/schoolingService";
import { SchoolingDto } from "../../dtos/SchoolingDto";
import { useParams } from "react-router-dom";
import SchoolingPart from "./SchoolingPart";

const Schooling: React.FC = () => {

    const { schoolingId, partId } = useParams();

    const [isOpen, setIsOpen] = useState(true);
    const [schooling, setSchooling] = useState<SchoolingDto | null>(null);
    const [noPlace, setNoPlace] = useState(window.innerWidth < 1050);
    
    useEffect(() => {
        fetchSchooling();
    },[])

    const fetchSchooling = async () => {
        if (!schoolingId) return;
            getUserSchooling(Number(schoolingId)).then((res) => {
                setSchooling(res);
                console.log(res);
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
        console.log(isToSmall);
    }

    return (
        <Row className={`position-relative p-0 m-0 mt-3 ${noPlace ? "flex-column" : ""}`}>
            <Col sm={noPlace ? 12 : isOpen ? 4 : 2} className="p-0 m-0 ps-3">      
                <SchoolingProgressBar 
                    schooling={schooling ?? undefined}
                    onOpen={onOpen}
                    resize={resize}
                />
            </Col>
            <Col sm={noPlace ? 12 : isOpen ? 8 : 10} className={`p-0 m-0 d-flex flex-column align-items-center ${noPlace ? "p-4" : "pe-4"}`}>
                {partId ? 
                <SchoolingPart
                    partId={Number(partId)}
                    isDone={schooling?.schoolingPartProgressBar.find((part) => part.id === Number(partId))?.isDone}
                    changePartState={changePartState}
                />
                :
                <SchoolingItem
                    schooling={schooling ?? undefined}
                />
                }
            </Col>
        </Row>
    );
};
export default Schooling;