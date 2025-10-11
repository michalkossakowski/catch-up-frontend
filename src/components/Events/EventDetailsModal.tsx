import React, { useState } from 'react';
import { deleteEvent } from '../../services/eventService';

interface EventDetailsModalProps {
  event: {
    id: number;
    title: string;
    description: string;
    start: Date | string;
    end: Date | string;
    ownerId: string | undefined;
  } | null;
  onClose: () => void;
  onDeleteSuccess?: (eventId: number) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, onClose, onDeleteSuccess }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) return null;

  const start = new Date(event.start);
  const end = new Date(event.end);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setDeleting(true);
      await deleteEvent(event.id);
      onDeleteSuccess?.(event.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}
              onClick={onClose}
            ></button>
            <h5 className="modal-title w-100 text-center fw-bold">{event.title}</h5>
          </div>
          <div
            className="modal-body"
            style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
          >
            <h5 style={{ margin: '1rem' }}>{event.description}</h5>
            <small className="text-center">
              {start.toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
              {' '}-{' '}
              {end.toLocaleString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </small>
            <br/><br/>
            {error && <p className="text-danger">{error}</p>}
            {event.ownerId === window.userId && (
              <>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete Event'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
