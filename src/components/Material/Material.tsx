import React, { useEffect, useState } from "react";
import FileAdd from '../File/FileAdd';
import { FileDto } from "../../dtos/FileDto";
import { MaterialDto } from "../../dtos/MaterialDto";
import materialService from "../../services/materialService";
import fileService from "../../services/fileService";
import ErrorMessage from "../ErrorMessage";

interface MaterialProps {
  materialId?: number;
  showRemoveFile?: boolean;
  showDownloadFile?: boolean;
  showAddingFile?: boolean;
  materialCreated?: (materialId: number) => void;
  showValidation?: boolean;
}

const Material: React.FC<MaterialProps> = ({
  materialId,
  showRemoveFile,
  showDownloadFile,
  showAddingFile,
  materialCreated = () => { },
  showValidation = true,
}) => {
  const [material, setMaterial] = useState<MaterialDto | null>(null);
  const [materialName, setMaterialName] = useState<string>('');

  // Obsługa error-ów
  const [errorShow, setErrorShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [materialNameValidation, setMaterialNameValidation] = useState<boolean>(false);

  useEffect(() => {
    if (materialId === 0 || materialId === null || materialId === undefined) {
      setMaterial(null);
    } else {
      getMaterial(materialId);
    }

    const refreshMaterialHandler = () => {
      if (materialId) {
          getMaterial(materialId);
      }
    };
    const element = document.querySelector(`[data-material-id="${materialId}"]`);
    if (element) {
        element.addEventListener('refreshMaterial', refreshMaterialHandler);
    }
    return () => {
      if (element) {
          element.removeEventListener('refreshMaterial', refreshMaterialHandler);
      }
    };
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

  const validateMaterialName = async (materialName: string) => {
    setMaterialNameValidation(materialName.length >= 5);
    setMaterialName(materialName)
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

  const shortedFileName =  (fileDto: FileDto, limit: number = 32) => {
      if (fileDto?.name && fileDto.name.length > limit) {
          return fileDto.name.slice(0, limit) + "...";
      }
      return fileDto?.name;
  }

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
        {material.files && material.files?.length > 0 && (
          <div className="border rounded-2 p-1">
            {material.files?.map((file) => (
                <div className="badge text-bg-secondary p-4 m-2 me-3 position-relative" key={`${file.id}-${file.name}`}>
                  <span>{shortedFileName(file, 128)}</span>
                  {showDownloadFile && (
                  <a onClick={() => downloadFile(file.id)} className='position-absolute translate-middle' style={{left: "100%", top:"15%" }}>
                      <i className={`bi bi-file-arrow-down-fill fs-3 downloadIcon `}></i>
                  </a>
                  )}
                  {showRemoveFile && (
                  <a onClick={() => removeFile(file.id)} className='position-absolute   translate-middle ' style={{left: "100%", top:"85%" }}>
                    <i className={`bi bi-trash2-fill deleteIcon  fs-3`}  />
                  </a>
                  )}
                </div>
            ))}
          </div>
          )}
          {showAddingFile && (
            <FileAdd materialId={material.id || 0} onFileUploaded={onFileUploaded}/>
          )}
        </>
      ) : (
        <>
          <div className="input-group mb-3">
            <input
              type="text"
              placeholder="Material's name"
              className={`form-control ${!materialNameValidation && showValidation ? 'is-invalid' : ''}`}
              value={materialName}
              onChange={(e) => validateMaterialName(e.target.value)}
            />
            <button 
              className={`btn ${!materialNameValidation && showValidation ? 'btn-outline-secondary' : 'btn-secondary'}` }
              type="button" 
              onClick={createMaterial} 
              disabled={showValidation && !materialNameValidation} 
            >
              Create
            </button>
          </div>
          {!materialNameValidation && showValidation && (
            <>
              <div className="invalid-feedback" style={{display: 'block'}}>
                <p>Material name must be at least 5 characters long.</p>
              </div>
            </>
          )}
        </>

      )}
    </section>
  );
};
export default Material;