import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7097/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

const handleRefreshToken = async (refreshToken: string, config: any) => {
    if (isRefreshing && refreshPromise) {
        const newToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
    }

    const decodedRefreshToken: any = jwtDecode(refreshToken);
    const isRefreshTokenExpired = decodedRefreshToken.exp * 1000 < Date.now();

    if (isRefreshTokenExpired) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        window.location.href = '/login';
        throw new Error('Refresh token expired');
    }

    isRefreshing = true;

    // Create a new refresh promise
    refreshPromise = axios.post(
        'https://localhost:7097/api/Auth/Refresh',
        refreshToken,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ).then(response => {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        Cookies.set('accessToken', newAccessToken, {
            path: '/',
            secure: true
        });
        Cookies.set('refreshToken', newRefreshToken, {
            path: '/',
            secure: true
        });

        return newAccessToken;
    }).finally(() => {
        isRefreshing = false;
        refreshPromise = null;
    });

    // Wait for the refresh to complete
    const newAccessToken = await refreshPromise;
    config.headers.Authorization = `Bearer ${newAccessToken}`;
    return config;
};

const PUBLIC_URLS = ['Auth/Login', 'Auth/Refresh'];

axiosInstance.interceptors.request.use(
    async (config) => {
        if (PUBLIC_URLS.some(url => config.url?.includes(url))) {
            return config;
        }

        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (accessToken) {
            const decodedToken: any = jwtDecode(accessToken);
            const isAccessTokenExpired = decodedToken.exp * 1000 < Date.now();

            if (isAccessTokenExpired) {
                if (!refreshToken) {
                    Cookies.remove('accessToken');
                    Cookies.remove('refreshToken');
                    Cookies.remove('user');
                    window.location.href = '/login';
                    throw new Error('No refresh token available');
                }

                return handleRefreshToken(refreshToken, config);
            }

            config.headers.Authorization = `Bearer ${accessToken}`;
        } else if (refreshToken) {
            return handleRefreshToken(refreshToken, config);
        } else {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            window.location.href = '/login';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;