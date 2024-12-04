import React, { useState, useEffect } from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import Material from '../Material/Material';
import { addTaskContent, editTaskContent } from '../../services/taskContentService';
import './TaskContentEdit.css';
import { Button } from 'react-bootstrap';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories, searchCategories, addCategory, isUnique } from '../../services/categoryService';
import { Autocomplete, TextField } from '@mui/material';

interface TaskContentEditProps {
    taskContent?: TaskContentDto;
    isEditMode: boolean;
    onTaskContentEdited: () => void;
    categories: CategoryDto[];
}

const TaskContentEdit: React.FC<TaskContentEditProps> = ({ onTaskContentEdited, taskContent, isEditMode, categories }) => {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [materialsId, setMaterialsId] = useState<number | null>();
    const [creatorId, setCreatorId] = useState<string | null>();
    const [categoryId, setCategoryId] = useState<number | null>();
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [localCategories, setLocalCategories] = useState<CategoryDto[]>(categories);

    useEffect(() => {
        if (taskContent) {
            if (taskContent.categoryId) {
                const category = categories.find(c => c.id === taskContent.categoryId);
                setSelectedCategory(category || null);
            }
            
            setTitle(taskContent.title);
            setDescription(taskContent.description);
            setMaterialsId(taskContent.materialsId ?? null);
            setCreatorId(taskContent.creatorId ?? null);
            setCategoryId(taskContent.categoryId ?? null);
        }
        loadCategories();
    }, [taskContent]);

    const loadCategories = async () => {
        try {
            const result = await getCategories();
            setLocalCategories(result);
        } catch (error) {
            console.error('Błąd podczas ładowania kategorii:', error);
        }
    };

    const handleCategorySearch = async (searchValue: string) => {
        if (searchValue.trim()) {
            const filteredCategories = categories.filter(category => 
                (category.name || '').toLowerCase().includes(searchValue.toLowerCase())
            );
            setLocalCategories(filteredCategories);
        } else {
            setLocalCategories(categories);
        }
    };

    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        let finalCategoryId = categoryId;
        console.log('Submit - Initial values:', {
            selectedCategory,
            searchTerm,
            categoryId
        });

        if (selectedCategory && !selectedCategory.id && typeof searchTerm === 'string' && searchTerm.trim()) {
            console.log('Attempting to create new category:', searchTerm);
            try {
                const isNameUnique = await isUnique(searchTerm);
                console.log('Is category name unique:', isNameUnique);
                
                if (isNameUnique) {
                    const newCategory = await addCategory({ id: 0, name: searchTerm });
                    console.log('New category created:', newCategory);
                    
                    const updatedCategories = await getCategories();
                    const createdCategory = updatedCategories.find(c => 
                        (c.name || '').toLowerCase() === searchTerm.toLowerCase()
                    );
                    console.log('Found created category:', createdCategory);
                    
                    if (createdCategory) {
                        finalCategoryId = createdCategory.id;
                        console.log('Set finalCategoryId to:', finalCategoryId);
                    }
                }
            } catch (error) {
                console.error('Error creating category:', error);
            }
        } else {
            console.log('Conditions not met for category creation');
        }

        const taskContentDto: TaskContentDto = {
            id: isEditMode ? taskContent!.id : 0,
            title: title ?? '',
            description: description ?? '',
            materialsId: materialsId,
            creatorId: creatorId,
            categoryId: finalCategoryId
        };

        const updateTaskContent = isEditMode ? editTaskContent(taskContentDto) : addTaskContent(taskContentDto);

        updateTaskContent
            .then(() => {
                onTaskContentEdited();
                setTitle('');
                setDescription('');
                setMaterialsId(null);
                setCreatorId(null);
                setCategoryId(null);
            })
            .catch((error) => {
                console.error('Error saving TaskContent:', error);
            });
    };

    return (
        <section className='editBox'>
            <form onSubmit={handleSubmit} className="container-lg text-left">
                <h2>{isEditMode ? 'Edit TaskContent' : 'Add TaskContent'}</h2>
                <br />
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    />

                </div>

                <div className="form-group">
                    <Autocomplete
                        value={selectedCategory}
                        onChange={(_, newValue) => {
                            console.log('onChange value:', newValue);
                            if (typeof newValue === 'string') {
                                const newCategory = { id: 0, name: newValue };
                                setSelectedCategory(newCategory);
                                setSearchTerm(newValue);
                                setCategoryId(null);
                            } else if (newValue === null) {
                                setSelectedCategory(null);
                                setSearchTerm('');
                                setCategoryId(null);
                            } else {
                                setSelectedCategory(newValue);
                                setCategoryId(newValue.id);
                                setSearchTerm(newValue.name || '');
                            }
                        }}
                        onInputChange={(_, newInputValue) => {
                            console.log('onInputChange value:', newInputValue);
                            setSearchTerm(newInputValue);
                            if (newInputValue) {
                                const newCategory = { id: 0, name: newInputValue };
                                setSelectedCategory(newCategory);
                            }
                            handleCategorySearch(newInputValue);
                        }}
                        options={categories}
                        getOptionLabel={(option: string | CategoryDto) => 
                            typeof option === 'string' ? option : (option.name || '')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Kategoria"
                                variant="outlined"
                                fullWidth
                            />
                        )}
                        freeSolo
                        className="mb-3"
                    />
                </div>
                
                {/*bez implementacji kategorii zdycha*/}
                {/*<br />*/} 
                {/*<div className="form-group">*/}
                {/*    <label htmlFor="categoryId">Category ID:</label>*/}
                {/*    <input*/}
                {/*        type="number"*/}
                {/*        id="categoryId"*/}
                {/*        className="form-control"*/}
                {/*        value={categoryId ?? ''}*/}
                {/*        onChange={(e) => setCategoryId(e.target.value ? parseInt(e.target.value) : null)}*/}
                {/*    />*/}
                {/*</div>*/}

                <Material
                    materialId={materialsId ?? 0}
                    showRemoveFile={true}
                    showDownloadFile={true}
                    showAddingFile={true}
                    materialCreated={materialCreated}
                />

                {materialsId && (
                    <Button variant="danger" onClick={() => setMaterialsId(null)}>
                        Remove materials
                    </Button>
                )}
                <br />
                <button type="submit" className="btn btn-primary">
                    {isEditMode ? 'Save Changes' : 'Submit'}
                </button>
            </form>
        </section>
    );
};

export default TaskContentEdit;
