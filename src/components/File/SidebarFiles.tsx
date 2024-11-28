import React, { useEffect, useState } from "react";
import fileService from '../../services/fileService';
import { FileDto } from '../../dtos/FileDto';


const SelectFile: React.FC = () => {
  const [files, setFiles] = useState<FileDto[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileDto[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fileList = await fileService.getAllFiles()
        setFiles(fileList)
        setFilteredFiles(fileList)
      } catch (error) 
      {
        console.error("Error fetching files:", error)
      }
    }

    fetchFiles()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)
    const filtered = files.filter((file) =>
      (file.name ||" ").toLowerCase().includes(query)
    )
    setFilteredFiles(filtered)
  }

  return (
    <div className="container" style={{height: "100px"}}>
        <h1>Files</h1>
        <div className="search-bar">
            <input
            type="text"
            placeholder="Search files by title..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control"
            />
        </div>
        <table className="table table-striped shadow p-3 mt-3 mb-5 bg-body-tertiary rounded">
            <thead>
                <tr>
                    <th scope="col">File Name</th>
                    {/* <th scope="col">Type</th> */}
                </tr>
            </thead>
        <tbody className="table-group-divider">

        {filteredFiles.map((file) => (
        <>
            <tr key={file.id}>
                <td>{file.name}</td>
                {/* <td>{file.type}</td> */}
            </tr>
        </>
        ))}
        </tbody>
    </table>
    </div>
  );
};

export default SelectFile

