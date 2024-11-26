import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { jwtDecode } from "jwt-decode";

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Step 1: Authenticate and get the accessToken
            const response = await axiosInstance.post('Auth/Login', { email, password });
            const { accessToken } = response.data;

            // Step 2: Store the accessToken in context and localStorage
            setToken(accessToken);
            // Optionally store the refreshToken if needed
            // setRefreshToken(refreshToken);

            // Step 3: Decode the accessToken to get the user_id
            const decodedToken: any = jwtDecode(accessToken); // Decode the token to extract user info
            const userId = decodedToken.nameid;  // Assuming the token contains the user ID

            // Step 4: Fetch user data using the userId from the API
            const userResponse = await axiosInstance.get(`/User/GetById/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Pass token for authorization
                }
            });

            // Step 5: Store user data in context and localStorage
            setUser(userResponse.data);

            // Step 6: Redirect to the home page (or wherever you want after login)
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#101010' }}>
            <div className="card shadow-lg p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
