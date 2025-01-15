import React, { useState } from 'react';
import { AddFeedbackDialog } from '../Feedback/AddFeedbackDialog';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';

interface FeedbackButtonProps {
    resourceId: number;
    resourceType: ResourceTypeEnum;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({ resourceId, resourceType }) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
            <div className="d-flex mt-3 mb-3 btn-group">
                <button type="button" className="btn btn-info" onClick={handleOpenDialog}>
                    Feedback
                </button>
            </div>
            {showDialog && (
                <AddFeedbackDialog
                    resourceId={resourceId}
                    resourceType={resourceType}
                    onClose={handleCloseDialog}
                />
            )}
        </>
    );
};
