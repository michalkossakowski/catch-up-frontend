
import { RoadMapDto } from '../dtos/RoadMapDto';
import { StatusEnum } from '../Enums/StatusEnum';

let roadMaps: RoadMapDto[] = [
    { id: 1, newbieId: '2', title: 'React Onboarding', status: StatusEnum.InProgress },
    { id: 2, newbieId: '4', title: 'Node.js Onboarding', status: StatusEnum.ToDo },
];

export const addRoadMap = async (roadMap: RoadMapDto): Promise<RoadMapDto> => {
    console.log('Mocked addRoadMap called with roadMap:', roadMap);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRoadMap: RoadMapDto = { ...roadMap, id: Math.max(...roadMaps.map(r => r.id!)) + 1};
    roadMaps.push(newRoadMap);
    return newRoadMap;
};

export const editRoadMap = async (roadMap: RoadMapDto): Promise<RoadMapDto> => {
    console.log('Mocked editRoadMap called with roadMap:', roadMap);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = roadMaps.findIndex(r => r.id === roadMap.id);
    if (index === -1) {
        throw new Error('RoadMap not found');
    }
    roadMaps[index] = { ...roadMap};
    return roadMaps[index];
};

export const setRoadMapStatus = async (roadMapId: number, status: StatusEnum): Promise<RoadMapDto> => {
    console.log(`Mocked setRoadMapStatus called with roadMapId: ${roadMapId}, status: ${status}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const roadMap = roadMaps.find(r => r.id === roadMapId);
    if (!roadMap) {
        throw new Error('RoadMap not found');
    }
    roadMap.status = status;
    return roadMap;
};

export const deleteRoadMap = async (roadMapId: number, deleteTasksInside: boolean = false): Promise<any> => {
    console.log(`Mocked deleteRoadMap called with roadMapId: ${roadMapId}, deleteTasksInside: ${deleteTasksInside}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = roadMaps.findIndex(r => r.id === roadMapId);
    if (index !== -1) {
        roadMaps[index];
    }
    return { message: 'RoadMap deleted successfully' };
};

export const getRoadMaps = async (): Promise<RoadMapDto[]> => {
    console.log('Mocked getRoadMaps called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return roadMaps;
};

export const getMyRoadMaps = async (): Promise<RoadMapDto[]> => {
    console.log('Mocked getMyRoadMaps called');
    await new Promise(resolve => setTimeout(resolve, 500));
    // Assuming the current user is newbie '2'
    return roadMaps.filter(r => r.newbieId === '2');
};

export const getByNewbieId = async (newbieId: string): Promise<RoadMapDto[]> => {
    console.log(`Mocked getByNewbieId called with newbieId: ${newbieId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return roadMaps.filter(r => r.newbieId === newbieId);
};
