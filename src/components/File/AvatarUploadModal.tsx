import React, { useState, ChangeEvent, useEffect } from 'react';
import { Modal, Button, Image, Alert } from 'react-bootstrap';
import fileService from '../../services/fileService';
import { editUser } from '../../services/userService';
import { useAuth } from '../../Provider/authProvider';

interface AvatarUploadModalProps {
    show: boolean;
    onHide: () => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ show, onHide }) => {
    const { user, updateAvatar } = useAuth();
    const defaultIcon = 'src/assets/defaultUserIcon.jpg';
    const [previewUrl, setPreviewUrl] = useState<string>(defaultIcon);
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isExiting, setIsExiting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

    const resetState = () => {
        setPreviewUrl(defaultIcon);
        setSelectedFile(null);
        setIsDragActive(false);
        setIsUploading(false);
        setError('');
    };

    useEffect(() => {
        if (!show) {
            setIsExiting(true);
            const timer = setTimeout(() => {
                resetState();
                setIsExiting(false);
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const validateFile = (file: File): boolean => {
        if (file.size > 1000000) { // 1MB in bytes
            setError('File size must be less than 1MB.');
            return false;
        }
        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a PNG, JPG, or GIF file.');
            return false;
        }
        setError('');
        return true;
    };


    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            handleFileUpload(file);
        }
    };

    const handleFileUpload = (file: File) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            if (event.target?.result) {
                setPreviewUrl(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            handleFileUpload(file);
        }
    };

    const handleSave = async () => {
        if (!selectedFile || !user?.id) return;
        setError('');

        try {
            setIsUploading(true);
            const uploadResponse = await fileService.uploadFile(selectedFile);
            await editUser(user.id, { avatarId: uploadResponse.fileDto.id });
            await updateAvatar(selectedFile);
            onHide();
        } catch (error) {
            setError('Failed to upload image. Please try again.');
            console.error('Error updating avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className={`transition-opacity duration-200 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        >
            <Modal.Header closeButton>
                <Modal.Title>Update Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
                        {error}
                    </Alert>
                )}

                <div className="text-center mb-4">
                    <Image
                        src={previewUrl}
                        roundedCircle
                        width={150}
                        height={150}
                        className="mb-3"
                        alt="Avatar preview"
                    />
                </div>

                <div
                    className={`
                        p-4 border-4 border-dashed rounded-lg text-center 
                        transition-all duration-200 ease-in-out
                        ${isDragActive ? 'border-primary bg-blue-100 shadow-lg transform scale-105' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <i className={`
                        bi bi-camera-fill fs-1 mb-4
                        ${isDragActive ? 'text-primary' : 'text-secondary'}
                        transition-colors duration-200
                    `} />
                    <p className={`
                        mb-2 text-sm 
                        ${isDragActive ? 'text-primary' : 'text-gray-500'}
                        transition-colors duration-200
                    `}>
                        {isDragActive ? 'Drop to upload!' : 'Drag and drop your image here'}
                    </p>
                    <p className="mb-4 text-xs text-gray-400">or</p>
                    <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/png,image/jpeg,image/gif"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor="avatar-upload"
                        className="btn btn-primary cursor-pointer"
                    >
                        Choose Image
                    </label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cancel</Button>
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