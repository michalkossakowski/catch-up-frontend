import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axiosConfig';
import { useAuth } from '../../Provider/authProvider';
import { jwtDecode } from 'jwt-decode';
import './LoginComponent.css';
import { useTranslation } from 'react-i18next';
import { Button, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { availableLanguages, changeLanguage, normalizeLanguage } from '../../i18n';
import backgroundVideoDark from '/Login/dark_office.mp4';
import backgroundVideoLight from '/Login/light_office.mp4';

const darkThemeMusic = '/Login/electro-summer-positive-party.mp3';
const lightThemeMusic = '/Login/chinese-new-year-festivel_2.mp3';

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
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  const updateMusicSource = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      backgroundMusicRef.current.src = theme === 'night' ? darkThemeMusic : lightThemeMusic;
      if (isMusicPlaying) {
        backgroundMusicRef.current.load();
        backgroundMusicRef.current.play().catch(() => {
          setIsMusicPlaying(false);
        });
      }
    }
  };

  useEffect(() => {
    backgroundMusicRef.current = new Audio(theme === 'night' ? darkThemeMusic : lightThemeMusic);
    backgroundMusicRef.current.loop = true;

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current.src = '';
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMusicSource();
  }, [theme]);

  const toggleMusic = async () => {
    if (!backgroundMusicRef.current) {
      console.error('Audio element not initialized');
      return;
    }

    try {
      if (isMusicPlaying) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
        setIsMusicPlaying(false);
      } else {
        if (backgroundMusicRef.current.readyState < 2) {
          await backgroundMusicRef.current.load();
        }
        await backgroundMusicRef.current.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      setIsMusicPlaying(false);
    }
  };

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
      } else if (userData?.position === 'Newbie') {
        navigate('/newbiehomepage');
      } else if (userData?.position === 'Admin') {
        navigate('/adminhomepage');
      } else if (userData?.position === 'Mentor') {
        navigate('/mentorhomepage');
      } else {
        navigate('/');
      }
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
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
    <div className="video-background">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video"
        key={theme}
      >
        <source
          src={theme === 'night' ? backgroundVideoDark : backgroundVideoLight}
          type="video/mp4"
        />
      </video>

      {/* Overlay Content */}
      <div className="content-overlay">
        <Navbar expand="lg" className="navbar-custom-login">
          <Nav className="ms-auto d-flex align-items-center flex-row flex-wrap mx-1">
            <Button
              onClick={toggleMusic}
              className="theme-btn"
              title="Turn on/off music"
            >
              {isMusicPlaying ? (
                <i className="bi bi-volume-up" />
              ) : (
                <i className="bi bi-volume-mute" />
              )}
            </Button>
            <Button
              onClick={toggleTheme}
              className="theme-btn"
              title="Dark/Light theme"
            >
              {theme === 'night' ? (
                <i className="bi bi-brightness-high" />
              ) : (
                <i className="bi bi-moon" />
              )}
            </Button>
            <NavDropdown
              id="nav-language-dropdown"
              title={
                <img
                  src={`/locales/${normalizeLanguage(i18n.language)}/1x1.svg`}
                  alt={i18n.language}
                  className="nav-language-img"
                  width="30"
                  height="30"
                />
              }
              align="end"
              drop="down"
            >
              {Object.keys(availableLanguages).map((lng) => (
                <NavDropdown.Item key={lng} onClick={() => changeLanguage(lng)}>
                  <img
                    src={`/locales/${normalizeLanguage(lng)}/4x3.svg`}
                    alt={lng}
                    width="20"
                    height="15"
                    style={{ marginRight: '10px' }}
                  />
                  {availableLanguages[lng]}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
        </Navbar>

        <h1 className="welcome">{t('welcome-in-catchup')}</h1>
        <h2 className="subtitle">{t('the-coldest-onboarding-app-on-the-market')}</h2>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card shadow-lg p-4 login-container">
            <h2 className="text-center mb-4">{t('login')}</h2>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="username"
                  placeholder='Enter your email...'
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t('password')}
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="password"
                  placeholder='Enter your password...'
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
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {t('loading')}
                  </>
                ) : (
                  t('login')
                )}
              </button>
            </form>
          </div>
        </div>
        <footer className="mt-3 login-footer">
          <p className="text-center">
            © 2024-2025 Made by UnhandledException
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginComponent;