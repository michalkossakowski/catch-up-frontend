import React, { useState, useEffect } from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { addTaskContent, editTaskContent } from '../../services/taskContentService';
import { Button, Alert } from 'react-bootstrap';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories, addCategory, isUnique } from '../../services/categoryService';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useAuth } from '../../Provider/authProvider';
import MaterialItem from '../MaterialManager/MaterialItem';
import NotificationToast from '../Toast/NotificationToast';
import './TaskContentEdit.scss';
const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'var(--bs-border-color)',
        },
        '&:hover fieldset': {
            borderColor: 'var(--bs-border-color)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#86b7fe',
        },
        padding: 0,
        '& input': {
            color: 'var(--bs-body-color)',
        }
    },
    '& .MuiInputLabel-root': {
        display: 'none',
    },
    '& .MuiOutlinedInput-input': {
        padding: '0.375rem 0.75rem',
        backgroundColor: 'var(--bs-body-bg)',
    }
});

interface TaskContentEditProps {
    taskContent?: TaskContentDto;
    isEditMode: boolean;
    onTaskContentEdited: (taskContent: TaskContentDto) => void;
    categories: CategoryDto[];
    onCancel: () => void;
}

const TaskContentEdit: React.FC<TaskContentEditProps> = ({ 
    onTaskContentEdited, 
    taskContent, 
    isEditMode, 
    categories, 
    onCancel
}) => {
    const [title, setTitle] = useState<string>(taskContent?.title ?? '');
    const [description, setDescription] = useState<string>(taskContent?.description ?? '');
    const [materialsId, setMaterialsId] = useState<number | null>(taskContent?.materialsId ?? null);
    const [categoryId, setCategoryId] = useState<number | null>(taskContent?.categoryId ?? null);
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [localCategories, setLocalCategories] = useState<CategoryDto[]>(categories);
    const { user } = useAuth();
    const [key, setKey] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (taskContent) {
            if (taskContent.categoryId) {
                const category = categories.find(c => c.id === taskContent.categoryId);
                setSelectedCategory(category || null);
            }

            setTitle(taskContent.title);
            setDescription(taskContent.description);
            setMaterialsId(taskContent.materialsId ?? null);
            setCategoryId(taskContent.categoryId ?? null);
        }
        loadCategories();
    }, [taskContent, categories]);

    const loadCategories = async () => {
        try {
            const result = await getCategories();
            setLocalCategories(result);
        } catch (error) {
            console.error('Error loading categories:', error);
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

    const validateForm = (): boolean => {
        if (!title?.trim()) {
            setToastMessage("Title is required");
            setToastColor('red');
            setShowToast(true);
            return false;
        }
        if (!user?.id) {
            setToastMessage("User must be logged in");
            setToastColor('red');
            setShowToast(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        let finalCategoryId = categoryId;

        if (selectedCategory && !selectedCategory.id && typeof searchTerm === 'string' && searchTerm.trim()) {
            try {
                const isNameUnique = await isUnique(searchTerm);

                if (isNameUnique) {
                    await addCategory({ id: 0, name: searchTerm });

                    const updatedCategories = await getCategories();
                    const createdCategory = updatedCategories.find(c =>
                        (c.name || '').toLowerCase() === searchTerm.toLowerCase()
                    );

                    if (createdCategory) {
                        finalCategoryId = createdCategory.id;
                    }
                }
            } catch (error) {
                console.error('Error creating category:', error);
                setToastMessage('Error creating category');
                setToastColor('red');
                setShowToast(true);
                return;
            }
        }

        const taskContentDto: TaskContentDto = {
            id: isEditMode ? taskContent!.id : 0,
            title: title ?? '',
            description: description ?? '',
            materialsId: materialsId,
            creatorId: user?.id,
            categoryId: finalCategoryId
        };

        try {
            if (isEditMode) {
                await editTaskContent(taskContentDto);
                setToastMessage('Task content updated successfully');
            } else {
                await addTaskContent(taskContentDto);
                setToastMessage('Task content created successfully');
            }
            setToastColor('green');
            setShowToast(true);
            
            onTaskContentEdited(taskContentDto);
        } catch (error) {
            console.error('Error saving TaskContent:', error);
            setToastMessage('Error saving task content');
            setToastColor('red');
            setShowToast(true);
        }
    };

    return (
        <section className='editBox task-content-edit'>
            {showAlert && (
                <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="container-lg text-left">
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
                    <label htmlFor="category">Category:</label>
                    <Autocomplete
                        key={key}
                        value={selectedCategory}
                        onChange={(_, newValue) => {
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
                            setSearchTerm(newInputValue);
                            if (newInputValue) {
                                const newCategory = { id: 0, name: newInputValue };
                                setSelectedCategory(newCategory);
                            }
                            handleCategorySearch(newInputValue);
                        }}
                        options={localCategories}
                        getOptionLabel={(option: string | CategoryDto) =>
                            typeof option === 'string' ? option : (option.name || '')}
                        renderInput={(params) => (
                            <StyledTextField
                                {...params}
                                variant="outlined"
                                fullWidth
                                id="category"
                            />
                        )}
                        freeSolo
                        className="mb-3"
                    />
                </div>
                
                <div className="form-group mb-4">
                    <MaterialItem
                        materialId={materialsId ?? 0} 
                        materialCreated={materialCreated} 
                        enableAddingFile={true}
                        enableDownloadFile={true}
                        enableRemoveFile={true}
                        enableEdittingMaterialName={true}
                        enableEdittingFile={true}
                        nameTitle="Task Materials"
                        showMaterialName={true}
                    />
                </div>

                <div className='buttonBox'>
                    <Button type="submit" variant="primary">
                        {isEditMode ? 'Save Changes' : 'Add new Task Content'}
                    </Button>
                    <Button variant="danger" onClick={onCancel}>
                        Cancel 
                    </Button>
                    {materialsId && (
                        <Button variant="secondary" onClick={() => setMaterialsId(null)}>
                            Remove materials
                        </Button>
                    )}
                </div>
            </form>
            
            <NotificationToast
                show={showToast}
                title="Task Content Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </section>
    );
};

export default TaskContentEdit;
