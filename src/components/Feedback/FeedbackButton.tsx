import React, { useState } from 'react';
import { AddFeedbackDialog } from '../Feedback/AddFeedbackDialog';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import NotificationToast from '../Toast/NotificationToast';

interface FeedbackButtonProps {
    resourceId: number;
    resourceType: ResourceTypeEnum;
    receiverId: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ resourceId, resourceType, receiverId }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('');

    const handleOpenDialog = () => setShowDialog(true);
    const handleCloseDialog = () => setShowDialog(false);

    const handleShowToast = (message: string, color: string) => {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    };

    return (
        <>
            <button type="button" className="btn btn-success" onClick={handleOpenDialog}>
                <i className='bi-arrow-counterclockwise' style={{color: 'white'}}></i> Feedback
            </button>

            {showDialog && (
                <AddFeedbackDialog
                    resourceId={resourceId}
                    resourceType={resourceType}
                    receiverId={receiverId}
                    onClose={handleCloseDialog}
                    onShowToast={handleShowToast} // przekazujemy callback
                />
            )}

            <NotificationToast
                show={showToast}
                title="Feedback Operation"
                message={toastMessage}
                color={toastColor}
                onClose={() => setShowToast(false)}
            />
        </>
    );
};
