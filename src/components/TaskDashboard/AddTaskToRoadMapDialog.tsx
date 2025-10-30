import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { getByNewbieId } from '../../services/roadMapService';
import { getByRoadMapId } from '../../services/roadMapPointService';
import { updateTaskRoadMapPoint } from '../../services/taskService';
import { RoadMapDto } from '../../dtos/RoadMapDto';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';

interface AddTaskToRoadMapDialogProps {
    taskId: number;
    taskTitle: string;
    newbieId: string;
    currentRoadMapPointId?: string | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const AddTaskToRoadMapDialog: React.FC<AddTaskToRoadMapDialogProps> = ({ 
    taskId, 
    taskTitle,
    newbieId, 
    currentRoadMapPointId,
    onClose, 
    onSuccess 
}) => {
    const [roadMaps, setRoadMaps] = useState<RoadMapDto[]>([]);
    const [roadMapPoints, setRoadMapPoints] = useState<RoadMapPointDto[]>([]);
    const [selectedRoadMapId, setSelectedRoadMapId] = useState<number | null>(null);
    const [selectedRoadMapPointId, setSelectedRoadMapPointId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRoadMaps = async () => {
            try {
                setLoading(true);
                const userRoadMaps = await getByNewbieId(newbieId);
                setRoadMaps(userRoadMaps);
            } catch (err) {
                setError('Failed to load roadmaps');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadRoadMaps();
    }, [newbieId]);

    useEffect(() => {
        const loadRoadMapPoints = async () => {
            if (selectedRoadMapId) {
                try {
                    const points = await getByRoadMapId(selectedRoadMapId);
                    setRoadMapPoints(points);
                } catch (err) {
                    setError('Failed to load roadmap points');
                    console.error(err);
                }
            } else {
                setRoadMapPoints([]);
                setSelectedRoadMapPointId(null);
            }
        };
        loadRoadMapPoints();
    }, [selectedRoadMapId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoadMapPointId) {
            setError('Please select a roadmap point');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            await updateTaskRoadMapPoint(taskId, selectedRoadMapPointId);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError('Failed to add task to roadmap');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveFromRoadMap = async () => {
        try {
            setSubmitting(true);
            setError(null);
            await updateTaskRoadMapPoint(taskId, null);
            onSuccess?.();
            onClose();
        } catch (err) {
            setError('Failed to remove task from roadmap');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Task to Roadmap</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <Spinner animation="border" />
                        <p className="mt-2">Loading roadmaps...</p>
                    </div>
                ) : (
                    <>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <p className="text-muted mb-3">
                            <strong>Task:</strong> {taskTitle}
                        </p>

                        {currentRoadMapPointId && (
                            <Alert variant="info">
                                This task is already assigned to a roadmap point.
                                <Button 
                                    variant="link" 
                                    size="sm" 
                                    onClick={handleRemoveFromRoadMap}
                                    disabled={submitting}
                                >
                                    Remove from roadmap
                                </Button>
                            </Alert>
                        )}

                        {roadMaps.length === 0 ? (
                            <Alert variant="warning">
                                This user doesn't have any roadmaps assigned yet.
                            </Alert>
                        ) : (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Roadmap</Form.Label>
                                    <Form.Select
                                        value={selectedRoadMapId || ''}
                                        onChange={(e) => setSelectedRoadMapId(Number(e.target.value) || null)}
                                        required
                                    >
                                        <option value="">Choose a roadmap...</option>
                                        {roadMaps.map((roadMap) => (
                                            <option key={roadMap.id} value={roadMap.id}>
                                                {roadMap.title}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                {selectedRoadMapId && (
                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Roadmap Point</Form.Label>
                                        {roadMapPoints.length === 0 ? (
                                            <Alert variant="info" className="mb-0">
                                                This roadmap has no points yet. Please create roadmap points (milestones) first before adding tasks.
                                            </Alert>
                                        ) : (
                                            <Form.Select
                                                value={selectedRoadMapPointId || ''}
                                                onChange={(e) => setSelectedRoadMapPointId(Number(e.target.value) || null)}
                                                required
                                            >
                                                <option value="">Choose a point...</option>
                                                {roadMapPoints.map((point) => (
                                                    <option key={point.id} value={point.id}>
                                                        {point.name}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        )}
                                    </Form.Group>
                                )}

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="secondary" onClick={onClose} disabled={submitting}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={!selectedRoadMapPointId || submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            'Add to Roadmap'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};
