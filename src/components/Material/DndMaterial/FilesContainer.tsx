import FileItem from "./FileItem";
import fileService from "../../../services/fileService";
import { useEffect, useState } from "react";
import { FileDto } from "../../../dtos/FileDto";
import { Form } from "react-bootstrap";
interface FilesContainerProps {
    excludedFileIds: number[]
}
const FilesContainer: React.FC<FilesContainerProps> = ({ excludedFileIds }) => {
    const [fileList, setFileList] = useState<FileDto[]>([])
    const [filtredFileList, setFiltredFileList] = useState<FileDto[]>([])
    const [searchTerm, setSearchTerm] = useState<string>('')

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                console.log("xd")
                setFileList(await fileService.getAllFiles())
            } catch (error) {
                console.error("Error fetching files:", error)
            }
        }
        fetchFiles()
    }, [])

    useEffect(() => {
        const filtrFiles = () => {
            setFiltredFileList(
                fileList
                    .filter(file => !excludedFileIds.includes(file.id))
                    .filter((file) => (file.name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()
                )))
        }
        filtrFiles()
    }, [excludedFileIds, fileList, searchTerm])

    return (
        <div className="container-md">
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
        </div>
    )
}
export default FilesContainer

