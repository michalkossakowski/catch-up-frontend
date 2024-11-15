import axios from 'axios';
import { FileDto } from '../dtos/FileDto';
const BASE_URL = 'https://localhost:7097/api/File/';
const fileService = 
{
    uploadFile: async (file: File, materialId?: number): Promise<{ message: string; fileDto: FileDto; materialId: number }> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post<{ message: string; fileDto: FileDto; materialId: number }>
            (
                `${BASE_URL}Upload`,
                formData,
                {
                    params: materialId 
                    ? { materialId } 
                    : {},headers: {'Content-Type': 'multipart/form-data',
                    },
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
            const response = await axios.get(`${BASE_URL}Download/${fileId}`, {responseType: 'blob',});
            console.log("File downloaded")
            return response.data;
        } 
        catch (error) 
        {
            console.error('File download error:', error);
            throw error;
        }
    },
}

export default fileService;
