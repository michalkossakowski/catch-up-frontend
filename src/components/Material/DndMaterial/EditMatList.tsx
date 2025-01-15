import React, { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import FilesContainer from './FilesContainer'
import MaterialsContainer from './MaterialsContainer'
import materialService from '../../../services/materialService'
import styles from '../Material.module.css';
import { Alert } from 'react-bootstrap'

const EditMatList: React.FC = () => {
  const [materialIdToUpdate, setMaterialIdToUpdate] = useState<number | undefined>()
  const [addedFilesCounter, setAddedFilesCounter] = useState(0)
  const [assignedFileIds, setAssignedFileIds] = useState<number[]>([])
  const [materialAccordion, setMaterialAccordion] = useState<number | null>(null)

  // Obsługa error-ów
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleMaterialSelect = (materialId: number, fileIds: number[], action: string) => {
    switch (action){
      case "deleteMaterial":
        setMaterialAccordion(null)
      break

      case "open/close":
        if(materialAccordion === materialId)
          setMaterialAccordion(null)
        else
        {
          setMaterialAccordion(materialId)
          setAssignedFileIds(fileIds)
        }
      break

      case "uploadFile":
        setAssignedFileIds(fileIds)
      break

      case "save":
        setAssignedFileIds(fileIds)
      break
    }
  };

  const handleMaterialUpdate = (materialId: number) => {
    if (materialId != materialIdToUpdate) {
      setAddedFilesCounter(1)
      setMaterialIdToUpdate(materialId)
    }
    else {
      setAddedFilesCounter(prevstate => prevstate + 1)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active && over) {
      const draggedFileId = parseInt(active.id);
      const targetMaterialId = parseInt(over.id);

      try {
        await materialService.addFile(targetMaterialId, draggedFileId);
        setAssignedFileIds([...assignedFileIds, draggedFileId])
        handleMaterialUpdate(targetMaterialId)
      } catch (error) {
        setAlertMessage(`Error adding file ${draggedFileId} to material ${targetMaterialId}: ` + error)
        setShowAlert(true)
      }
    }
  }
  return (
    <div className="row align-items-start m-3">
    {showAlert &&(
    <Alert className='alert' variant='danger'>
      {alertMessage}
    </Alert>
      )}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="col">
          <MaterialsContainer
            materialIdToUpdate={materialIdToUpdate}
            addedFiles={addedFilesCounter}
            onMaterialSelect={handleMaterialSelect}
          />
        </div>
        <div className={`col ${styles.file_container} ${materialAccordion !== null ? styles.visible : styles.invisible}`}>
          <FilesContainer
            excludedFileIds={assignedFileIds}
          />        
        </div>
      </DndContext>
    </div>

  )
}

export default EditMatList