import { Col, Row } from "react-bootstrap";
import "./SchoolingProgressBar.css";

interface SchoolingProgressBarElementProps {
    showVl?: boolean;
    title?: string;
    description?: string;
    imgSrc?: string;
    isDone?: boolean;
    hide?: boolean;
}
const SchoolingProgressBarElement: React.FC<SchoolingProgressBarElementProps> = ({
    showVl = false,
    title,
    description,
    imgSrc,
    isDone = false,
    hide = false,
}) => {
    return (
        <Row className="schooling-ProgressBar-el mb-3 position-relative">
            <Col md={hide ? 2 : 12} className="p-0 ">
                {showVl && 
                    <span 
                    className={`position-absolute vr schooling-ProgressBar-vl ${isDone ? "text-success" : ""}`}
                    style={ hide ? {left: "calc(19% / 2)"} : {left: "50%"} }
                    />
                }
                <img src="/public/locales/pl/4x3.svg" alt="" className={`rounded-1 border border-2 schooling-ProgressBar-img  ${isDone ? "border-success" : ""}`}/>
            </Col>
            {hide &&
                <Col md={10} className="text-start align-items-start d-flex flex-column">
                    <span className="text-body-secondary">Tutorial</span>
                    <p className="p-0 m-0 text-wrap">Course Introduction dsa dsa dsa das dasd </p>
                </Col>
            }
        </Row>
    )
}
export default SchoolingProgressBarElement;