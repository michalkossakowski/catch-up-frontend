import React, { useState, useEffect } from 'react';
import { MaterialDto } from "../../dtos/MaterialDto";

interface MaterialProps {
    materialId: number;
    showRemoveFile: boolean;
    showDownloadFile: boolean;
    showAddingFile: boolean;
    materialCreated: (materialId: number) => void;
  }
const Material = () => {

    const [material, setMaterial] = useState<MaterialDto | null>(null);
    const [materialName, setMaterialName] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    
    useEffect(() => 
    {
        if (materialId !== 0) 
          getMaterial(materialId);
    }, 
    [materialId]);
}
export default Material;
