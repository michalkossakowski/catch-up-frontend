import { Col, Row } from "react-bootstrap";
import "./SchoolingProgressBar.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface SchoolingProgressBarProps {
    showVl?: boolean;
    title?: string;
    description?: string;
    img?: File;
    isDone?: boolean;
    hide?: boolean;
    Id?: number;
}
const SchoolingProgressBarElement: React.FC<SchoolingProgressBarProps> = ({
    showVl = false,
    title,
    description,
    img,
    isDone = false,
    hide = false,
    Id,
}) => {
    const { schoolingId, partId } = useParams();

    const [isChoosen, setIsChoosen] = useState(false);
    
    useEffect(() => {
        if (partId) {
            if (Number(partId) === Id)
                setIsChoosen(true);
            else 
                setIsChoosen(false);
        }
        else if (Id === 0) {
            setIsChoosen(true);
        }
    },[schoolingId, partId])

    return (
        <div className="schooling-ProgressBar-el mb-3 d-flex">
            <div className="position-relative img-container">
                <img src={img ? URL.createObjectURL(img) : undefined} alt="" className={`rounded-2 border border-3 ${isDone ? "border-success" : ""}`}/>
                {showVl && 
                    <span 
                    className={`position-absolute vr schooling-ProgressBar-vl ${isDone ? "text-success" : ""}`}
                    style={{left: "50%"}} 
                    />
                }
            </div>
            {hide &&
                <div className="ps-2 text-start align-items-start d-flex flex-column">
                    <span className={`text-wrap ${isChoosen ? "is-Choosen" :""}`}>{title}</span>
                    <p className={`p-0 m-0 text-wrap  ${isChoosen ? "is-Choosen" :""}`}>{description}</p>
                </div>
            }
        </div>
    )
}
export default SchoolingProgressBarElement;