import React, { useState, useEffect } from 'react';
import { FeedbackDto } from '../../dtos/FeedbackDto';
import { doneFeedback, deleteFeedback } from '../../services/feedbackService';
import { ResourceTypeEnum } from '../../Enums/ResourceTypeEnum';
import MaterialItem from '../MaterialManager/MaterialItem';
import './FeedbackDetailsDialog.css'

interface FeedbackDetailsDialogProps {
  feedback: FeedbackDto;
  isOpen: boolean;
  isNewbie: boolean;
  onClose: () => void;
  onResolveChange: (id: number, isResolved: boolean) => void;
  onDelete: (feedback: FeedbackDto) => void;
}

const FeedbackDetailsDialog: React.FC<FeedbackDetailsDialogProps> = ({
  feedback,
  isOpen,
  isNewbie,
  onClose,
  onResolveChange,
  onDelete
}) => {
  const [isResolved, setIsResolved] = useState(feedback.isResolved);
  
  useEffect(() => {
    setIsResolved(feedback.isResolved);
  }, [feedback.id, feedback.isResolved]);

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
      onDelete(feedback);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-feedback">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title h3">{feedback.title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-start">
            <h5>{feedback.description || "No description..."}</h5>
            <hr></hr>
            {feedback.materialId && (
              <>
                <hr></hr>
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
              </>
            )}
            <div className="row">
              <div className="col text-start m-0">
            <p><strong>From:</strong> {feedback.userSend}</p>
              </div>
              <div className="col text-end">
            <p><strong>To:</strong> {feedback.userReceive}</p>
              </div>
            </div>
            <div className="row">
              <div className="col text-start m-0">
                  <p><strong>Source:</strong> {feedback.resourceName || 'No title'} ({ResourceTypeEnum[feedback.resourceType]})</p>
              </div>
              <div className="col text-end">
                <p><strong>Date:</strong> {new Date(feedback.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="modal-footer row feedback-modal">
                <div className="col text-start h5">
                  <strong>
                    Status:{' '} 
                    {isResolved ? (
                      <>
                      Resolved <i className="bi bi-check-circle-fill"></i> 
                      </>
                    ) : (
                      <>
                      Unresolved <i className="bi bi-x-circle-fill text-danger"></i>
                      </>
                    )}
                  </strong>
                </div>
                <div className="col text-end">
                  {!isNewbie && (
                    <button 
                    className={`btn ${isResolved ? 'btn-danger': 'btn-success'} me-2`}
                    onClick={handleResolve}
                    >
                      {isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                    </button>
                  )}
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    <i className='bi-trash'> </i>Delete
                  </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailsDialog;