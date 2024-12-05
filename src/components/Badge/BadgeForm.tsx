import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BadgeDto } from '../../dtos/BadgeDto';
import { addBadge, editBadge } from '../../services/badgeService';
import { BadgeTypeCountEnum } from "../../Enums/BadgeTypeCountEnum";

interface BadgeFormProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    badge?: BadgeDto;
}

const BadgeForm: React.FC<BadgeFormProps> = ({ show, onHide, onSuccess, badge }) => {
    const [name, setName] = useState(badge?.name || '');
    const [description, setDescription] = useState(badge?.description || '');
    const [iconSource, setIconSource] = useState(badge?.iconSource || '');
    const [count, setCount] = useState<number | null>(badge?.count ?? null);
    const [countType, setCountType] = useState(badge?.countType ?? null);

    const handleSubmit = async () => {
        const badgeData: BadgeDto = {
            id: badge?.id || 0,
            name,
            description,
            iconSource,
            count: count ?? null,
            countType: countType ?? null,
        };
    
        console.log('Submitting badge data:', badgeData);
    
        try {
            if (badge) {
                await editBadge(badgeData);
            } else {
                await addBadge(badgeData);
            }
            onSuccess();
            onHide();
        } catch (error: any) {
            console.error('Error submitting badge data:', error);
            alert(`Error: ${error.message}`);
        }
    };
    

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{badge ? 'Edit Badge' : 'Add Badge'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Icon URL</Form.Label>
                        <Form.Control
                            type="text"
                            value={iconSource}
                            onChange={(e) => setIconSource(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Unlock Count</Form.Label>
                        <Form.Control
                            type="number"
                            value={count || ''}
                            onChange={(e) => setCount(Number(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Count Type</Form.Label>
                        <Form.Select
                            value={countType ?? ''}
                            onChange={(e) => setCountType(Number(e.target.value) as BadgeTypeCountEnum || null)}
                        >
                            <option value="">Select Count Type</option>
                            {Object.entries(BadgeTypeCountEnum)
                                .filter(([key]) => isNaN(Number(key)))
                                .map(([key, value]) => (
                                    <option key={value} value={value}>
                                        {key}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {badge ? 'Save Changes' : 'Add Badge'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BadgeForm;
