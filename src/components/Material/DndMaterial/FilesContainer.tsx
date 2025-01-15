import FileItem from "./FileItem";
import fileService from "../../../services/fileService";
import { useEffect, useState } from "react";
import { FileDto } from "../../../dtos/FileDto";
import { Alert, Form } from "react-bootstrap";
import React from "react";
import Loading from "../../Loading/Loading";
interface FilesContainerProps {
    excludedFileIds: number[]
}
const FilesContainer: React.FC<FilesContainerProps> = ({ excludedFileIds }) => {
    const [fileList, setFileList] = useState<FileDto[]>([])
    const [filtredFileList, setFiltredFileList] = useState<FileDto[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    // Obsługa error-ów
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')

    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setFileList(await fileService.getAllFiles())
            } catch (error) {
                setAlertMessage("Error fetching files: "+ error)
                setShowAlert(true)
            } finally {
                setLoading(false)
            }
        }
        fetchFiles()
    }, [])

    useEffect(() => {
        setFiltredFileList(fileList.filter(file => 
            !excludedFileIds.includes(file.id) &&
            (file.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
        ));
    }, [excludedFileIds, fileList, searchTerm]);
    

    return (
        <div className="container-md">
        {showAlert &&(
            <Alert className='alert' variant='danger'>
                {alertMessage}
            </Alert>
        )}
            <Form.Control
                size="lg"
                className="mb-4"
                type="text"
                placeholder="Search by file name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <hr />
            <h4>Files:</h4>
            <hr />
            {loading && (
                <div className='mt-3'>
                <Loading/>
                </div>
            )}

            {!loading && (
                <div className="container-md d-flex flex-wrap align-items-start">
                    {fileList && fileList.map((file) => {
                        const isVisible = filtredFileList.find(f => f.id == file.id);
                        return (
                            <div key={file.id} style={{ display: isVisible ? "block" : "none" }}>
                                <FileItem fileDto={file} />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
export default FilesContainer

