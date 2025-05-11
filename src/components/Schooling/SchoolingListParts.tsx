import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Button } from "react-bootstrap";
import './SchoolingListParts.css';
import ErrorMessage from "../ErrorMessage";
import { useEffect, useState } from "react";
import schoolingService from "../../services/schoolingService";
import ConfirmModal from "../Modal/ConfirmModal";
import NotificationToast from "../Toast/NotificationToast";
import { setSchooling } from "../../store/schoolingSlice";
import { FullSchoolingDto } from "../../dtos/FullSchoolingDto";
import { useNavigate } from "react-router-dom";
import { MaterialDto } from "../../dtos/MaterialDto";
import materialService from "../../services/materialService";
import Loading from "../Loading/Loading";
import { SchoolingPartDto } from "../../dtos/SchoolingPartDto";

const SchoolingListParts: React.FC = () => {
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const [errorShow, setErrorShow] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState('')

    const [schoolingPartIdToDelete, setSchoolingPartIdToDelete] = useState<number | null>(null)

    const [materialList, setMaterialList] = useState<MaterialDto[]>([])
    const [selectableMaterials, setSelectableMaterials] = useState<MaterialDto[]>([])
    const [showMaterialSelectorModal, setShowMaterialSelectorModal] = useState(false)
    const [selectedMaterials, setSelectedMaterials] = useState<number[]>([])
    const [operationType, setOperationType] = useState<"add" | "remove" | null>(null)
    const [editedPartId, setEditedPartId] = useState<number | null>(null)


    useEffect(() => {
        getMaterials()
    }, [])
    
    const getMaterials = async () => {
        try {
          setMaterialList(await materialService.getAllMaterials())
        } catch (error) {
          setErrorMessage("Error fetching materials: " +error)
          setErrorShow(true)
        } finally {
          setLoading(false)
        }
      }

    const toggleSelection = (id: number) => {
        setSelectedMaterials((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const clearSelectedMaterials = () => {
        setSelectedMaterials([]);
    }

    const submitSelection = () => {
        if (operationType === "add") {
            addMaterialsToPart();
        } else if (operationType === "remove") {
            removeMaterialsFromPart();
        }
        setShowMaterialSelectorModal(false);
        clearSelectedMaterials()
    }
    const addMaterialsToPart = async () => {
        if (!fullSchooling) return;
    
        const updatedParts = fullSchooling.parts?.map(part => {
            if (part?.id === editedPartId) {
                const materialsToAdd = selectableMaterials.filter(material => material.id && selectedMaterials.includes(material.id));
                
                const updatedPart = {
                    ...part,
                    materials: [
                        ...(part.materials || []),
                        ...materialsToAdd 
                    ]
                };
                updatePart(updatedPart)
                return updatedPart
            }
            return part
        });
    
        const updatedSchooling: FullSchoolingDto = {
            ...fullSchooling,
            parts: updatedParts || [],
        };
    
        dispatch(setSchooling(updatedSchooling))
    };
    
    
    const removeMaterialsFromPart = async () => {
        if (!fullSchooling) return;
    
        const updatedParts = fullSchooling.parts?.map(part => {
            if (part.id === editedPartId) {
                const updatedPart = {
                    ...part,
                    materials: (part.materials || []).filter(
                        material => material.id && !selectedMaterials.includes(material.id)
                    )
                };
                updatePart(updatedPart)
    
                return updatedPart
            }
            return part
        });
    
        const updatedSchooling: FullSchoolingDto = {
            ...fullSchooling,
            parts: updatedParts || [],
        }
    
        dispatch(setSchooling(updatedSchooling))
    };
    
    
    
    const updatePart = async (part: SchoolingPartDto) => {
        schoolingService.editSchoolingPart(part)
            .then(() => {
                setToastMessage('Part updated successfully!');
                setShowToast(true);
            })
            .catch((error) => {
                setErrorMessage('Error editing part: ' + error.message);
                setErrorShow(true);
            });

    }
    

    const CreateNewPart = async () => {
        navigate('/schoolingpartedit')
    }

    const handleRemoveMaterialButton = async (partId?: number) => {
        if (!partId) return
        setOperationType("remove" )
        const selectedPart = fullSchooling?.parts?.find((part) => part.id === partId)
        if (selectedPart) {
            setSelectableMaterials(selectedPart.materials || [])
            setShowMaterialSelectorModal(true)
            setEditedPartId(partId)
        }
    }

    const handleAddMaterialButton = async (partId?: number) => {
        if (!partId) return;
        setOperationType("add" )

        const selectedPart = fullSchooling?.parts?.find((part) => part.id === partId);
        if (selectedPart) {
            const materialsNotInPart = materialList.filter(
                (material) =>
                    !(selectedPart.materials || []).some(
                        (partMaterial) => partMaterial.id === material.id
                    )
            )
            setEditedPartId(partId)
            setSelectableMaterials(materialsNotInPart);
            setShowMaterialSelectorModal(true);
        }
    }
    const EditSchoolingPart = async (partId?: number) => {
        navigate(`/schoolingpartedit/${partId}`)
    }
    const handleDelete = async () => {
        if(schoolingPartIdToDelete){
            schoolingService.archiveSchoolingPart(schoolingPartIdToDelete)
                .then(() => {
                    const updatedParts = fullSchooling?.parts?.filter(p => p.id !== schoolingPartIdToDelete )
                    if (fullSchooling) {
                        const updatedSchooling: FullSchoolingDto = {
                            ...fullSchooling,
                            parts: updatedParts ?? [], 
                        };
                        dispatch(setSchooling(updatedSchooling));
                    }                    
                    setErrorShow(false)
                    setShowToast(true);
                })
                .catch((error) => {
                    setErrorShow(true)
                    setErrorMessage('Error deleting Schooling part: ' + error.message)
                })
            setToastMessage(`Schooling part successfully deleted !`);
            setShowConfirmModal(false);
        }
    }
    
    const  DeleteSchoolingPart = async (partId?: number) => {
        setConfirmMessage("You are going to delete Schooling. Are You sure ?")
            if(partId)
                setSchoolingPartIdToDelete(partId)
            setShowConfirmModal(true);
    }

    return (
        <section className="container body_height">
            <ErrorMessage
                message={errorMessage || 'Undefine error'}
                show={errorShow}
                onHide={() => {
                setErrorShow(false);
                setErrorMessage(null);
            }} />
            {loading && (
                <div className='mt-3'>
                <Loading/>
                </div>
            )}
            {!loading && (
            <>
            <h3 className="text-center">Schooling Parts</h3>
            {fullSchooling?.parts?.length === 0 ? (
                <div className="d-flex justify-content-center">
                    <div className="d-grid gap-2 text-center col-6">
                        <p>No schooling parts found. Create new now !</p>
                        <Button type="button" variant="outline-secondary" size="lg" onClick={() => CreateNewPart()} >Create</Button>
                    </div>
                </div>
            ): (
                <>
                    <Button type="button" className="btn btn-success fs-3 addNewPart" onClick={() => CreateNewPart()}><i className="bi bi-plus-circle"></i></Button>
                    <div className="d-grid text-center mb-3 mt-3">
                        <h5>Schooling parts found: <i>{fullSchooling?.parts?.length}</i></h5>
                    </div>
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
                                        {/* <Material materialId={material.id} showDownloadFile={true} showRemoveFile={true}/> */}
                                   </li>
                                ))}
                            </ol>
                            }
                            <hr className="mt-2 mb-4 border-3"/>
                            <div className="d-flex justify-content-center">
                                <div className="d-grid gap-3 col-6">
                                    <div className="d-flex btn-group" role="group">
                                    <Button type="button"  variant="outline-primary" className="flex-grow-1 w-100 flex-basis50"
                                        onClick={() =>  handleRemoveMaterialButton(part.id)}                                    
                                        data-bs-toggle="modal" 
                                        data-bs-target="#materialSelectionModal" 
                                        >Remove Material
                                    </Button>
                                    <Button type="button" variant="outline-primary" className="flex-grow-1 w-100"
                                        onClick={() => handleAddMaterialButton(part.id)}                                    
                                        data-bs-toggle="modal" 
                                        data-bs-target="#materialSelectionModal" 
                                        >Add Material
                                    </Button>
                                    </div>
                                    <div className="d-flex">
                                        <Button type="button" variant="primary" size="lg" className="flex-grow-1 w-100 me-2 flex-basis65_5" onClick={() => EditSchoolingPart(part.id)}>Edit Schooling Part</Button>
                                        <Button type="button" variant="outline-danger" size="lg" className="flex-grow-1 w-100 ms-2" onClick={() => DeleteSchoolingPart(part.id)}><i className="bi bi-x-lg"></i> Delete Part</Button>
                                    </div>
                                </div>
                            </div>  
                        </div>
                    </div>
                ))}
                    <NotificationToast 
                        show={showToast} 
                        title={"Schooling operation info"} 
                        message={toastMessage} 
                        color={"green"} 
                        onClose={() => setShowToast(false)} />
                    <ConfirmModal 
                        show={showConfirmModal} 
                        title="Schooling operation confirmation"
                        message={confirmMessage}
                        onConfirm={handleDelete} 
                        onCancel={() => setShowConfirmModal(false)} 
                    />
                    {/* <MaterialSelector
                        show={showMaterialSelectorModal}
                        onHide={() => setShowMaterialSelectorModal(false)}
                        toggleSelection={toggleSelection}
                        submitSelection={submitSelection}
                        clearSelectedMaterials={clearSelectedMaterials} 
                        materials={selectableMaterials}                        
                    /> */}
                </>
            )}
            </>
            )}
        </section>
    )
}
export default SchoolingListParts;
