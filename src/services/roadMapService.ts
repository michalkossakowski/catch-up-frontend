import axiosInstance from '../../axiosConfig';
import { RoadMapDto } from '../dtos/RoadMapDto';
import { StatusEnum } from '../Enums/StatusEnum';


export const addRoadMap = async (roadMap: RoadMapDto): Promise<RoadMapDto> => {
    try {
        const response = await axiosInstance.post<RoadMapDto>('/RoadMap/Add', roadMap);
        return response.data;
    } catch (error: any) {
        handleError('addRoadMap', error);
        throw error;
    }
};

export const editRoadMap = async (roadMap: RoadMapDto): Promise<RoadMapDto> => {
    try {
        const response = await axiosInstance.put<RoadMapDto>('/RoadMapPoint/Edit/' + roadMap.id, roadMap);
        return response.data;
    } catch (error: any) {
        handleError('editRoadMap', error);
        throw error;
    }
};

export const setRoadMapStatus = async (roadMapId: number, status :StatusEnum): Promise<RoadMapDto> => {
    try {
        const response = await axiosInstance.patch<RoadMapDto>(`/RoadMap/SetStatus/${roadMapId}/${status}`);
        return response.data;
    } catch (error: any) {
        handleError('setRoadMapStatus', error);
        throw error;
    }
};

export const deleteRoadMap = async (roadMapId: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete('/RoadMap/Delete/' + roadMapId);
        return response.data;
    } catch (error: any) {
        handleError('deleteRoadMap', error);
        throw error;
    }
};

export const getRoadMaps = async (): Promise<RoadMapDto[]> => {
    try {
        const response = await axiosInstance.get<RoadMapDto[]>('/RoadMap/GetAll');
        return response.data;
    } catch (error: any) {
        handleError('getRoadMaps', error);
        throw error;
    }
};


export const getMyRoadMaps = async (): Promise<RoadMapDto[]> => {
    try {
        const response = await axiosInstance.get<RoadMapDto[]>('/RoadMap/GetMyRoadMaps');
        return response.data;
    } catch (error: any) {
        handleError('getMyRoadMaps', error);
        throw error;
    }
};



export const getByNewbieId = async (newbieId: string): Promise<RoadMapDto[]> => {
    try {
        const response = await axiosInstance.get<RoadMapDto[]>('/RoadMap/GetByNewbieId/' + newbieId);
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