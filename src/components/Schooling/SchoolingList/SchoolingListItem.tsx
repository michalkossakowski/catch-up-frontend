import { Badge } from "react-bootstrap";
import { SchoolingDto } from "../../../dtos/SchoolingDto";
import "./SchoolingList.scss";

interface SchoolingListItemProps {
  schooling?: SchoolingDto;
  mapCategory: (categoryId: number) => string;
}

const SchoolingListItem: React.FC<SchoolingListItemProps> = ({
    schooling,
    mapCategory
}) => {
    return (
        <div className="schooling-list-item ">
            <div className="card">
                <div className="d-flex p-2 justify-content-between">
                    <div className="d-flex align-items-center me-3">
                        <Badge bg="primary">{schooling?.priority ?? "-"}</Badge>
                        <h6 className="ms-2 m-0">{schooling?.title}</h6> 
                    </div>
                    <span className="fw-light" style={{width: "130px"}}>{schooling?.categoryId !== undefined ? mapCategory(schooling.categoryId) : "-"}</span>
                </div>
            </div>
        </div>
    )
}
export default SchoolingListItem;