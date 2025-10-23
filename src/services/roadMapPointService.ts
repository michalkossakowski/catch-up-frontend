
import { RoadMapPointDto } from '../dtos/RoadMapPointDto';
import { StatusEnum } from '../Enums/StatusEnum';

let roadMapPoints: RoadMapPointDto[] = [
    { id: 1, roadMapId: 1, name: 'Introduction to React', status: StatusEnum.Done},
    { id: 2, roadMapId: 1, name: 'React Components', status: StatusEnum.InProgress},
    { id: 3, roadMapId: 1, name: 'React State Management', status: StatusEnum.ToDo},
    { id: 4, roadMapId: 2, name: 'Node.js Basics', status: StatusEnum.Done},
];

export const addRoadMapPoint = async (roadMapPoint: RoadMapPointDto): Promise<RoadMapPointDto> => {
    console.log('Mocked addRoadMapPoint called with roadMapPoint:', roadMapPoint);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPoint: RoadMapPointDto = { ...roadMapPoint, id: Math.max(...roadMapPoints.map(p => p.id!)) + 1};
    roadMapPoints.push(newPoint);
    return newPoint;
};

export const editRoadMapPoint = async (roadMapPoint: RoadMapPointDto): Promise<RoadMapPointDto> => {
    console.log('Mocked editRoadMapPoint called with roadMapPoint:', roadMapPoint);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = roadMapPoints.findIndex(p => p.id === roadMapPoint.id);
    if (index === -1) {
        throw new Error('RoadMapPoint not found');
    }
    roadMapPoints[index] = { ...roadMapPoint};
    return roadMapPoints[index];
};

export const setRoadMapPointStatus = async (roadMapPointId: number, status: StatusEnum): Promise<RoadMapPointDto> => {
    console.log(`Mocked setRoadMapPointStatus called with roadMapPointId: ${roadMapPointId}, status: ${status}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const point = roadMapPoints.find(p => p.id === roadMapPointId);
    if (!point) {
        throw new Error('RoadMapPoint not found');
    }
    point.status = status;
    return point;
};

export const deleteRoadMapPoint = async (roadMapPointId: number, deleteTasksInside: boolean = false): Promise<any> => {
    console.log(`Mocked deleteRoadMapPoint called with roadMapPointId: ${roadMapPointId}, deleteTasksInside: ${deleteTasksInside}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = roadMapPoints.findIndex(p => p.id === roadMapPointId);
    if (index !== -1) {
        roadMapPoints[index];
    }
    return { message: 'RoadMapPoint deleted successfully' };
};

export const getByRoadMapId = async (roadMapId: number): Promise<RoadMapPointDto[]> => {
    console.log(`Mocked getByRoadMapId called with roadMapId: ${roadMapId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return roadMapPoints.filter(p => p.roadMapId === roadMapId);
};
