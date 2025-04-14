import React, { useState, useEffect } from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { addTaskContent, editTaskContent } from '../../services/taskContentService';
import './TaskContentEdit.css';
import { Button, Modal, Accordion } from 'react-bootstrap';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories, addCategory, isUnique } from '../../services/categoryService';
import { Autocomplete, TextField, styled } from '@mui/material';
import { useAuth } from '../../Provider/authProvider';
import { DndContext } from '@dnd-kit/core';
import { Alert } from 'react-bootstrap';
import { MaterialDto } from '../../dtos/MaterialDto';
import materialService from '../../services/materialService';
import MaterialSelector from '../Material/MaterialSelector';
import Material from '../Material/Material';
import MaterialItem from '../Material/DndMaterial/MaterialItem';
import FilesContainer from '../Material/DndMaterial/FilesContainer';
import styles from '../Material/Material.module.css';
import NotificationToast from '../Toast/NotificationToast';

const formContainerStyles = {
    centered: {
        margin: '0 auto',
        transition: 'margin 0.5s ease, transform 0.5s ease',
        maxWidth: '800px'
    },
    left: {
        margin: '0',
        transition: 'margin 0.5s ease, transform 0.5s ease',
        maxWidth: '800px'
    }
};

interface TaskContentEditProps {
    taskContent?: TaskContentDto;
    isEditMode: boolean;
    onTaskContentEdited: () => void;
    categories: CategoryDto[];
    selectedMaterialIds?: number[];
    formHeader?: React.ReactNode;
}

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

