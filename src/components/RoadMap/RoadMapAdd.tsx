import React, { useState } from 'react';
import { RoadMapDto } from '../../dtos/RoadMapDto';
import { addRoadMap} from '../../services/roadMapService';

const RoadMapAdd: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [newbieId, setNewbieId] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newRoadMap: RoadMapDto = {
            name,
            newbieId
        };

        addRoadMap(newRoadMap)
            .then(() => {
                setName('');
                setNewbieId('');
            })
            .catch((error) => {
                console.error('Error adding RoadMap:', error);
            });
    };

    return (
        <section className='editBox'>
            <h2>Add RoadMap</h2>
            <form onSubmit={handleSubmit} className="container-lg text-left">
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
                    <label htmlFor="newbieId">Newbie ID:</label>
                    <input
                        type="text"
                        id="newbieId"
                        className="form-control"
                        value={newbieId}
                        onChange={(e) => setNewbieId(e.target.value)}
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

export default RoadMapAdd;
