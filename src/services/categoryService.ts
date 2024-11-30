import axiosInstance from '../../axiosConfig';
import { CategoryDto } from '../dtos/CategoryDto';

interface CategoryResponse {
	message: string;
	category: CategoryDto;
}

export const getCategories = async (): Promise<CategoryDto[]> => {
	try {
		const response = await axiosInstance.get<CategoryDto[]>('/Category/GetAll');
		return response.data;
	} catch (error: any) {
		handleError('getCategories', error);
		throw error;
	}
};

export const getById = async (id: string): Promise<CategoryDto[]> => {
	try {
		const response = await axiosInstance.get<CategoryDto[]>('/Category/GetById/' + id);
		return response.data;
	} catch (error: any) {
		handleError('getById', error);
		throw error;
	}
};

export const addCategory = async (category: CategoryDto): Promise<CategoryResponse> => {
	try {
		const response = await axiosInstance.post<CategoryResponse>('/Category/Add', category);
		console.log('Category creation response:', response);
		return response.data;
	} catch (error) {
		console.error('Error in addCategory:', error);
		throw error;
	}
};

export const editCategory = async (category: CategoryDto): Promise<CategoryDto> => {
	try {
		const response = await axiosInstance.put<CategoryDto>('/Category/Edit/' + category.id, category);
		return response.data;
	} catch (error: any) {
		handleError('editCategory', error);
		throw error;
	}
};

export const deleteCategory = async (id: number): Promise<any> => {
	try {
		const response = await axiosInstance.delete('/Category/Delete/' + id);
		return response.data;
	} catch (error: any) {
		handleError('deleteCategory', error);
		throw error;
	}
};

export const searchCategories = async (name: string): Promise<CategoryDto[]> => {
	try {
		const response = await axiosInstance.get<CategoryDto[]>('/Category/SearchCategories/' + name);
		return response.data;
	} catch (error: any) {
		handleError('searchCategories', error);
		throw error;
	}
};

export const isUnique = async (name: string): Promise<boolean> => {
	try {
		const response = await axiosInstance.get<boolean>('/Category/IsUnique/' + name);
		return response.data;
	} catch (error: any) {
		handleError('isUnique', error);
		throw error;
	}
}

export const getCategoriesCount = async (): Promise<number> => {
	try {
		const response = await axiosInstance.get<number>('/Category/GetCount');
		return response.data;
	} catch (error: any) {
		handleError('getCount', error);
		throw error;
	}
}


function handleError(method: string, error: any) {
	console.error(`Error in categoryService.${method}: ${error}`);
}