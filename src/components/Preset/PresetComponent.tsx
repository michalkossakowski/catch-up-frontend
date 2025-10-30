import React, { useState, useEffect } from 'react';
import { Accordion, Alert, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { PresetDto } from '../../dtos/PresetDto';
import { TaskContentDto } from '../../dtos/TaskContentDto';
import { getPresets, getPresetsByName, deletePreset } from '../../services/presetService';
import { getTaskPresetsByPreset, getTaskPresetsByTaskContent } from '../../services/taskPresetService';
import { getAllTaskContents } from '../../services/taskContentService';
import PresetEdit from './PresetEdit';
import './PresetComponent.css';
import { useNavigate } from 'react-router-dom';
import NotificationToast from '../Toast/NotificationToast';
import PresetTaskContentItem from './PresetTaskContentItem';

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
    const [editedPreset, setEditedPreset] = useState<PresetDto | null>(null);
    const [presetTasks, setPresetTasks] = useState<Map<number, TaskContentDto[]>>(new Map());
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    useEffect(() => {
        getAllPresets();
        loadTaskContents();

        const urlParams = new URLSearchParams(window.location.search);
        const successParam = urlParams.get('success');
        
        if (successParam === 'assigned') {
            showSuccessMessage('Tasks have been successfully assigned to the user');
            setToastMessage('Tasks have been successfully assigned');
            setToastColor('green');
            setShowToast(true);
            window.history.replaceState({}, '', window.location.pathname);
        }
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
            setToastMessage('Error loading presets');
            setToastColor('red');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const loadTaskContents = async () => {
        try {
            const data = await getAllTaskContents();
            setTaskContents(data);
        } catch (error: any) {
            console.error('Error loading task contents:', error);
            setToastMessage('Error loading task contents');
            setToastColor('red');
            setShowToast(true);
        }
    };

    const loadPresetTasks = async (presetsData: PresetDto[]) => {
        const tasksMap = new Map<number, TaskContentDto[]>();
        const allTaskContents = await getAllTaskContents();
        
        for (const preset of presetsData) {
            try {
                const presetTasks = await getTaskPresetsByPreset(preset.id);
                const matchingTasks = presetTasks.map((pt): TaskContentDto | undefined => 
                    allTaskContents.find(tc => tc.id === pt.taskContentId)
                ).filter((tc): tc is TaskContentDto => tc !== undefined);
                
                tasksMap.set(preset.id, matchingTasks);
            } catch (error: any) {
                console.error(`Error loading tasks for preset ${preset.id}:`, error);
                setToastMessage(`Error loading preset tasks`);
                setToastColor('red');
                setShowToast(true);
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
            setToastMessage('Error searching presets');
            setToastColor('red');
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (presetId: number) => {
        if (window.confirm("Are you sure you want to delete this preset?")) {
            try {
                await deletePreset(presetId);
                setPresets(prevPresets => prevPresets.filter(preset => preset.id !== presetId));
                setToastMessage("Preset deleted successfully");
                setToastColor("green");
                setShowToast(true);
            } catch (error: any) {
                setShowError(true);
                setAlertMessage('Error deleting Preset: ' + error.message);
                setToastMessage('Error deleting preset');
                setToastColor('red');
                setShowToast(true);
            }
        }
    };

    const editClick = (presetId: number) => {
        setEditedPreset(presets.find(preset => preset.id === presetId) || null);
        setShowEditModal(true);
    };

    const handlePresetUpdated = () => {
        getAllPresets();
        setShowEditModal(false);
        setEditedPreset(null);
        setToastMessage("Preset updated successfully");
        setToastColor("green");
        setShowToast(true);
    };

    const handleAssign = (presetId: number) => {
        navigate(`/preset/assign/${presetId}`);
    };

    const showSuccessMessage = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    return (
        <>
            <section className='container'>
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <h2 className='title mb-0'>Presets</h2>
                    {isAdmin && (
                        <Button variant="success" onClick={() => { setEditedPreset(null); setShowEditModal(true); }}>
                            Create new preset
                        </Button>
                    )}
                </div>

                <div className='loaderBox'>
                    {loading && <span className='loader'></span>}
                    {showError && (
                        <Alert className='alert' variant='danger'>
                            {alertMessage}
                        </Alert>
                    )}
                    {successMessage && (
                        <Alert className='alert' variant='success'>
                            {successMessage}
                        </Alert>
                    )}
                </div>

                {!showError && !loading && (
                    <div>
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

                        {presets.length > 0 ? (
                            <Accordion className='AccordionItem'>
                                {presets.map((preset, index) => (
                                    <Accordion.Item eventKey={preset.id.toString()} key={preset.id}>
                                        <Accordion.Header>
                                            {index + 1}. {preset.name}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <h5>Tasks in preset:</h5>
                                            <div>
                                                {presetTasks.get(preset.id)?.map(task => (
                                                    <PresetTaskContentItem key={task.id} item={task} />
                                                ))}
                                            </div>

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
                                                    <Button
                                                        variant="success"
                                                        onClick={() => handleAssign(preset.id)}>
                                                        Assign
                                                    </Button>
                                                </div>
                                            )}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        ) : (
                            <Alert variant="info">
                                {searchName 
                                    ? `No presets found containing: ${searchName}`
                                    : 'No presets found'
                                }
                            </Alert>
                        )}
                    </div>
                )}
                
                <NotificationToast
                    show={showToast}
                    title="Preset Operation"
                    message={toastMessage}
                    color={toastColor}
                    onClose={() => setShowToast(false)}
                />
            </section>

            <Modal 
                show={showEditModal} 
                onHide={() => { setShowEditModal(false); setEditedPreset(null); }} 
                size="lg" 
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{editedPreset ? 'Edit Preset' : 'Create New Preset'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PresetEdit 
                        preset={editedPreset || undefined}
                        isEditMode={!!editedPreset}
                        onPresetEdited={handlePresetUpdated}
                        onCancel={() => { setShowEditModal(false); setEditedPreset(null); }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PresetComponent; 