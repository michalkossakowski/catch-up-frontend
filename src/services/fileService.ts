import { FileDto } from '../dtos/FileDto';
import axiosInstance from '../../axiosConfig';
const fileService = 
{
    uploadFile: async (file: File, materialId?: number): Promise<{ message: string; fileDto: FileDto; materialId: number }> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post<{ message: string; fileDto: FileDto; materialId: number }>
            (
                `File/Upload`,
                formData,
                {
                    params: materialId ? { materialId } : {},
                    headers: {'Content-Type': 'multipart/form-data'},
                }
            );
            console.log("File uploaded", response)
            return response.data;
        } 
        catch (error) 
        {
            console.error('File upload error:', error);
            throw error;
        }
    },

    downloadFile: async (fileId: number): Promise<Blob> => {
        try 
        {
            const response = await axiosInstance.get(`/File/Download/${fileId}`, {responseType: 'blob',});
            console.log("File downloaded")
            return response.data;
        } 
        catch (error) 
        {
            console.error('File download error:', error);
            throw error;
        }
    },
    getAllFiles: async(): Promise<FileDto[]> => {
        try
        {
            const response = await axiosInstance.get<{message: string, filesDto: FileDto[]}>(`/File/GetAllFiles`)
            console.log("File all:", response.data.message);
            return response.data.filesDto
        }
        catch(error)
        {
            console.error('Material get error:', error)
            throw error
        }   
    },
}

export default fileService;
