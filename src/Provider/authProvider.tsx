import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {setLogoutHandler} from "../../axiosConfig.ts";
import Cookies from "js-cookie";

// Updated to match the UserDto from the backend
interface User {
    id?: string;
    name?: string;
    surname?: string;
    email?: string;
    type?: string;
    position?: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (newToken: string | null) => void;
    setUser: (newUser: User | null) => void;
    logout: () => void;
    hasRole: (requiredRole: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken_] = useState<string | null>(Cookies.get('token') || null);

    // Parse user from cookies, using JSON.parse to handle the stored object
    const [user, setUser_] = useState<User | null>(() => {
        const storedUser = Cookies.get('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const setToken = (newToken: string | null) => {
        setToken_(newToken);
        if (newToken) {
            Cookies.set('token', newToken, {
                expires: 1,  // 1 day expiration
                path: '/',   // available across the entire site
                secure: true // only send over HTTPS
            });
        } else {
            Cookies.remove('token');
        }
    };

    const setUser = (newUser: User | null) => {
        if (newUser) {
            // Exclude password when storing in cookies
            const { ...userToStore } = newUser;
            Cookies.set('user', JSON.stringify(userToStore), {
                expires: 1,  // 1 day expiration
                path: '/',   // available across the entire site
                secure: true // only send over HTTPS
            });
            setUser_(userToStore);
        } else {
            Cookies.remove('user');
        }
    };

    /*
    const refreshToken = async () => {
        try {
            const response = await axiosInstance.post('Auth/RefreshToken', {
                token: token,
                refreshToken: token
            });

            const { newAccessToken } = response.data;
            setToken(newAccessToken);
            return true;
        } catch (error) {
            logout();
            return false;
        }
    };
    */

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    const hasRole = (requiredRole: string) => {
        return user?.type === requiredRole;
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
        setLogoutHandler(logout);
    }, [token]);

    const contextValue = useMemo(
        () => ({
            token,
            user,
            setToken,
            setUser,
            logout,
            hasRole
        }),
        [token, user]
    );

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;