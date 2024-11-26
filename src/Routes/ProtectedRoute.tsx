import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/authProvider';
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { token, logout } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decodedToken: any = jwtDecode(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
            logout();
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        return children;
    } catch (err) {
        logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;