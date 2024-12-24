import axiosInstance from '../../axiosConfig';
import { RoadMapPointDto } from '../dtos/RoadMapPointDto';
import { StatusEnum } from '../Enums/StatusEnum';

export const addRoadMapPoint = async (roadMapPoint: RoadMapPointDto): Promise<RoadMapPointDto> => {
    try {
        const response = await axiosInstance.post<RoadMapPointDto>('/RoadMapPoint/Add', roadMapPoint);
        return response.data;
    } catch (error: any) {
        handleError('addRoadMap', error);
        throw error;
    }
};


export const editRoadMapPoint = async (roadMapPoint: RoadMapPointDto): Promise<RoadMapPointDto> => {
    try {
        const response = await axiosInstance.put<RoadMapPointDto>('/RoadMapPoint/Edit/' + roadMapPoint.id, roadMapPoint);
        return response.data;
    } catch (error: any) {
        handleError('editRoadMap', error);
        throw error;
    }
};

export const setRoadMapPointStatus = async (roadMapPointId: number, status :StatusEnum): Promise<RoadMapPointDto> => {
    try {
        const response = await axiosInstance.patch<RoadMapPointDto>(`/RoadMapPoint/SetStatus/${roadMapPointId}/${status}`);
        return response.data;
    } catch (error: any) {
        handleError('setRoadMapPointStatus', error);
        throw error;
    }
};

export const deleteRoadMapPoint = async (roadMapPointId: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete('/RoadMapPoint/Delete/' + roadMapPointId);
        return response.data;
    } catch (error: any) {
        handleError('deleteRoadMap', error);
        throw error;
    }
};


export const getByRoadMapId = async (roadMapId: number): Promise<RoadMapPointDto[]> => {
    try {
        const response = await axiosInstance.get<RoadMapPointDto[]>('/RoadMapPoint/GetByRoadMapId/' + roadMapId);
        return response.data;
    } catch (error: any) {
        handleError('getByNewbieId', error);
        throw error;
    }
};

const handleError = (operation: string, error: any): void => {
    console.error(`${operation} failed:`, error);
    if (!error.response) {
        throw new Error('API is not available');
    }
    throw new Error(error.response.data?.message || 'An unexpected error occurred');
};