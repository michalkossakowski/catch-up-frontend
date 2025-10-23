
import { SchoolingDto } from "../dtos/SchoolingDto";
import { SchoolingPartDto } from "../dtos/SchoolingPartDto";
import { SchoolingPartUpdateDto } from "../dtos/SchoolingPartUpdateDto";
import { SchoolingQueryParameters } from "../dtos/SchoolingQueryParametersDto";
import { PagedResponse } from "../interfaces/PagedResponse";

let schoolings: SchoolingDto[] = [
    { id: 1, title: 'React Fundamentals', categoryId: 1},
    { id: 2, title: 'Advanced Node.js', categoryId: 2 },
];

export const getSchooling = async (schoolingId: number): Promise<SchoolingDto> => {
    console.log(`Mocked getSchooling called with schoolingId: ${schoolingId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const schooling = schoolings.find(s => s.id === schoolingId);
    if (!schooling) {
        throw new Error('Schooling not found');
    }
    return schooling;
};

export const getUserSchooling = async (schoolingId: number): Promise<SchoolingDto> => {
    console.log(`Mocked getUserSchooling called with schoolingId: ${schoolingId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const schooling = schoolings.find(s => s.id === schoolingId && !s.isDeleted);
    if (!schooling) {
        throw new Error('Schooling not found');
    }
    return schooling; // In a real scenario, this would be user-specific
};

export const getSchoolingPart = async (schoolingPartId: number): Promise<SchoolingPartDto> => {
    console.log(`Mocked getSchoolingPart called with schoolingPartId: ${schoolingPartId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    for (const schooling of schoolings) {
        const part = schooling.parts?.find(p => p.id === schoolingPartId && !p.isDeleted);
        if (part) {
            return part;
        }
    }
    throw new Error('Schooling part not found');
};

export const updateUserSchoolingPartState = async (schoolingUserPartId: number, partId: number, state: boolean): Promise<SchoolingPartDto> => {
    console.log(`Mocked updateUserSchoolingPartState called with schoolingUserPartId: ${schoolingUserPartId}, partId: ${partId}, state: ${state}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // This is a mock, so we just return the part as if it was updated.
    return getSchoolingPart(partId);
};

export const editSchoolingPart = async (schoolingPart: SchoolingPartUpdateDto) => {
    console.log('Mocked editSchoolingPart called with schoolingPart:', schoolingPart);
    await new Promise(resolve => setTimeout(resolve, 500));
    for (const schooling of schoolings) {
        const index = schooling.parts?.findIndex(p => p.id === schoolingPart.id) ?? -1;
        if (index !== -1) {
            //schooling.parts[index] = { ...schooling.parts[index], ...schoolingPart };
            break;
        }
    }
    return { status: 200, data: 'Schooling part edited' };
};

export const editSchooling = async (schooling: SchoolingDto) => {
    console.log('Mocked editSchooling called with schooling:', schooling);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = schoolings.findIndex(s => s.id === schooling.id);
    if (index !== -1) {
        schoolings[index] = { ...schooling, isDeleted: false };
    }
    return { status: 200, data: 'Schooling edited' };
};

export const getSchoolings = async (params: SchoolingQueryParameters = {}): Promise<PagedResponse<SchoolingDto>> => {
    console.log('Mocked getSchoolings called with params:', params);
    await new Promise(resolve => setTimeout(resolve, 500));
    let filteredSchoolings = schoolings.filter(s => !s.isDeleted);
    // Apply filters, sorting, etc. based on params (simplified for mock)
    const pageNumber = params.pageNumber ?? 1;
    const pageSize = params.pageSize ?? 10;
    const paginatedSchoolings = filteredSchoolings.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    return { data: paginatedSchoolings, totalCount: filteredSchoolings.length, pageNumber, pageSize };
};
