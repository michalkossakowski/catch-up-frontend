import React, { useState } from 'react'
import { DndContext } from '@dnd-kit/core'
import FilesContainer from './FilesContainer'
import MaterialsContainer from './MaterialsContainer'
import materialService from '../../../services/materialService'
import ErrorMessage from '../../ErrorMessage'

const EditMatList: React.FC = () => {
  const [materialIdToUpdate, setMaterialIdToUpdate] = useState<number | undefined>()
  const [state, setState] = useState(0)
  const [assignedFileIds, setAssignedFileIds] = useState<number[]>([])
  const [materialAccordion, setMaterialAccordion] = useState<number | null>(null)
  const [fileContainerKey, setFileContainerKey] = useState(0);

  // Obsługa error-ów
  const [errorShow, setErrorShow] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleMaterialSelect = (materialId: number, fileIds: number[]) => {
    if (materialAccordion !== materialId) {
      setMaterialAccordion(materialId)
      setAssignedFileIds(fileIds);
    }
    else if (fileIds.length === 0) {
      setMaterialAccordion(null)
    }
    else if (assignedFileIds.length !== fileIds.length) {
      setMaterialAccordion(materialId)
      setAssignedFileIds(fileIds);
      setFileContainerKey(prevKey => prevKey + 1);
    }
    else
      setMaterialAccordion(null)
  };

  const handleMaterialUpdate = (materialId: number) => {
    if (materialId != materialIdToUpdate) {
      setState(1)
      setMaterialIdToUpdate(materialId)
    }
    else {
      setState(prevstate => prevstate + 1)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active && over) {
      const draggedFileId = parseInt(active.id);
      const targetMaterialId = parseInt(over.id);

      try {
        await materialService.addFile(targetMaterialId, draggedFileId);
        handleMaterialUpdate(targetMaterialId)
      } catch (error) {
        setErrorMessage(`Error adding file ${draggedFileId} to material ${targetMaterialId}: ` + error)
        setErrorShow(true)
      }
    }
  }
  return (
    <div className="row align-items-start m-3">
      <ErrorMessage
        message={errorMessage || 'Undefine error'}
        show={errorShow}
        onHide={() => {
          setErrorShow(false);
          setErrorMessage(null);
        }} />
      <DndContext onDragEnd={handleDragEnd}>
        <div className="col">
          <MaterialsContainer
            materialIdToUpdate={materialIdToUpdate}
            state={state}
            onMaterialSelect={handleMaterialSelect}
          />
        </div>
        <div className={`col file-container ${materialAccordion !== null ? "visible" : "invisible"}`}>
          <FilesContainer
            key={fileContainerKey}
            excludedFileIds={assignedFileIds}
          />        </div>
      </DndContext>
    </div>

  )
}

export default EditMatList