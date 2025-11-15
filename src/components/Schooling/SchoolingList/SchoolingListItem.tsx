import { Badge } from "react-bootstrap";
import { SchoolingDto } from "../../../dtos/SchoolingDto";
import "./SchoolingList.scss";

interface SchoolingListItemProps {
  schooling?: SchoolingDto;
  index?: number;
  mapCategory: (categoryId: number) => string;
}

const SchoolingListItem: React.FC<SchoolingListItemProps> = ({
    schooling,
    index,
    mapCategory
}) => {
    return (
        <div className="schooling-list-item ">
            <div className="card m-2">
                <div className="d-flex p-2 justify-content-between">
                    <div className="d-flex align-items-center me-3">
                        <h6 className="m-0">{index}. {' '}{schooling?.title}</h6>
                         <Badge bg="primary" className="ms-2">{schooling?.priority ?? "-"}</Badge> 
                    </div>
                    <span className="fw-light">{schooling?.categoryId !== undefined ? mapCategory(schooling.categoryId) : "-"}</span>
                </div>
            </div>
        </div>
    )
}
export default SchoolingListItem;