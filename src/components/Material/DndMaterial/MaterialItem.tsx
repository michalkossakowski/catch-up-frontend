import React, { useEffect, useState } from "react";
import { MaterialDto } from "../../../dtos/MaterialDto";
import { useDroppable } from "@dnd-kit/core";
import materialService from "../../../services/materialService";
import { Accordion, Button } from "react-bootstrap";
import editIcon from "../../../assets/editIcon.svg"
import '../Material.css';

interface MaterialItemProps extends MaterialDto {
  state?: number
}
const MaterialItem: React.FC<MaterialItemProps> = (materialDto) => {
    const [material, setMaterial] = useState<MaterialDto>();
    const getWithFiles = async () => {
      try {
        if(materialDto.id ){
          setMaterial(await materialService.getMaterialWithFiles(materialDto.id))
        }
      } catch (error) {
        console.error("Error fetching materials:", error)
      }
    }
    useEffect ( () => {
      getWithFiles()
    }, [])

    useEffect (() =>{
      if(materialDto.state != 0)
        getWithFiles()
    }, [materialDto.state])
        
    const {setNodeRef} = useDroppable({
        id: material?.id?.toString() || ""
        })
    const idString = material ? `item${material.id}` : "";
    
    return (
      <Accordion.Item eventKey={idString}>
        <Accordion.Header> 
          {material && material.name}
          {/* <img src={editIcon} className="editIconInName mb-2"/> */}
        </Accordion.Header>
        <Accordion.Body ref={setNodeRef}>
          {material?.files && material.files.map((file) =>(
            <div className="badge text-bg-secondary p-3  m-1">
              {file.name}
            </div>
          ))}
          <div className="d-flex justify-content-end mt-3 me-3">
            <Button variant="primary" className="me-2">Edit</Button>
            <Button variant="primary" className="me-2 ms-2">Copy</Button>
            <Button variant="danger" className="ms-2">Delete</Button>
          </div>
        </Accordion.Body >
      </Accordion.Item>
    )
}
export default MaterialItem