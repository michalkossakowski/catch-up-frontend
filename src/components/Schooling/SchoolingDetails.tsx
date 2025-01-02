import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const SchoolingDetails: React.FC = () => {
    const fullSchooling = useSelector((state: RootState) => state.schooling.selectedSchooling);

    
    return (
        <div>
        <h1>Schooling Details</h1>
        {fullSchooling ? (
            <>
                <p>ID: {fullSchooling.schooling?.id}</p>
                <p>Title: {fullSchooling.schooling?.title}</p>
                <p>Description: {fullSchooling.schooling?.description}</p>
            </>
        ) : (
            <p>No schooling selected</p>
        )}
    </div>
    )
}

export default SchoolingDetails;
