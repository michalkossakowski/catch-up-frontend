import React, { useState, useEffect } from 'react';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import Material from '../Material/Material';
import { addTaskContent, editTaskContent } from '../../services/taskContentService';
import './TaskContentEdit.css';
import { Button } from 'react-bootstrap';

interface TaskContentEditProps {
    isEditMode: boolean;
    taskContent?: TaskContentDto;
    onTaskContentEdited: () => void;
}

const TaskContentEdit: React.FC<TaskContentEditProps> = ({ onTaskContentEdited, taskContent, isEditMode }) => {
    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [materialsId, setMaterialsId] = useState<number | null>();
    const [creatorId, setCreatorId] = useState<string | null>();
    const [categoryId, setCategoryId] = useState<number | null>();


    useEffect(() => {
        if (taskContent) {
            setTitle(taskContent.title);
            setDescription(taskContent.description);
            setMaterialsId(taskContent.materialsId ?? null);
            setCreatorId(taskContent.creatorId ?? null);
            setCategoryId(taskContent.categoryId ?? null);
        }
    }, [taskContent]);

    const materialCreated = (materialId: number) => {
        setMaterialsId(materialId);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const taskContentDto: TaskContentDto = {
            id: isEditMode ? taskContent!.id : 0,
            title: title ?? '',
            description: description ?? '',
            materialsId: materialsId,
            creatorId: creatorId,
            categoryId: categoryId
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
