
import { CategoryDto } from '../dtos/CategoryDto';

interface CategoryResponse {
	message: string;
	category: CategoryDto;
}

let categories: CategoryDto[] = [
    { id: 1, name: 'Frontend' },
    { id: 2, name: 'Backend' },
    { id: 3, name: 'DevOps' },
];

export const getCategories = async (): Promise<CategoryDto[]> => {
    console.log('Mocked getCategories called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return categories;
};

export const getById = async (id: string): Promise<CategoryDto[]> => {
    console.log(`Mocked getById called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const category = categories.filter(c => c.id === parseInt(id));
    return category;
};

export const addCategory = async (category: CategoryDto): Promise<CategoryResponse> => {
    console.log('Mocked addCategory called with category:', category);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCategory: CategoryDto = { ...category, id: Math.max(...categories.map(c => c.id)) + 1 };
    categories.push(newCategory);
    return { message: 'Category added successfully', category: newCategory };
};

export const editCategory = async (category: CategoryDto): Promise<CategoryDto> => {
    console.log('Mocked editCategory called with category:', category);
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = categories.findIndex(c => c.id === category.id);
    if (index === -1) {
        throw new Error('Category not found');
    }
    categories[index] = category;
    return categories[index];
};

export const deleteCategory = async (id: number): Promise<any> => {
    console.log(`Mocked deleteCategory called with id: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    categories = categories.filter(c => c.id !== id);
    return { message: 'Category deleted successfully' };
};

export const searchCategories = async (name: string): Promise<CategoryDto[]> => {
    console.log(`Mocked searchCategories called with name: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return categories.filter(c => c.name!.toLowerCase().includes(name.toLowerCase()));
};

export const isUnique = async (name: string): Promise<boolean> => {
    console.log(`Mocked isUnique called with name: ${name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return !categories.some(c => c.name!.toLowerCase() === name.toLowerCase());
};

export const getCategoriesCount = async (): Promise<number> => {
    console.log('Mocked getCategoriesCount called');
    await new Promise(resolve => setTimeout(resolve, 500));
    return categories.length;
};
