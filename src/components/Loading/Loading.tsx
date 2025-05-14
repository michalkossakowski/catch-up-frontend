import Spinner from "react-bootstrap/Spinner";
import LoadingAnimation from "./LoadingAnimation";

const Loading = () => {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
        </Spinner>
        <LoadingAnimation/>
      </div>
    );
  };
export default Loading;