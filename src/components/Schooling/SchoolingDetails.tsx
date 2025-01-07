import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import fileService from '../../services/fileService';
import ErrorMessage from '../ErrorMessage';

const SchoolingDetails: React.FC = () => {
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);

    const [errorShow, setErrorShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const downloadFile = async (fileId: number) => {
        try {
            const response = await fileService.downloadFile(fileId);
            const url = window.URL.createObjectURL(response);
    
            const file = fullSchooling?.parts
                ?.flatMap(part => part.materials || [])
                ?.flatMap(material => material.files || [])
                ?.find(file => file.id === fileId);
    
            if (!file) {
                throw new Error(`File with ID ${fileId} not found`);
            }
    
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name || `downloaded_file_${fileId}`;
            a.click();
    
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            setErrorMessage(`Error downloading file: ${error instanceof Error ? error.message : String(error)}`);
            setErrorShow(true);
        }
    }
    

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
                                    <li className="list-group-item" key={`${material.id}-${index_material}-${material.name}`} >
                                        <span>{material.name}</span>
                                        {material.files && material.files.length > 0 && 
                                            <div className="mt-3 ">
                                                {material.files.map((file, index_file) => (
                                                    <div className="badge text-bg-secondary p-4 m-1 me-3 position-relative" key={`${file.id}-${index_file}-${file.name}`}>
                                                        <span>{file.name}</span>
                                                        <a onClick={() => downloadFile(file.id)} className='fs-3 position-absolute top-0 start-100 translate-middle pt-3 pe-2'>
                                                            <i className="bi bi-file-arrow-down-fill downloadIcon hoverIcon"></i>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    </li>
                                ))}
                            </ol>
                            }
                        </div>
                    </div>
                ))}

            </div>
        </section>
    )
}

export default SchoolingDetails;
