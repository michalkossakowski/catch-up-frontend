import React, { useEffect, useState } from "react";
import FileAdd from '../File/FileAdd';
import { FileDto } from "../../dtos/FileDto";
import { MaterialDto } from "../../dtos/MaterialDto";
import materialService from "../../services/materialService";
import './Material.css';
import fileService from "../../services/fileService";
import ErrorMessage from "../ErrorMessage";

interface MaterialProps {
  materialId?: number;
  showRemoveFile?: boolean;
  showDownloadFile?: boolean;
  showAddingFile?: boolean;
  materialCreated?: (materialId: number) => void;

}

const Material: React.FC<MaterialProps> = ({
  materialId,
  showRemoveFile,
  showDownloadFile,
  showAddingFile,
  materialCreated = () => { },
}) => {
  const [material, setMaterial] = useState<MaterialDto | null>(null);
  const [materialName, setMaterialName] = useState<string>('');

  // Obsługa error-ów
  const [errorShow, setErrorShow] = React.useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)


  useEffect(() => {
    if (materialId === 0 || materialId === null || materialId === undefined) {
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
      setErrorMessage('Material fetching error: ' + error)
      setErrorShow(true)
    }
  }

  const onFileUploaded = (fileDto: FileDto) => {
    if (material) {
      setMaterial((material) => ({
        ...material,
        files: [...(material?.files || []), fileDto],
      }))
    }
  }

  const createMaterial = async () => {
    const tempMaterialDto: MaterialDto = { name: materialName };
    if (materialName) {
      try {
        const response = await materialService.createMaterial(tempMaterialDto);
        setMaterial(response);
        materialCreated(response.id || 0);
        setMaterialName('');
        materialId = response.id
      } catch (error) {
        setErrorMessage('Error creating material: ' + error)
        setErrorShow(true)
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
      setErrorMessage('Error removing file: ' + error)
      setErrorShow(true)
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
      setErrorMessage('Error downloading file: ' + error)
      setErrorShow(true)
    }
  };

  return (
    <section className="container mt-3 p-0">
      <ErrorMessage
        message={errorMessage || 'Undefine error'}
        show={errorShow}
        onHide={() => {
          setErrorShow(false);
          setErrorMessage(null);
        }} />
      {material ? (
        <>
          <ul className="list-group">
            {material.files?.map((file) => (
              <li key={file.id} className="list-group-item d-flex justify-content-between align-items-start">
                {file.name}
                <div>
                  {showRemoveFile && (
                    <a className="pe-2" onClick={() => removeFile(file.id)}>
                      <i className="bi bi-trash3 deleteIcon hoverIcon icon-size" />
                    </a>
                  )}
                  {showDownloadFile && (
                    <a onClick={() => downloadFile(file.id)}>
                      <i className="bi bi-file-earmark-arrow-down downloadIcon hoverIcon icon-size" />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {showAddingFile && (
            <FileAdd materialId={material.id || 0} onFileUploaded={onFileUploaded} />
          )}
        </>
      ) : (
        <div className="input-group mb-3">
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