import Spinner from "react-bootstrap/Spinner";
import LoadingAnimation from "./LoadingAnimation";

const Loading = () => {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <LoadingAnimation/>
      </div>
    );
  };
export default Loading;