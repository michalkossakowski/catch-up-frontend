import React, { useEffect, useState } from "react"
import { MaterialDto } from "../../../dtos/MaterialDto"
import { useDroppable } from "@dnd-kit/core"
import materialService from "../../../services/materialService"
import { Accordion, Button, Form, InputGroup } from "react-bootstrap"
import FileAdd from "../../File/FileAdd"
import { FileDto } from "../../../dtos/FileDto"
import ErrorMessage from "../../ErrorMessage"
import ConfirmModal from "../../Modal/ConfirmModal"

interface MaterialItemProps {
  materialDto: MaterialDto
  addedFiles?: number
  onDeleteItem: (materialID: number) => void
  onMaterialSelect: (materialID: number, fileIds: number[], action: string) => void
}
const MaterialItem: React.FC<MaterialItemProps> = ({ materialDto, addedFiles, onDeleteItem, onMaterialSelect }) => {

  const [material, setMaterial] = useState<MaterialDto>()
  const [isEditing, setIsEditing] = useState(false)

  const [filesToDelete, setFilesToDelete] = useState<number[]>([])
  const [editedName, setEditedName] = useState<string>()
  const [nameError, setNameError] = useState<string | null>(null)

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  // Obsługa error-ów
  const [errorShow, setErrorShow] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const getWithFiles = async () => {
    try {
      if (materialDto.id) {
        setMaterial(await materialService.getMaterialWithFiles(materialDto.id))
      }
    } catch (error) {
      setErrorMessage("Error fetching materials: " + error)
      setErrorShow(true)
    }
  }

  useEffect(() => {
    getWithFiles()
  }, [])

  useEffect(() => {
    if (addedFiles != 0)
      getWithFiles()
  }, [addedFiles])

  useEffect(() => {
    if (material) {
      setEditedName(material.name)
    }
  }, [material])

  const { setNodeRef } = useDroppable({
    id: material?.id?.toString() || ""
  })
  const idString = material ? `item${material.id}` : ""

  const clickDeleteitem = () => {
    setConfirmMessage("You are going to delete. Material. Are You sure ?")
    setShowConfirmModal(true)
  }
  const handleDeleteItem = () => {
    setShowConfirmModal(false)
    if (material?.id)
      onDeleteItem(material?.id)
  }
  const toggleEditMode = () => {
    if (isEditing) {
      handleSave()
    }
    setIsEditing(!isEditing)
  }

  const handleSave = async () => {
    if (material?.id) {
      for (const fileID of filesToDelete) {
        if (material?.id)
          await deleteFile(fileID)
      }
      if (material?.name !== editedName && editedName) {
        await materialService.editMaterial(material?.id, editedName)
        material.name = editedName
      }
      if (material?.files && material?.id) {
        const fileIds = material?.files.map((file) => file.id)
        onMaterialSelect(material?.id, fileIds, "save")
      } 
    }
    setFilesToDelete([])
  }

  const deleteFile = async (fileId: number) => {
    if (material?.id) {
      try {
        await materialService.removeFile(material.id, fileId)
      } catch (error) 
      {
        setErrorMessage("Error in deleting file " + error)
        setErrorShow(true)
      }
    }
  }

  const validateName = (name: string) => {
    if (!name || name.length === 0) {
      setNameError("Name is required")
      return false
    }
    setNameError(null)
    return true
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setEditedName(newName)
    validateName(newName)
  }

  const handleDeleteFile = (fileID: number) => {
    setFilesToDelete((prev) => [...prev, fileID])
    setMaterial((prevMaterial) =>
      prevMaterial
        ? { ...prevMaterial, files: prevMaterial.files?.filter((file) => file.id !== fileID) }
        : null
    )
  }

  const handleAccordionClick = () => {
    cancelChanges()
    if (material?.files && material?.id) {
      const fileIds = material?.files.map((file) => file.id)
      onMaterialSelect(material?.id, fileIds, "open/close")
    }
  }

  const cancelChanges = async () => {
    if (materialDto.id) {
      const originalMaterial = await materialService.getMaterialWithFiles(materialDto.id)
      setMaterial(originalMaterial)  
    }
    setNameError(null)
    setIsEditing(false)
    setFilesToDelete([])
    setEditedName(material?.name || "")
  }

  const onFileUploaded = (fileDto: FileDto) => {
    console.log(fileDto);
    
    setMaterial((prevMaterial) => {
      if (prevMaterial) {
        const updatedFiles = [...(prevMaterial.files || []), fileDto];
        const updatedMaterial = {
          ...prevMaterial,
          files: updatedFiles,
        };        
        if (updatedMaterial.id) {
          onMaterialSelect(
            updatedMaterial.id,
            updatedFiles.map((file) => file.id),
            "uploadFile"
          );
        }
        return updatedMaterial;
      }
      return prevMaterial;
    });
  };
  

  return (
    <>
      <ErrorMessage
        message={errorMessage || 'Undefine error'}
        show={errorShow}
        onHide={() => {
          setErrorShow(false);
          setErrorMessage(null);
        }} />
        <ConfirmModal 
            show={showConfirmModal} 
            title="Material operation confirmation"
            message={confirmMessage}
            onConfirm={handleDeleteItem} 
            onCancel={() => setShowConfirmModal(false)} 
        />

      <Accordion.Item eventKey={idString} >
        <Accordion.Header onClick={handleAccordionClick}>
          {isEditing ? (
            <InputGroup hasValidation>
              <Form.Control
                required
                type="text"
                className="form-control me-2"
                value={editedName}
                onChange={handleNameChange}
                onClick={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.preventDefault()}
                isInvalid={!!nameError}
              />
              <Form.Control.Feedback type="invalid">
                {nameError}
              </Form.Control.Feedback>
            </InputGroup>
          ) : (
            material?.name
          )}
        </Accordion.Header>
        <Accordion.Body ref={setNodeRef}>
          {material?.files && material.files.map((file) => (
            <div className="badge text-bg-secondary p-3 m-1 position-relative" key={file.id}>
              {file.name}
              <a onClick={isEditing ? () => handleDeleteFile(file.id) : undefined} className={`fs-5 position-absolute top-0 start-100 translate-middle pt-2 pe-2 ${(isEditing ? "visible" : "invisible")}`}>
                      <i className={`bi bi-trash2-fill deleteIcon `}></i>
                  </a>
            </div>

          ))}
          <hr />
          <div><FileAdd materialId={material?.id || 0} onFileUploaded={onFileUploaded} /></div>
          <hr />
          <div className="d-flex justify-content-end mt-3 me-3">
            {isEditing &&
              <Button variant="primary" className="me-2" onClick={cancelChanges}>Cancel</Button>}
              <Button variant="primary" disabled={!!nameError} className="me-2 ms-2 disactive" onClick={toggleEditMode}>{isEditing ? "Save" : "Edit"}</Button>
              <Button variant="danger" className="ms-2" onClick={clickDeleteitem}>Delete</Button>
          </div>
        </Accordion.Body >
      </Accordion.Item>
    </>
  )
}

export default MaterialItem