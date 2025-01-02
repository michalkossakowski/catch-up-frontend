import React, { useState, ChangeEvent } from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import fileService from '../../services/fileService';

interface AvatarUploadModalProps {
    show: boolean;
    onHide: () => void;
    currentAvatarUrl: string;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({show, onHide, currentAvatarUrl}) => {
    const [previewUrl, setPreviewUrl] = useState<string>(currentAvatarUrl);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setPreviewUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setPreviewUrl(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) return;

        try {
            setIsUploading(true);
            const response = await fileService.uploadFile(selectedFile);
            console.log('File uploaded successfully:', response);
            // Here you would typically update the user's avatar ID in your user service
            // For now, we'll just close the modal
            onHide();
        } catch (error) {
            console.error('Error uploading avatar:', error);
            // Here you might want to show an error message to the user
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Update Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center mb-4">
                    <Image
                        src={previewUrl || 'src/assets/defaultUserIcon.jpg'}
                        roundedCircle
                        width={150}
                        height={150}
                        className="mb-3"
                        alt="Avatar preview"
                    />
                </div>

                <div
                    className={`p-4 border-2 border-dashed rounded-lg text-center ${
                        isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <i className="bi bi-camera-fill fs-1 mb-4 text-secondary" />
                    <p className="mb-2 text-sm text-gray-500">Drag and drop your image here</p>
                    <p className="mb-4 text-xs text-gray-400">or</p>
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="btn btn-primary"
                    >
                        Choose Image
                    </label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Save Changes'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AvatarUploadModal;