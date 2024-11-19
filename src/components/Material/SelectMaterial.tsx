import React, { useEffect, useState } from "react";
import materialService from '../../services/materialService';
import { MaterialDto } from '../../dtos/MaterialDto';


const SelectMaterial: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialDto[]>([])
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialDto[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialList = await materialService.getAllMaterials()
        setMaterials(materialList)
        setFilteredMaterials(materialList)
      } catch (error) 
      {
        console.error("Error fetching materials:", error)
      }
    }

    fetchMaterials()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    const filtered = materials.filter((material) =>
      material.name.toLowerCase().includes(query)
    )
    setFilteredMaterials(filtered)
  }

  return (
    <div className="select-material-container">
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

      <ul className="material-list list-group mt-3">
        {filteredMaterials.map((material) => (
          <li key={material.id} className="list-group-item">
            {material.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectMaterial
