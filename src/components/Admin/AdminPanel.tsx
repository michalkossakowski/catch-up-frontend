import { useState } from 'react';
import axiosInstance from '../../../axiosConfig';

function AdminPanel() {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        type: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e: { target: { id: any; value: any; }; }) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        await axiosInstance.post('/User/Add', formData);

        setFormData({
            name: '',
            surname: '',
            email: '',
            password: '',
            type: ''
        });
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh', backgroundColor: '#101010' }}
        >
            <div className="card shadow-lg p-4" style={{ width: '450px' }}>
                <h2 className="text-center mb-4">Add User</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="surname" className="form-label">Surname</label>
                        <input
                            type="text"
                            id="surname"
                            className="form-control"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">User Type</label>
                        <select
                            id="type"
                            className="form-control"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select User Type</option>
                            <option value="Newbie">Admin</option>
                            <option value="Mentor">User</option>
                            <option value="HR">Manager</option>
                            <option value="Admin">HR</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AdminPanel;