import axiosInstance from "../../axiosConfig";
import { FullSchoolingDto } from "../dtos/FullSchoolingDto";
import { SchoolingDto } from "../dtos/SchoolingDto";
import { SchoolingPartDto } from "../dtos/SchoolingPartDto";
import { SchoolingPartUpdateDto } from "../dtos/SchoolingPartUpdateDto";

export const getSchooling = async(schoolingId: number): Promise<SchoolingDto> =>{
    try
    {
        const response = await axiosInstance.get<SchoolingDto>(`/Schooling/Get/${schoolingId}`)
        return response.data
    }
    catch(error)
    {
        handleError('Error while getting schooling', error)
        throw error
    }  
}
export const getUserSchooling = async(schoolingId: number): Promise<SchoolingDto> =>{
    try
    {
        const response = await axiosInstance.get<SchoolingDto>(`/Schooling/GetUserSchooling/${schoolingId}`)
        return response.data
    }
    catch(error)
    {
        handleError('Error while getting schooling', error)
        throw error
    }  
}
export const getSchoolingPart = async(schoolingPartId: number): Promise<SchoolingPartDto> =>{
    try
    {
        const response = await axiosInstance.get<SchoolingPartDto>(`/Schooling/GetSchoolingPart/${schoolingPartId}`)
        return response.data
    }
    catch(error)
    {
        handleError('Error while getting schooling Part', error)
        throw error
    }  
}
export const updateUserSchoolingPartState = async(schoolingUserPartId: number, partId: number, state: boolean): Promise<SchoolingPartDto> =>{
    try
    {
        const response = await axiosInstance.patch(`/Schooling/ChangeUserSchoolingPartState/${schoolingUserPartId}/${partId}/${state}`)
        return response.data
    }
    catch(error)
    {
        handleError('Error while updating schooling Part state', error)
        throw error
    }  
}
export const editSchoolingPart = async(schoolingPart: SchoolingPartUpdateDto) => {
    try 
    {
        const response = await axiosInstance.put(`/Schooling/EditSchoolingPart/`, schoolingPart)
        return response
    } 
    catch (error) 
    {
        console.error('Error in editing schooling part:', error)
        throw error
    }
}

//To Delete
const schoolingService = 
{    
    getFullSchooling: async(schoolingId: number): Promise<FullSchoolingDto> =>{
        try
        {
            const response = await axiosInstance.get<FullSchoolingDto>(`/Schooling/GetFull/${schoolingId}`)
            return response.data
        }
        catch(error)
        {
            console.error('Error while getting schooling', error)
            throw error
        }  
    },
    getAllFullSchooling: async(): Promise<FullSchoolingDto[]> =>{
        try
        {
            const response = await axiosInstance.get<FullSchoolingDto[]>(`/Schooling/GetAllFull/`)
            return response.data
        }
        catch(error)
        {
            console.error('Schooling list get error:', error)
            throw error
        }  
    },
    getAllFullSchoolingOfUser: async(userId: string): Promise<FullSchoolingDto[]> =>{
        try
        {
            const response = await axiosInstance.get<FullSchoolingDto[]>(`/Schooling/GetAllFull/${userId}`)
            return response.data
        }
        catch(error)
        {
            console.error('Schooling list get error:', error)
            throw error
        }  
    },
    archiveSchooling: async(schoolingId: number) => {
        try 
        {
            const response = await axiosInstance.delete(`/Schooling/ArchiveSchooling/${schoolingId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error in removing schooling:', error)
            throw error
        }
    },

    archiveSchoolingPart: async(schoolingPartId: number) => {
        try 
        {
            const response = await axiosInstance.delete(`/Schooling/ArchiveSchoolingPart/${schoolingPartId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error in removing schooling part:', error)
            throw error
        }
    },
    
    archiveMaterialFromSchoolingPart: async(schoolingPartId: number, materialId: number) => {
        try 
        {
            const response = await axiosInstance.delete(`/Schooling/ArchiveMaterialFromSchooling/${schoolingPartId}/${materialId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error in removing material:', error)
            throw error
        }
    },
    createSchooling: async(schooling: SchoolingDto): Promise<FullSchoolingDto> => {
        try 
        {
            const response = await axiosInstance.post(`/Schooling/Create/`, schooling)
            return response.data
        } 
        catch (error) 
        {
            console.error('Error in creating schooling:', error)
            throw error
        }
    },
    createSchoolingPart: async(schoolingPart: SchoolingPartDto, schoolingId: number) : Promise<SchoolingPartDto> => {
        try 
        {
            const response = await axiosInstance.post<SchoolingPartDto>(`/Schooling/AddSchoolingPart/${schoolingId}`, schoolingPart)
            return response.data
        } 
        catch (error) 
        {
            console.error('Error in creating schooling part:', error)
            throw error
        }
    },

    editSchooling: async(schooling: SchoolingDto) => {
        try 
        {
            const response = await axiosInstance.put(`/Schooling/EditSchooling/`, schooling)
            return response
        } 
        catch (error) 
        {
            console.error('Error in editing schooling:', error)
            throw error
        }
    },
}
export default schoolingService

const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};