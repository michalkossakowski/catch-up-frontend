import React, { useState } from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { doneFeedback, deleteFeedback } from '../../services/feedbackService';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import MaterialItem from '../MaterialManager/MaterialItem';

interface FeedbackDetailsDialogProps {
  feedback: FeedbackDto;
  isOpen: boolean;
  onClose: () => void;
  onResolveChange: (id: number, isResolved: boolean) => void;
  onDelete: (id: number) => void;
}

const FeedbackDetailsDialog: React.FC<FeedbackDetailsDialogProps> = ({
  feedback,
  isOpen,
  onClose,
  onResolveChange,
  onDelete
}) => {
  const [isResolved, setIsResolved] = useState(feedback.isResolved);

  const handleResolve = async () => {
    if (feedback.id !== undefined) {
      await doneFeedback(feedback.id);
      const newIsResolved = !isResolved;
      setIsResolved(newIsResolved);
      onResolveChange(feedback.id, newIsResolved);
    }
  };

  const handleDelete = async () => {
    if (feedback.id !== undefined) {
      await deleteFeedback(feedback.id);
      onDelete(feedback.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title h3">{feedback.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-start">
            <div className="row">
              <div className="col text-start h5 m-0">
                <p><strong>From:</strong> {feedback.userSend}</p>
              </div>
              <div className="col text-end">
                <p><strong>Date:</strong> {new Date(feedback.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-start h6 m-0"><strong>To:</strong> {feedback.userReceive}</p>
            <hr></hr>
            <p>{feedback.description || "No description..."}</p>
            <hr></hr>
            <p className='mb-0'><strong>{feedback.resourceName || 'No title'}</strong></p>
            <p className='mt-0'>{ResourceTypeEnum[feedback.resourceType]}</p>
            {feedback.materialId && (
                <MaterialItem 
                    materialId={feedback.materialId} 
                    enableDownloadFile={true} 
                    enableAddingFile={false}
                    enableRemoveFile={false}
                    enableEdittingMaterialName ={false}
                    enableEdittingFile={false}
                    showMaterialName= {true}
                    nameTitle='Attachments'
                />
            )}
          </div>
          <div className="modal-footer">
            <div className="d-flex justify-content-between w-100">
              <div>
                <button 
                  className={`btn ${isResolved ? 'btn-success' : 'btn-secondary'} me-2`}
                  onClick={handleResolve}
                >
                  {isResolved ? 'Resolved' : 'Unresolved'}
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
              <button 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailsDialog;