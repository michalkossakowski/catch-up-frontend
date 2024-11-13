import React, { useEffect } from "react"

interface MaterialProps {
    materialId: number;
    // showRemoveFile: boolean;
    // showDownloadFile: boolean;
    // showAddingFile: boolean;
    // materialCreated: (materialId: number) => void;
  }
  
const Material: React.FC<MaterialProps> = ({
    materialId,
    }) => 
    {
        useEffect(() => {}, [materialId]) 
        return (
            <div>

            </div>
        )
    }
export default Material;