const TaskContentEdit: React.FC<TaskContentEditProps> = ({ onTaskContentEdited, taskContent, isEditMode, categories, selectedMaterialIds, formHeader }) => {
    const [title, setTitle] = useState<string>(taskContent?.title ?? '');
    const [description, setDescription] = useState<string>(taskContent?.description ?? '');
    const [materialsId, setMaterialsId] = useState<number | null>(taskContent?.materialsId ?? null);
    const [creatorId, setCreatorId] = useState<string | null>(taskContent?.creatorId ?? null);
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
    
    const [materials, setMaterials] = useState<MaterialDto[]>([]);
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialDto | null>(null);
    const [showMaterialSelector, setShowMaterialSelector] = useState(false);
    const [showCreateMaterial, setShowCreateMaterial] = useState(false);
    const [showFilesList, setShowFilesList] = useState(false);
    const [assignedFileIds, setAssignedFileIds] = useState<number[]>([]);
    const [materialAccordion, setMaterialAccordion] = useState<number | null>(null);
    const [addedFilesCounter, setAddedFilesCounter] = useState(0);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setMaterialsId(null);
        setCategoryId(null);
        setSelectedCategory(null);
        setSearchTerm('');
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
            
            if (taskContent.materialsId) {
                loadSelectedMaterial(taskContent.materialsId);
            }
        }
        loadCategories();
        loadMaterials();
    }, [taskContent]);

    useEffect(() => {
        if (selectedMaterialIds && selectedMaterialIds.length > 0) {
            setMaterialsId(selectedMaterialIds[0]);
            loadSelectedMaterial(selectedMaterialIds[0]);
        }
    }, [selectedMaterialIds]);

    const loadCategories = async () => {
        try {
            const result = await getCategories();
            setLocalCategories(result);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadMaterials = async () => {
        try {
            const result = await materialService.getAllMaterials();
            setMaterials(result);
        } catch (error) {
            console.error('Error loading materials:', error);
        }
    };

    const loadSelectedMaterial = async (materialId: number) => {
        if (!materialId) return;
        
        try {
            const material = await materialService.getMaterialWithFiles(materialId);
            setSelectedMaterial(material);
            if (material.files) {
                setAssignedFileIds(material.files.map(file => file.id));
            } else {
                setAssignedFileIds([]);
            }
            setMaterialAccordion(materialId);
        } catch (error) {
            console.error('Error loading selected material:', error);
            setAlertMessage('Error loading selected material');
            setShowAlert(true);

            setToastMessage('Error loading material');
            setToastColor('red');
            setShowToast(true);

            setMaterialsId(null);
            setSelectedMaterial(null);
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

    const toggleMaterialSelection = (id: number) => {
        setMaterialsId(id);
    };

    const submitMaterialSelection = () => {
        if (materialsId) {
            loadSelectedMaterial(materialsId);
            setShowFilesList(true);
        }
        setShowMaterialSelector(false);
    };

    const clearSelectedMaterials = () => {
        setMaterialsId(null);
        setSelectedMaterial(null);
        setMaterialAccordion(null);
        setShowFilesList(false);
    };

    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId);
        loadMaterials();
        loadSelectedMaterial(materialId);
        setShowCreateMaterial(false);
        setShowFilesList(true);
    };

    const handleMaterialSelect = (materialId: number, fileIds: number[], action: string) => {
        switch(action) {
            case "deleteMaterial":
                clearSelectedMaterials();
                loadMaterials();
                break;
            case "uploadFile":
            case "save":
                setAssignedFileIds(fileIds);
                loadSelectedMaterial(materialId);
                break;
            case "open/close":
                if (materialAccordion === materialId) {
                    setMaterialAccordion(null);
                    setShowFilesList(false);
                } else {
                    setMaterialAccordion(materialId);
                    setAssignedFileIds(fileIds);
                    setShowFilesList(true);
                }
                break;
        }
    };

    const handleMaterialUpdate = (materialId: number) => {
        setAddedFilesCounter(prevState => prevState + 1);
    };

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active && over) {
            const draggedFileId = parseInt(active.id);
            const targetMaterialId = parseInt(over.id);

            if (isNaN(targetMaterialId)) {
                console.error('Target material ID is not a number:', over.id);
                return;
            }

            try {
                await materialService.addFile(targetMaterialId, draggedFileId);
                setAssignedFileIds(prev => [...prev, draggedFileId]);
                handleMaterialUpdate(targetMaterialId);
                loadSelectedMaterial(targetMaterialId);
            } catch (error) {
                setAlertMessage(`Error adding file to material`);
                setShowAlert(true);
                console.error(`Error adding file ${draggedFileId} to material ${targetMaterialId}:`, error);
            }
        }
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
                    const newCategory = await addCategory({ id: 0, name: searchTerm });

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
            resetForm();
            setKey(prev => prev + 1);
            
            setTimeout(() => {
                onTaskContentEdited();
            }, 1500);
        } catch (error) {
            console.error('Error saving TaskContent:', error);
            setToastMessage('Error saving task content');
            setToastColor('red');
            setShowToast(true);
        }
    };

    return (
        <section className='editBox'>
            {showAlert && (
                <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            
            <DndContext onDragEnd={handleDragEnd}>
                <div className="row align-items-start">
                    <div className={`col-md-${showFilesList ? '6' : '12'}`} style={showFilesList ? formContainerStyles.left : formContainerStyles.centered}>
                        <form onSubmit={handleSubmit} className="container-lg text-left">
                            {formHeader ? (
                                formHeader
                            ) : (
                                <h2>{isEditMode ? 'Edit TaskContent' : 'Add TaskContent'}</h2>
                            )}
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
                                <label htmlFor="category">Kategoria:</label>
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
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label>Materiały:</label>
                                    <div>
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm" 
                                            className="me-2" 
                                            onClick={() => setShowMaterialSelector(true)}
                                        >
                                            Select Existing Material
                                        </Button>
                                        <Button 
                                            variant="outline-success" 
                                            size="sm" 
                                            onClick={() => setShowCreateMaterial(true)}
                                        >
                                            Create New Material
                                        </Button>
                                        {materialsId && (
                                            <Button 
                                                variant={showFilesList ? "primary" : "outline-secondary"}
                                                size="sm" 
                                                className="ms-2"
                                                onClick={() => setShowFilesList(!showFilesList)}
                                            >
                                                {showFilesList ? "Hide Files List" : "Show Files List"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedMaterial ? (
                                    <Accordion activeKey={materialAccordion ? `item${materialAccordion}` : undefined}>
                                        <MaterialItem
                                            materialDto={selectedMaterial}
                                            addedFiles={addedFilesCounter}
                                            onDeleteItem={(materialId) => {
                                                clearSelectedMaterials();
                                                loadMaterials();
                                            }}
                                            onMaterialSelect={handleMaterialSelect}
                                        />
                                    </Accordion>
                                ) : (
                                    <p className="text-muted">No material selected</p>
                                )}
                            </div>

                            <div className="d-flex justify-content-end mt-3">
                                <Button type="submit" variant="primary">
                                    {isEditMode ? 'Save Changes' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                    
                    <div className={`col-md-6 pe-0 ${styles.file_container} ${showFilesList ? styles.visible : styles.invisible}`}>
                        {showFilesList && selectedMaterial && (
                            <FilesContainer excludedFileIds={assignedFileIds} />
                        )}
                    </div>
                </div>
            </DndContext>

            <MaterialSelector
                show={showMaterialSelector}
                onHide={() => setShowMaterialSelector(false)}
                materials={materials}
                toggleSelection={toggleMaterialSelection}
                submitSelection={submitMaterialSelection}
                clearSelectedMaterials={clearSelectedMaterials}
            />

            {showCreateMaterial && (
                <Modal
                    show={showCreateMaterial}
                    onHide={() => setShowCreateMaterial(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Material</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Material 
                            materialCreated={materialCreated}
                            showAddingFile={true}
                            showRemoveFile={false}
                            showDownloadFile={false}
                        />
                    </Modal.Body>
                </Modal>


            )}
            
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
