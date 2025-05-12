import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';
import { BadgeDto } from '../../dtos/BadgeDto';
import { addBadge, editBadge } from '../../services/badgeService';
import fileService from '../../services/fileService';
import { BadgeTypeCountEnum } from '../../Enums/BadgeTypeCountEnum';

interface BadgeFormProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
    badge?: BadgeDto;
}

const BadgeForm: React.FC<BadgeFormProps> = ({ show, onHide, onSuccess, badge }) => {
    const [name, setName] = useState(badge?.name || '');
    const [description, setDescription] = useState(badge?.description || '');
    const [iconId, setIconId] = useState<number | null>(badge?.iconId || null);
    const [count, setCount] = useState<number | null>(badge?.count ?? null);
    const [countType, setCountType] = useState(badge?.countType ?? null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = useCallback((file: File) => {
        if (file.type.startsWith('image/')) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            alert('Please select a valid image file.');
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileChange(file);
            }
        },
        [handleFileChange]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const uploadFile = async (file: File): Promise<number> => {
        setIsUploading(true);
        try {
            const response = await fileService.uploadFile(file, undefined, undefined, undefined, (percent) => {
                setUploadProgress(percent);
            });
            return response.fileDto.id;
        } catch (error: any) {
            throw new Error(`File upload failed: ${error.message}`);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async () => {
        let newIconId = iconId;

        if (selectedFile) {
            try {
                newIconId = await uploadFile(selectedFile);
                setIconId(newIconId);
            } catch (error: any) {
                alert(error.message);
                return;
            }
        }

        const badgeData: BadgeDto = {
            id: badge?.id || 0,
            name,
            description,
            iconId: newIconId,
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

    const handleHide = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>{badge ? 'Edit Badge' : 'Add Badge'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Badge Icon</Form.Label>
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{
                                border: '2px dashed #ccc',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                            }}
                            onClick={() => document.getElementById('fileInput')?.click()}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '150px' }}
                                />
                            ) : (
                                <p>Drag and drop an image here or click to select</p>
                            )}
                            <Form.Control
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                style={{ display: 'none' }}
                            />
                        </div>
                        {isUploading && (
                            <ProgressBar
                                now={uploadProgress}
                                label={`${uploadProgress}%`}
                                className="mt-2"
                            />
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Unlock Count</Form.Label>
                        <Form.Control
                            type="number"
                            value={count || ''}
                            onChange={(e) => setCount(Number(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Count Type</Form.Label>
                        <Form.Select
                            value={countType ?? ''}
                            onChange={(e) =>
                                setCountType(Number(e.target.value) as BadgeTypeCountEnum || null)
                            }
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
                <Button variant="secondary" onClick={handleHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isUploading}>
                    {badge ? 'Save Changes' : 'Add Badge'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BadgeForm;