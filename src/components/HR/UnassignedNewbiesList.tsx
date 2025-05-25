import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../axiosConfig';
import Loading from '../Loading/Loading';
import { Alert } from 'react-bootstrap';
import './UnassignedNewbiesList.css';

interface Newbie {
  id: string;
  name: string;
  surname: string;
  position: string;
}

const UnassignedNewbiesList: React.FC = () => {
  const [newbies, setNewbies] = useState<Newbie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnassignedNewbies = async () => {
      try {
        const response = await axiosInstance.get('/NewbieMentor/GetAllUnassignedNewbies');
        setNewbies(response.data);
      }
      catch (err: any) {
        setError(err.response?.data?.message || 'An error during fetching newbies.');
      }
      finally {
        setLoading(false);
      }
    };

    fetchUnassignedNewbies();
  }, []);

  if (loading) {
    return <div><Loading /></div>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className='mt-3'>
      <h5><i className='bi bi-people'/> Unassigned Newbies: {newbies.length}</h5>
        <div className="mt-3">
          {newbies.length === 0 ? (
            <Alert className="alert-no-newbies" variant="info">
              No unassigned newbies found.
            </Alert>
          ) : (
            <table className="table-unassigned-newbies table table-striped ">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {newbies.map((newbie) => (
                  <tr key={newbie.id}>
                    <td>{newbie.name}</td>
                    <td>{newbie.surname}</td>
                    <td>{newbie.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </div>
  );
};

export default UnassignedNewbiesList;