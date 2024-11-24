import React, { useState } from 'react';
import { RoadMapPointDto } from '../../dtos/RoadMapPointDto';
import { addRoadMapPoint } from '../../services/roadMapPointService';

const RoadMapPointAdd: React.FC = () => {
    const [roadMapId, setRoadMapId] = useState<number>();
    const [name, setName] = useState<string>('');
    const [deadline, setDeadline] = useState<number>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newRoadMapPoint: RoadMapPointDto = {
            roadMapId,
            name,
            deadline
        };

        addRoadMapPoint(newRoadMapPoint)
            .then(() => {
                setRoadMapId(undefined);
                setName('');
                setDeadline(undefined);
            })
            .catch((error) => {
                console.error('Error adding RoadMap:', error);
            });
    };

    return (
        <section className='editBox'>
            <h2>Add RoadMapPoint</h2>
            <form onSubmit={handleSubmit} className="container-lg text-left">
                <br />
                <div className="form-group">
                    <label htmlFor="roadMapId">RoadMapId:</label>
                    <input
                        type="number"
                        id="roadMapId"
                        className="form-control"
                        value={roadMapId ?? ''}
                        onChange={(e) => setRoadMapId(Number(e.target.value))}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div className="form-group">
                    <label htmlFor="deadline">Deadline (in days):</label>
                    <input
                        type="text"
                        id="deadline"
                        className="form-control"
                        value={deadline ?? ''}
                        onChange={(e) => setDeadline(Number(e.target.value))}
                        required
                    />
                </div>
                <br />
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </section>
    );
};

export default RoadMapPointAdd;
