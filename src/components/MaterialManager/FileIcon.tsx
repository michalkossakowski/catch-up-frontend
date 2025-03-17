import { useEffect } from 'react';
import styles from './material.module.css';

interface FileIconProps {
    fileName: string;
    fileType: string;
    fileDate?: Date;
    fileContent?: File;
    downloadableFrag?: boolean;
}

const FileIcon: React.FC<FileIconProps> = ({fileName, fileType, fileDate, fileContent, downloadableFrag = false}) => 
{
    useEffect(() => {
        if (downloadableFrag) {
        }
    }, [downloadableFrag]); 

    const getFileIcon = () => {    
        if (fileType.startsWith("image/") || fileType.startsWith("video/")) // Nie pokazujemy ikon dla obrazów
        if (fileType === "application/pdf") return "bi-file-earmark-pdf"; 
        if (fileType.includes("word")) return "bi-file-earmark-word";
        if (fileType.includes("excel")) return "bi-file-earmark-excel";
        if (fileType.includes("zip")) return "bi-file-earmark-zip";
        return "bi-file-earmark"; // Domyślna ikona
    };

    const shortedFileName =  (name: string, limit: number = 32) => {
        if (name.length > limit) {
            return name.slice(0, limit) + "...";
        }
        return name;
    }

    return(
        <div className='d-flex flex-column mb-3 align-items-center text-center mb-3'>
            {fileType.startsWith("image/") && fileContent ? (
                <>
                    <img 
                        src={URL.createObjectURL(fileContent)} 
                        alt={fileName} 
                        className={`${styles.imageThumbnail} rounded shadow-sm`}
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className='p-1'>{fileName}</div>
                    <div className='p-1 small text-muted'>    
                        {fileDate
                        ? new Date(fileDate).toLocaleString("pl-PL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                            : "Brak daty"}
                    </div>
                </>
            ) : fileType.startsWith("video/") && fileContent ? (
                <>
                    <video 
                        controls 
                        className={`${styles.videoThumbnail} rounded shadow-sm`}
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    > 
                    Twoja przeglądarka nie obsługuje elementu wideo.
                        <source src={URL.createObjectURL(fileContent)} type={fileType} />
                    </video>
                    <div className='p-1'>{shortedFileName(fileName)}</div>
                    <div className='p-1 small text-muted'>    
                        {fileDate
                        ? new Date(fileDate).toLocaleString("pl-PL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                            : "Brak daty"}
                    </div>
                </>
            ):
            (
                <>
                    <div className='p-1'><i className={`${getFileIcon()} ${styles.fileIconSize} `}></i></div>
                    <div className='p-1'>{shortedFileName(fileName)}</div>
                    <div className='p-1 small text-muted'>    
                        {fileDate
                        ? new Date(fileDate).toLocaleString("pl-PL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            })
                            : "Brak daty"}
                    </div>
                </>
            )}
        </div>
    )
}
export default FileIcon;
