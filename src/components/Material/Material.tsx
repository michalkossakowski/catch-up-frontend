import React, { useEffect, useState } from "react";
import FileAdd from '../File/FileAdd';
import { FileDto } from "../../dtos/FileDto";
import { MaterialDto } from "../../dtos/MaterialDto";
import materialService from "../../services/materialService";
import './Material.css';
import deleteIcon from "../../assets/deleteIcon.svg";
import downloadIcon from "../../assets/downloadIcon.svg";
import fileService from "../../services/fileService";

interface MaterialProps {
  materialId: number;
  showRemoveFile?: boolean;
  showDownloadFile?: boolean;
  showAddingFile?: boolean;
  materialCreated: (materialId: number) => void;

}

const Material: React.FC<MaterialProps> = ({
  materialId,
  showRemoveFile,
  showDownloadFile,
  showAddingFile,
  materialCreated,
}) => {
  const [material, setMaterial] = useState<MaterialDto | null>(null);
  const [materialName, setMaterialName] = useState<string>('');

  useEffect(() => {
    if (materialId === 0 || materialId === null) {
      setMaterial(null);
    } else {
      getMaterial(materialId); 
    }
  }, [materialId]);

  const getMaterial = async (materialId: number) => {
    try {
      const materialData = await materialService.getMaterialWithFiles(materialId);
      setMaterial(materialData);
    } catch (error) {
      console.error('Material fetching error:', error);
    }
  };

  const onFileUploaded = (fileDto: FileDto) => {
    if (material) {
      setMaterial({
        ...material,
        files: [...(material.files || []), fileDto],
      });
    }
  };

  const createMaterial = async () => {
    const tempMaterialDto: MaterialDto = { name: materialName };
    if (materialName) {
      try {
        const response = await materialService.createMaterial(tempMaterialDto);
        setMaterial(response);
        materialCreated(response.id || 0);
        setMaterialName('');
      } catch (error) {
        console.error('Error creating material:', error);
      }
    }
  };

  const removeFile = (fileId: number) => {
    try {
      if (material && material.id) {
        materialService.removeFile(material.id, fileId);
        setMaterial({
          ...material,
          files: material.files?.filter((file) => file.id !== fileId) || [],
        });
      }
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const downloadFile = async (fileId: number) => {
    try {
      const response = await fileService.downloadFile(fileId);
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      const file = material?.files?.find((file) => file.id === fileId);
      a.download = `${file?.name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <section className="container mt-3">
      {material ? (
        <>
          <ul className="list-group">
            {material.files?.map((file) => (
              <li key={file.id} className="list-group-item d-flex justify-content-between align-items-start">
                {file.name}
                <div>
                  {showRemoveFile && (
                    <a className="pe-2" onClick={() => removeFile(file.id)}>
                      <img src={deleteIcon} className="deleteIcon hoverIcon icon-size" />
                    </a>
                  )}
                  {showDownloadFile && (
                    <a onClick={() => downloadFile(file.id)}>
                      <img src={downloadIcon} className="downloadIcon hoverIcon icon-size" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {showAddingFile && (
            <FileAdd materialId={materialId} onFileUploaded={onFileUploaded} />
          )}
        </>
      ) : (
        <div className="input-group mb-3 ">
          <input
            type="text"
            placeholder="Material's name"
            className="form-control"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button" onClick={createMaterial}>
            Create
          </button>
        </div>
      )}
    </section>
  );
};
export default Material;