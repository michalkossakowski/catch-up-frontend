import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Select from 'react-select';
import { UserDto } from '../../dtos/UserDto';
import { getMyNewbies } from '../../services/userService';
import Loading from '../Loading/Loading';
import { customSelectStyles } from '../../componentStyles/selectStyles';
import RoadMapExplore from './RoadMapExplore';


interface SelectOption {
  value: string;
  label: string;
}

const RoadMapManage: React.FC = () => {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [selectedNewbieId, setSelectedNewbieId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const newbieOptions: SelectOption[] = users.map((user) => ({
    value: user.id || '',
    label: `${user.name || ''} ${user.surname || ''}`.trim(),
  }));

  const handleSelectChange = (selectedOption: string ) => {
    localStorage.setItem('selectedNewbie', selectedOption);
    setSelectedNewbieId(selectedOption);
  }
  useEffect(() => {
    setLoading(true);
    const loadNewbies = async () => {
      try {
        setUsers(await getMyNewbies());
        
        const selectedNewbie = localStorage.getItem('selectedNewbie');
        
        if (selectedNewbie) {
          setSelectedNewbieId(selectedNewbie);
        }
      } catch (error) {
        setShowAlert(true);
        setAlertMessage('Error loading newbies: ' + error);
      } finally {
        setLoading(false);
      }
    };
    loadNewbies();
  }, []);

  return (
    <>
      <h1 className="title">
        <i className="bi bi-compass" /> Manage Road Maps
      </h1>

      {loading ? (
        <div className="loaderBox">
          <Loading />
        </div>
      ) : (
        <>
            {showAlert ? (
                <div className="d-flex justify-content-center align-items-center m-4">
                    <Alert className="alert" variant="danger">
                    {alertMessage}
                    </Alert>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-center align-items-center mt-4">
                        <h4 className="me-2 mb-1">
                            <i className="bi bi-people" /> Newbie:
                        </h4>
                        <Select
                            className="newbie-select"
                            isClearable={true}
                            isSearchable={true}
                            options={newbieOptions}
                            placeholder="Select Newbie..."
                            onChange={(option) => handleSelectChange(option ? option.value : '')}
                            value={newbieOptions.find((option) => option.value === selectedNewbieId) || null}
                            closeMenuOnSelect={true}
                            styles={customSelectStyles}
                        />
                    </div>
                    
                    {selectedNewbieId.trim() !== "" ? (
                        <RoadMapExplore manageMode={true} newbieId={selectedNewbieId}/>
                    ):(
                        <div className="d-flex justify-content-center align-items-center m-4">
                            <Alert className='alert' variant='info'>
                                Select newbie to explore his Road Maps
                            </Alert>
                        </div>
                    )}

                </>
            )}
        </>
      )}
    </>
  );
};

export default RoadMapManage;