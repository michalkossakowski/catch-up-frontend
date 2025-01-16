import React, { useState, useEffect } from 'react';
import './TaskContentComponent.css';
import { Accordion, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { getTaskContents, getByTitle, deleteTaskContent } from '../../services/taskContentService';
import Material from '../Material/Material';
import TaskContentEdit from './TaskContentEdit';
import { CategoryDto } from '../../dtos/CategoryDto';
import { getCategories } from '../../services/categoryService';
import { removeTaskFromAllPresets } from '../../services/taskPresetService';


interface TaskContentComponentProps {
    isAdmin: boolean;
}

const TaskContentComponent: React.FC<TaskContentComponentProps> = ({ isAdmin }) => {
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [loading, setLoading] = useState(true)
    const [showError, setShowError] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showSearchMessage, setShowSearchMessage] = useState(false)
    const [searchMessage, setSearchMessage] = useState('alert')
    const [searchTitle, setSearchTitle] = useState('');
    let i = 1;
    const [showEdit, setShowEdit] = useState(false);
    const [editedTaskContent, setEditedTaskContent] = useState<TaskContentDto | null>();
    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        getAllTaskContents();
        getCategories()
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error loading categories:', error));
    }, []);

    const getAllTaskContents = () => {
        // console.log('Pobieranie task contents');
        setLoading(true);
        getTaskContents()
            .then((data) => {
                // console.log('Pobrane dane:', data);
                setTaskContents(data);
                setShowError(false);
            })
            .catch((error) => {
                console.error('Błąd pobierania:', error);
                setShowError(true);
                setAlertMessage('Error: ' + error.message);
            })
            .finally(() => setLoading(false));
    }

    const searchTaskContents = () => {
        if (searchTitle.length == 0) {
            getAllTaskContents()
            setShowSearchMessage(false);
            return
        }
        setLoading(true);
        getByTitle(searchTitle)
            .then((data) => {
                setTaskContents(data);
                setShowSearchMessage(false);
            })
            .catch((error) => {
                setShowSearchMessage(true);
                setSearchMessage(error.message);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = async (taskContentId: number) => {
        try {
            // console.log('Starting deletion process for taskContentId:', taskContentId);
            
            // console.log('Removing task from all presets...');
            await removeTaskFromAllPresets(taskContentId);
            // console.log('Successfully removed task from all presets');
            
            // console.log('Deleting task content...');
            await deleteTaskContent(taskContentId);
            // console.log('Successfully deleted task content');
            
            getAllTaskContents();
            
        } catch (error: any) {
            console.error('Error in deletion process:', error);
            setShowError(true);
            setAlertMessage('Error deleting TaskContent: ' + error.message);
        }
    };

    const editClick = (taskContentId: number) => {
        setEditedTaskContent(taskContents.find((taskContent) => taskContent.id === taskContentId));
        setShowEdit(true);
    };

    const handleTaskContentUpdated = async () => {
        try {
            const updatedCategories = await getCategories();
            setCategories(updatedCategories);
        } catch (error) {
            console.error('Error refreshing categories:', error);
        }
        getAllTaskContents();
        setShowEdit(false);
        setEditedTaskContent(null);
    };

    const materialCreated = (materialId: number) => {
        return materialId
    }

    const getCategoryName = (categoryId: number) => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || categoryId;
    };

    return (
        <>
            {isAdmin && (
                <div>
                    {!showEdit && (
                        <TaskContentEdit isEditMode={false} onTaskContentEdited={handleTaskContentUpdated} categories={categories} />
                    )}
                    {showEdit && editedTaskContent && (
                        <div>
                            <Button variant="primary" onClick={() => setShowEdit(false)}>
                                Back to Add
                            </Button>
                            <TaskContentEdit taskContent={editedTaskContent} isEditMode={true} onTaskContentEdited={handleTaskContentUpdated} categories={categories} />
                        </div>
                    )}
                </div>
            )}


            <section className='container'>
                <h2 className='title'>TaskContents</h2>

                <div className='loaderBox'>
                    {loading && (
                        <span className='loader'></span>
                    )}

                    {showError && (
                        <Alert className='alert' variant='danger'>
                            {alertMessage}
                        </Alert>
                    )}

                    {showSearchMessage && (
                        <Alert className='alert' variant='warning'>
                            {searchMessage}
                        </Alert>
                    )}
                </div>

                {!showSearchMessage && !showError && !loading && (
                    <div>
                        {taskContents.length > 0 && (
                            <div className='searchBox'>
                                <InputGroup className="inputGroup mb-3">
                                    <Form.Control
                                        placeholder="Enter searched title..."
                                        value={searchTitle}
                                        onChange={(e) => setSearchTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && searchTaskContents()}
                                    />
                                    <Button variant="primary" id="searchButton" onClick={searchTaskContents}>
                                        Search
                                    </Button>
                                </InputGroup>
                            </div>
                        )}


                        <Accordion className='AccordionItem'>
                            {taskContents.map((taskContent) => (
                                <Accordion.Item eventKey={taskContent.id.toString()} key={taskContent.id}>
                                    <Accordion.Header>
                                        {i++}. {taskContent.title}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p>{taskContent.description}</p>

                                        {taskContent.materialsId && (
                                            <div>
                                                Additional materials:
                                                <Material materialId={taskContent.materialsId} showDownloadFile={true} materialCreated={materialCreated} />
                                            </div>
                                        )}

                                        {taskContent.categoryId && (
                                            <div>
                                                Category: {getCategoryName(taskContent.categoryId)}
                                            </div>
                                        )}

                                        {isAdmin && (
                                            <div className='buttonBox'>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => editClick(taskContent.id)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(taskContent.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    </div>
                )}
            </section>
        </>
    );
};

export default TaskContentComponent;
