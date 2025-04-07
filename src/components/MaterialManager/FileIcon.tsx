import { t } from 'i18next';
import styles from './material.module.css';

interface FileIconProps {
    fileName: string;
    fileType: string;
    fileDate?: Date;
    fileContent?: File;
    onClick?: () => void;
}

const FileIcon: React.FC<FileIconProps> = ({
    fileName, 
    fileType, 
    fileDate, 
    fileContent, 
    onClick
    }) => 
{

    const getFileIcon = () => {    
        if (fileType.startsWith("image/") || fileType.startsWith("video/")) // Nie pokazujemy ikon dla obrazów
        if (fileType === "application/pdf") return "bi-file-earmark-pdf"; 
        if (fileType.includes("word")) return "bi-file-earmark-word";
        if (fileType.includes("excel")) return "bi-file-earmark-excel";
        if (fileType.includes("zip")) return "bi-file-earmark-zip";
        return "bi-file-earmark"; // Domyślna ikona
    };

    const shortedFileName =  (name: string, limit: number = 24) => {
        if (name.length > limit) {
            return name.slice(0, limit) + "...";
        }
        return name;
    }

    return(
        <div className='d-flex flex-column mb-3 align-items-center text-center mb-3' onClick={onClick} style={{cursor: 'pointer'}}>
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
                </>
            ) : fileType.startsWith("video/") && fileContent ? (
                <>
                    <video 
                        controls 
                        className={`${styles.videoThumbnail} rounded shadow-sm`}
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    > 
                    $t('your-browser-does-not-support-the-video-element')  
                    <source src={URL.createObjectURL(fileContent)} type={fileType} />
                    </video>
                </>
            ):
            (
                <>
                    <div className='p-1'><i className={`${getFileIcon()} ${styles.fileIconSize} `}></i></div>
                </>
            )}
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
                    : t('brak-daty')}
            </div>
        </div>
    )
}
export default FileIcon;
