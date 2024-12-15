import React, { useState, useEffect } from 'react';
import { Accordion, Alert, Button, Form, InputGroup } from 'react-bootstrap';
import { PresetDto } from '../../dtos/PresetDto';
import { TaskPresetDto } from '../../dtos/TaskPresetDto';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { getPresets, getPresetsByName, deletePreset } from '../../services/presetService';
import { getTaskPresetsByTaskContent } from '../../services/taskPresetService';
import { getTaskContents } from '../../services/taskContentService';
import PresetEdit from './PresetEdit';
import './PresetComponent.css';

interface PresetComponentProps {
    isAdmin: boolean;
}

const PresetComponent: React.FC<PresetComponentProps> = ({ isAdmin }) => {
    const [presets, setPresets] = useState<PresetDto[]>([]);
    const [taskContents, setTaskContents] = useState<TaskContentDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [searchName, setSearchName] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const [editedPreset, setEditedPreset] = useState<PresetDto | null>(null);
    const [presetTasks, setPresetTasks] = useState<Map<number, TaskContentDto[]>>(new Map());

    useEffect(() => {
        getAllPresets();
        loadTaskContents();
    }, []);

    const getAllPresets = async () => {
        setLoading(true);
        try {
            const data = await getPresets();
            setPresets(data);
            await loadPresetTasks(data);
            setShowError(false);
        } catch (error: any) {
            setShowError(true);
            setAlertMessage('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadTaskContents = async () => {
        try {
            const data = await getTaskContents();
            setTaskContents(data);
        } catch (error) {
            console.error('Error loading task contents:', error);
        }
    };

    const loadPresetTasks = async (presetsData: PresetDto[]) => {
        const tasksMap = new Map<number, TaskContentDto[]>();
        for (const preset of presetsData) {
            try {
                const presetTasks = await getTaskPresetsByTaskContent(preset.id);
                const taskContents = presetTasks.map(pt => 
                    taskContents.find(tc => tc.id === pt.taskContentId)
                ).filter((tc): tc is TaskContentDto => tc !== undefined);
                tasksMap.set(preset.id, taskContents);
            } catch (error) {
                console.error(`Error loading tasks for preset ${preset.id}:`, error);
            }
        }
        setPresetTasks(tasksMap);
    };

    const searchPresets = async () => {
        if (searchName.length === 0) {
            getAllPresets();
            return;
        }
        setLoading(true);
        try {
            const data = await getPresetsByName(searchName);
            setPresets(data);
            await loadPresetTasks(data);
        } catch (error: any) {
            setShowError(true);
            setAlertMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (presetId: number) => {
        try {
            await deletePreset(presetId);
            setPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
        } catch (error: any) {
            setShowError(true);
            setAlertMessage('Error deleting Preset: ' + error.message);
        }
    };

    const editClick = (presetId: number) => {
        setEditedPreset(presets.find(preset => preset.id === presetId) || null);
        setShowEdit(true);
    };

    const handlePresetUpdated = () => {
        getAllPresets();
        setShowEdit(false);
        setEditedPreset(null);
    };

    return (
        <>
            {isAdmin && (
                <div>
                    {!showEdit && (
                        <PresetEdit 
                            isEditMode={false} 
                            onPresetEdited={handlePresetUpdated} 
                        />
                    )}
                    {showEdit && editedPreset && (
                        <div>
                            <Button variant="primary" onClick={() => setShowEdit(false)}>
                                Back to Add
                            </Button>
                            <PresetEdit 
                                preset={editedPreset} 
                                isEditMode={true} 
                                onPresetEdited={handlePresetUpdated}
                            />
                        </div>
                    )}
                </div>
            )}

            <section className='container'>
                <h2 className='title'>Presets</h2>

                <div className='loaderBox'>
                    {loading && <span className='loader'></span>}
                    {showError && (
                        <Alert className='alert' variant='danger'>
                            {alertMessage}
                        </Alert>
                    )}
                </div>

                {!showError && !loading && (
                    <div>
                        {presets.length > 0 && (
                            <div className='searchBox'>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        placeholder="Search by preset name..."
                                        value={searchName}
                                        onChange={(e) => setSearchName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && searchPresets()}
                                    />
                                    <Button variant="primary" onClick={searchPresets}>
                                        Search
                                    </Button>
                                </InputGroup>
                            </div>
                        )}

                        <Accordion className='AccordionItem'>
                            {presets.map((preset, index) => (
                                <Accordion.Item eventKey={preset.id.toString()} key={preset.id}>
                                    <Accordion.Header>
                                        {index + 1}. {preset.name}
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <h5>Tasks in preset:</h5>
                                        <ul className="preset-tasks-list">
                                            {presetTasks.get(preset.id)?.map(task => (
                                                <li key={task.id}>{task.title}</li>
                                            ))}
                                        </ul>

                                        {isAdmin && (
                                            <div className='buttonBox'>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => editClick(preset.id)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(preset.id)}>
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

export default PresetComponent; 