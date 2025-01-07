import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const SchoolingPartEdit: React.FC = () => {
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);

    return(
        <section>
            
        </section>
    )
}
export default SchoolingPartEdit;