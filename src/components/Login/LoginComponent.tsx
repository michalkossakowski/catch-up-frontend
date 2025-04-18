import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { jwtDecode } from 'jwt-decode';
import './LoginComponent.css';
import { useTranslation } from "react-i18next";
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {availableLanguages, changeLanguage, normalizeLanguage} from "../../i18n";

interface LoginComponentProps {
    toggleTheme: () => void;
    theme: string;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ toggleTheme, theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setAccessToken, setRefreshToken, setUser } = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

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
            if (userData?.position === 'HR') {
                navigate('/hrhomepage');
            }
            else if (userData?.position === 'Newbie') {
                navigate('/newbiehomepage');
            }
            else if (userData?.position === 'Admin') {
                navigate('/adminhomepage');
            }
            else if (userData?.position === 'Mentor') {
                navigate('/mentorhomepage');
            }
            else {
                navigate('/');
            }

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
            <Navbar expand="lg">
                <Nav className="ms-auto d-flex align-items-center flex-row flex-wrap mx-1">
                    <Button onClick={toggleTheme} className='theme-btn' title='Dark/Light theme'>
                        {theme === 'night' ? <i className="bi bi-brightness-high" /> : <i className="bi bi-moon" />}
                    </Button>

                    <NavDropdown
                        id="nav-language-dropdown"
                        title={<img src={`/locales/${normalizeLanguage(i18n.language)}/1x1.svg`} alt={i18n.language} className='nav-language-img' width="30" height="30" />}
                        align="end"
                        drop="down"
                    >
                        {Object.keys(availableLanguages).map((lng) => (
                            <NavDropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
                                <img src={`/locales/${normalizeLanguage(lng)}/4x3.svg`} alt={lng} width="20" height="15" style={{ marginRight: "10px" }} />
                                {availableLanguages[lng]}
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>
                </Nav>
            </Navbar>

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