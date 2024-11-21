import React, { useEffect, useState } from "react"
import materialService from "../../services/materialService"
import { MaterialDto } from "../../dtos/MaterialDto"
import deleteIcon from "../../assets/deleteIcon.svg"
import { Accordion } from "react-bootstrap"
import "./Material.css"
import Material from "./Material"

const EditMatList: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialDto[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialDto[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialList = await materialService.getAllMaterials()
        setMaterials(materialList);
        setFilteredMaterials(materialList)
      } catch (error) {
        console.error("Error fetching materials:", error)
      }
    };
    fetchMaterials()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    const filtered = materials.filter((material) =>
      material.name.toLowerCase().includes(query)
    );
    setFilteredMaterials(filtered)
  };

  const deleteMaterial = async (id?: number) => {
    if (id === null || id === undefined) return
    try {
      await materialService.deleteMaterial(id)
      setMaterials(materials.filter((material) => material.id !== id))
      setFilteredMaterials(filteredMaterials.filter((material) => material.id !== id))
    } catch (error) {
      console.error("Error deleting material:", error)
    }
  };

  return (
    <div className="container">
      <h1>Materials</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search materials by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control"
        />
      </div>
      <Accordion className="shadow p-3 mt-3 mb-5 bg-body-tertiary rounded">
        {filteredMaterials.map((material) => (
          <Accordion.Item key={material.id} eventKey={String(material.id)}>
            <Accordion.Header>
              <div className="d-flex justify-content-between align-items-center w-100">
                <span>{material.name}</span>
                <div>
                  <img
                    src={deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMaterial(material.id)
                    }}
                    className="deleteIcon hoverIcon icon-size me-3"
                    alt="Delete"
                  />
                </div>
              </div>
            </Accordion.Header>
            <Accordion.Body className="text-center">
              <h5>Details for: {material.name}</h5>
              <>
              <Material
                  materialId={material.id}
                  showRemoveFile={true}
                  showDownloadFile={true}
                  showAddingFile={true}
                />
                </>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default EditMatList
