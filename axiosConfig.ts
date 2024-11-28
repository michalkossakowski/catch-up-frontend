import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7097/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to handle token logout (you'll need to pass this from your auth context)
let logoutFunction: (() => void) | null = null;

export const setLogoutHandler = (logout: () => void) => {
    logoutFunction = logout;
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');

        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const isTokenExpired = decodedToken.exp * 1000 < Date.now();

                if (isTokenExpired) {
                    if (logoutFunction) {
                        logoutFunction();
                    }
                    throw new Error('Token expired');
                }

                config.headers.Authorization = `Bearer ${token}`;
            } catch (error) {
                if (logoutFunction) {
                    logoutFunction();
                }
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);

// Response interceptor for handling unauthorized errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (logoutFunction) {
                logoutFunction();
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;