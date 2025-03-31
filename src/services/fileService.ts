import { FileDto } from '../dtos/FileDto';
import axiosInstance from '../../axiosConfig';
const fileService =
{
    uploadFile: async (
        file: File, 
        materialId?: number, 
        ownerId?: string, 
        dateOfUpload?: Date,
         onProgress?: (percent: number) => void
    ): Promise<{ message: string; fileDto: FileDto; materialId: number }> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post<{ message: string; fileDto: FileDto; materialId: number }>
            (
                `File/Upload`,
                formData,
                {
                    params: {
                        ...(materialId && { materialId }), 
                        ...(ownerId && { ownerId }), 
                        ...(dateOfUpload && { dateOfUpload })
                    },
                    headers: {'Content-Type': 'multipart/form-data'},
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress?.(percentCompleted);
                        }
                    }
                }
            );
            return response.data;
        }
        catch (error)
        {
            handleError('uploadFile', error);
            throw error;
        }
    },

    downloadFile: async (fileId: number): Promise<Blob> => {
        try
        {
            const response = await axiosInstance.get(`/File/Download/${fileId}`, {responseType: 'blob',});
            return response.data;
        }
        catch (error)
        {
            console.error('File download error:', error);
            throw error;
        }
    },

    getFileById: async (fileId: number): Promise<FileDto> => {
        try {
            const response = await axiosInstance.get<FileDto>(`/File/Get/${fileId}`);
            return response.data;
        } catch (error) {
            console.error('Get file by id error:', error);
            throw error;
        }
    },

    getAllFiles: async(): Promise<FileDto[]> => {
        try
        {
            const response = await axiosInstance.get<FileDto[]>(`/File/GetAllFiles`)
            return response.data
        }
        catch(error)
        {
            console.error('File get error:', error)
            throw error
        }
    },

    getAllFilesPagination: async(page: number, pageSize: number): Promise<{files: FileDto[], totalCount: number}> => {
        try
        {
            const response = await axiosInstance.get<{files: FileDto[], totalCount: number}>(`/File/GetAllFiles/${page}/${pageSize}`)
            return response.data
        }
        catch(error)
        {
            console.error('File get error:', error)
            throw error
        }
    },

    getAllOwnedFiles: async(userId: string): Promise<FileDto[]> => {
        try
        {
            const response = await axiosInstance.get<FileDto[]>(`/File/GetAllFiles/${userId}`)
            return response.data
        }
        catch(error)
        {
            console.error('File get error:', error)
            throw error
        }
    },

    getAllOwnedFilesPagination: async(userId: string, page: number, pageSize: number): Promise<{files: FileDto[], totalCount: number}> => {
        try
        {
            const response = await axiosInstance.get<{files: FileDto[], totalCount: number}>(`/File/GetAllFiles/${userId}/${page}/${pageSize}`)
            return response.data
        }
        catch(error)
        {
            console.error('File get error:', error)
            throw error
        }
    },

    changeFile: async(fileDto: FileDto): Promise<FileDto> => {
        try {
            const response = await axiosInstance.put<FileDto>(`/File/ChangeFile/`, fileDto);
            return response.data;
        } catch (error) {
            console.error('File change error:', error);
            throw error;
        }
    }
}
const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};
export default fileService;
