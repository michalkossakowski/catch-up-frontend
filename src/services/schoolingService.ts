import axiosInstance from "../../axiosConfig";
import { FullSchoolingDto } from "../dtos/FullSchoolingDto";

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
    deleteSchooling: async(schoolingId: number) => {
        try 
        {
            const response = await axiosInstance.delete(`/Schooling/ArchiveSchooling/${schoolingId}`)
            return response
        } 
        catch (error) 
        {
            console.error('Error removing schooling:', error)
            throw error
        }
    },
}
export default schoolingService