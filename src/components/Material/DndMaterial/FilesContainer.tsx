import React, { useEffect, useState } from "react";
import FileItem from "./FileItem";
import fileService from "../../../services/fileService";
import { FileDto } from "../../../dtos/FileDto";
const FilesContainer = () => {
    const [fileList, setFileList] = useState<FileDto[]>([]);
  
    useEffect ( () => {
      const fetchFiles= async () => {
        try {
            setFileList(await fileService.getAllFiles())
        } catch (error) {
            console.error("Error fetching files:", error)
        }
      }
      fetchFiles()
    }, [])
    return (
    <div className="container-md d-flex flex-wrap align-items-start">
        {fileList && fileList.map((file) =>(
            <FileItem fileDto={file}/>
        ))}
    </div>
    )
}
export default FilesContainer

