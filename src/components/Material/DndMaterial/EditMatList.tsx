import React, { useState } from 'react'
import {DndContext} from '@dnd-kit/core'
import FilesContainer from './FilesContainer'
import MaterialsContainer from './MaterialsContainer'
import materialService from '../../../services/materialService'

const EditMatList: React.FC = () => {
  const [materialIdToUpdate, setMaterialIdToUpdate] = useState<number | undefined>();
  const [state, setState] = useState(0);

  const handleMaterialUpdate = (materialId: number) => {
    if(materialId!=materialIdToUpdate)
    {
      setState(1)
      setMaterialIdToUpdate(materialId)
    }
    else{
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
        console.error(`Error adding file ${draggedFileId} to material ${targetMaterialId}:`, error);
      }
    }
  }
  
  return (
    <div className="row align-items-start m-3">
      <DndContext onDragEnd={handleDragEnd}>
          <div className="col">
            <MaterialsContainer materialIdToUpdate={materialIdToUpdate} state={state}/>
          </div>
          <div className="col">
            <FilesContainer/>
          </div>
      </DndContext>
    </div>

  )
}

export default EditMatList