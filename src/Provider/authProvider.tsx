import {createContext, ReactNode, useContext, useMemo, useState} from "react";
import Cookies from "js-cookie";
import fileService from "../services/fileService.ts";
import {UserDto as User} from "../dtos/UserDto.ts"
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store.ts";
import {clearTasks} from "../store/taskSlice";
import {stopConnection} from "../services/signalRService";
import {jwtDecode} from "jwt-decode";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    avatar: string | null;
    setAccessToken: (newToken: string | null) => void;
    setRefreshToken: (newRefreshToken: string | null) => void;
    setUser: (newUser: User | null) => void;
    updateAvatar: (avatarBlob: Blob) => Promise<void>;
    logout: () => void;
    getRole: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const storeAvatar = (avatarBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            localStorage.setItem('userAvatar', base64String);
            resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(avatarBlob);
    });
};

const loadStoredAvatar = (): string | null => {
    return localStorage.getItem('userAvatar');
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessToken_] = useState<string | null>(Cookies.get('accessToken') || null);
    const [refreshToken, setRefreshToken_] = useState<string | null>(Cookies.get('refreshToken') || null);
    const [avatar, setAvatar] = useState<string | null>(loadStoredAvatar());
    const dispatch: AppDispatch = useDispatch();
    const [user, setUser_] = useState<User | null>(() => {
        const storedUser = Cookies.get('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const setAccessToken = (newToken: string | null) => {
        setAccessToken_(newToken);
        if (newToken) {
            Cookies.set('accessToken', newToken, {
                path: '/',
                secure: true
            });
        } else {
            Cookies.remove('accessToken');
        }
    };

    const setRefreshToken = (newRefreshToken: string | null) => {
        setRefreshToken_(newRefreshToken);
        if (newRefreshToken) {
            Cookies.set('refreshToken', newRefreshToken, {
                path: '/',
                secure: true
            });
        } else {
            Cookies.remove('refreshToken');
        }
    };

    const fetchAndStoreAvatar = async (avatarId: number | null) => {
        if (!avatarId) {
            localStorage.removeItem('userAvatar');
            setAvatar(null);
            return;
        }

        try {
            const blob = await fileService.downloadFile(avatarId);
            const avatarBase64 = await storeAvatar(blob);
            setAvatar(avatarBase64);
        } catch (error) {
            console.error('Error fetching avatar:', error);
        }
    };

    const updateAvatar = async (avatarBlob: Blob) => {
        const avatarBase64 = await storeAvatar(avatarBlob);
        setAvatar(avatarBase64);
    };

    const setUser = (newUser: User | null) => {
        if (newUser) {
            const { ...userToStore } = newUser;
            Cookies.set('user', JSON.stringify(userToStore), {
                path: '/',
                secure: true
            });
            setUser_(userToStore);
            if (userToStore.avatarId) {
                fetchAndStoreAvatar(userToStore.avatarId);
            }
        } else {
            Cookies.remove('user');
            localStorage.removeItem('userAvatar');
            setAvatar(null);
            setUser_(null);
        }
    };

    const logout = async () => {
        await stopConnection();
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('userAvatar');
        dispatch(clearTasks());
        setAvatar(null);
    };

    const getRole = async (): Promise<string> => {
        const token = Cookies.get("accessToken");

        try {
            if(token != null){
                const decodedToken: any = jwtDecode(token);
                return decodedToken.role || "Newbie"
            }
        } catch (error : any) {
            throw new Error("Failed to fetch user role" + error);
        }

        return "Newbie";
    };

    const contextValue = useMemo(
        () => ({
            accessToken,
            refreshToken,
            user,
            avatar,
            setAccessToken,
            setRefreshToken,
            setUser,
            updateAvatar,
            logout,
            getRole
        }),
        [user, avatar]
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