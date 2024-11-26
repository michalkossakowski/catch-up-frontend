import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import axiosInstance, {setLogoutHandler} from "../../axiosConfig.ts";

interface User {
    id: string;
    name: string;
    email?: string;
    role?: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    setToken: (newToken: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
    hasRole: (requiredRole: string) => boolean;
}

// creates context that can be shared across the app (default: undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    // retrieves  existing token and user data from localStorage when the app loads
    const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser_] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));

    const setToken = (newToken: string | null) => {
        setToken_(newToken);
    };

    // Saves user data to localStorage when set, excluding password
    const setUser = (user: User | null) => {
        if (user) {
            const userWithoutPassword = { ...user, password: undefined };
            setUser_(userWithoutPassword);
            localStorage.setItem("user", JSON.stringify(userWithoutPassword));
            console.log(userWithoutPassword);
        } else {
            setUser_(null);
            localStorage.removeItem("user");
        }
    };

    const refreshToken = async () => {
        try {
            const response = await axiosInstance.post('Auth/RefreshToken', {
                token: token,
                refreshToken: refreshToken
            });

            const { newAccessToken } = response.data;
            setToken(newAccessToken);
            return true;
        } catch (error) {
            logout(); // Force logout if refresh fails
            return false;
        }
    };

    // Logout method to clear authentication state
    const logout = () => {
        setToken(null);
        setUser(null);
    };

    // Method to check user role
    const hasRole = (requiredRole: string) => {
        return user?.role === requiredRole;
    };

    // stores / removes the token from localStorage
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
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

// Custom hook to use the authentication context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;