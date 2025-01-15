import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import ErrorMessage from '../ErrorMessage';
import Material from '../Material/Material';
import { FeedbackButton } from '../Feedback/FeedbackButton';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

const SchoolingDetails: React.FC = () => {
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);

    const [errorShow, setErrorShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <section className="container mt-3">
            <ErrorMessage
                message={errorMessage || 'Undefine error'}
                show={errorShow}
                onHide={() => {
                setErrorShow(false);
                setErrorMessage(null);
            }} />
            <div className="container mb-3 shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                    <h3>{fullSchooling?.schooling?.title}</h3>
                    <h4>Category: {fullSchooling?.category?.name}</h4>
                    <p>{fullSchooling?.schooling?.description}</p>
                    <hr className="border border-2 bg-secondary"/>
                {fullSchooling?.parts && fullSchooling?.parts.map((part, index_part) => (
                    <div className="card bg-light-subtle mb-3"  key={`${part.id}-${part.name}-${index_part}`}>
                        <div className="card-header ">
                            <h5>{part.name}</h5>
                        </div>
                        <div className="card-body">
                            <p>{part.content}</p>
                            {part.materials &&
                            <ol className="list-group list-group-numbered  ">
                                {part.materials.map((material, index_material) => (
                                <li className="list-group-item " key={`${material.id}-${index_material}-${material.name}`} >
                                    <span>{material.name}</span>
                                    <Material materialId={material.id} showDownloadFile={true}/>
                                </li>
                                ))}
                            </ol>
                            }
                        </div>
                    </div>
                ))}
                <FeedbackButton resourceId={fullSchooling?.schooling?.id ?? 0} resourceType={ResourceTypeEnum.Schooling} />
            </div>
        </section>
    )
}

export default SchoolingDetails;
