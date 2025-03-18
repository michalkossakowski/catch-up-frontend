import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../../../axiosConfig';
import Loading from '../Loading/Loading';

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
  const navigate = useNavigate(); // Inicjalizacja useNavigate

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
    return <p><Loading/></p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="mt-4">
      <h2>Unassigned Newbies</h2>
      <h3>Count: {newbies.length}</h3>
      {/* Dodanie przycisku */}
      <button 
        className="btn btn-primary mb-3" 
        onClick={() => navigate("/employesassignment")} 
      >
        Go to Assignments
      </button>
      {newbies.length === 0 ? (
        <p>No unassigned newbies found.</p>
      ) : (
        <table className="table table-striped">
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
  );
};

export default UnassignedNewbiesList;