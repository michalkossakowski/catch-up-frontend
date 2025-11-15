import axiosInstance from "../../axiosConfig";
import { SchoolingDto } from "../dtos/SchoolingDto";
import { SchoolingPartDto } from "../dtos/SchoolingPartDto";
import { SchoolingQueryParameters } from "../dtos/SchoolingQueryParametersDto";
import { PagedResponse } from "../interfaces/PagedResponse";

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
export const editSchoolingPart = async(schoolingPart: SchoolingPartDto) => {
    try 
    {
        const response = await axiosInstance.put(`/Schooling/EditSchoolingPart`, schoolingPart)
        return response
    } 
    catch (error) 
    {
        console.error('Error in editing schooling part:', error)
        throw error
    }
}

export const editSchooling = async(schooling: SchoolingDto) => {
    try 
    {
        schooling.content = schooling.content ?? "";
        for (let part of schooling.schoolingParts) {
            part.content = part.content ?? "";
        }
        console.log(schooling);
        const response = await axiosInstance.put(`/Schooling/EditSchooling/`, schooling)
        return response
    } 
    catch (error) 
    {
        console.error('Error in editing schooling:', error)
        throw error
    }
}
export const getSchoolings = async(params: SchoolingQueryParameters = {}): Promise<PagedResponse<SchoolingDto>> => {
    try {
        const response = await axiosInstance.get<PagedResponse<SchoolingDto>>(`/Schooling/Get`,{
            params:{
                pageNumber: params.pageNumber ?? 1,
                pageSize: params.pageSize ?? 10,
                titleFilter: params.titleFilter,
                categoryFilter: params.categoryFilter,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder ?? 'asc',
                mode: params.mode ?? 'all',
            }
        });
        return response.data;
    } catch (error) {
        handleError('Error while getting all schoolings', error);
        throw error;
    }
}
export const deleteSchooling = async(schoolingId: number) => {
    try 
    {
        const response = await axiosInstance.delete(`/Schooling/Delete/${schoolingId}`)
        return response
    }catch (error){
        console.error('Error in deleting schooling:', error)
        
    }
}

const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};