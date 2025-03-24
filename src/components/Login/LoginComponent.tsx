import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { jwtDecode } from 'jwt-decode';
import './LoginComponent.css';
import { useTranslation } from "react-i18next";

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAccessToken, setRefreshToken, setUser } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

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
                    setError(t('invalid-email-or-password'));
                } else {
                    setError(t('an-unexpected-error-occurred-please-try-again'));
                }
            } else {
                setError(t('api-is-down-sorry'));
            }
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className='welcome'>{t('welcome-in-catchup')}</h1>
            <h2 className='subtitle'>{t('the-coldest-onboarding-app-on-the-market')}</h2>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card shadow-lg p-4   login-container">
                    <h2 className="text-center mb-4">{t('login')}</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">{t('email')}</label>
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
                            <label htmlFor="password" className="form-label">{t('password')}</label>
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
                                    {t('loading')}
                                </>
                            ) : t('login')}
                        </button>
                    </form>
                </div>
            </div>
            <footer className="mt-auto">
                <p className="text-center text-muted small">
                    © 2024 Made by UnhandledException
                </p>
            </footer>
        </>
    );
};

export default LoginComponent;