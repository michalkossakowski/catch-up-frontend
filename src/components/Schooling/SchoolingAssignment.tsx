// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
import { Col, Row } from "react-bootstrap";

const SchoolingAssignment: React.FC = () => {
    // const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);

    return(
        <section className="container">
            <div className="row row-cols-2 row-cols-lg-2 g-2 g-lg-3">
                <div className="col-2 border">1 of 2</div>
                <div className="col-2 border">2 of 2</div>
            </div>
            <Row>
                <Col className="border" md="5">1 of 2</Col>
                <Col className="border" md="5">2 of 2</Col>
            </Row>
        </section>
    )
}
export default SchoolingAssignment;

