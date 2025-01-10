import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { jwtDecode } from 'jwt-decode';

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAccessToken, setRefreshToken, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axiosInstance.post('Auth/Login', { email, password });
            const { accessToken, refreshToken } = response.data;
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            const decodedToken: any = jwtDecode(accessToken);
            const userId = decodedToken.nameid;

            const userResponse = await axiosInstance.get(`User/GetById/${userId}`);
            const userData = userResponse.data;
            setUser(userData);

            navigate('/');
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 404) {
                    setError('Invalid email or password');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
            } else {
                setError('API is down, sorry');
            }
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5 mb-5 vw-100">
            <div className="card shadow-lg p-4 w-50">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoComplete="username"
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
                            disabled={isLoading}
                            autoComplete="password"
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Loading...
                            </>
                        ) : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;