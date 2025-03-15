import React, { useState } from 'react';
import { AddFeedbackDialog } from '../Feedback/AddFeedbackDialog';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

interface FeedbackButtonProps {
    resourceId: number;
    resourceType: ResourceTypeEnum;
    receiverId: string;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ resourceId, resourceType, receiverId }) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
                <button type="button" className="btn btn-success" onClick={handleOpenDialog}>
                    Feedback
                </button>
            {showDialog && (
                <AddFeedbackDialog
                    resourceId={resourceId}
                    resourceType={resourceType}
                    receiverId={receiverId}
                    onClose={handleCloseDialog}
                />
            )}
        </>
    );
};
