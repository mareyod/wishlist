import { createContext, useCallback, useEffect, useState, useRef } from "react";
import { 
    refresh as refreshApi, 
    logout as logoutApi, 
    login as loginApi, 
    registration as registrationApi, 
    uploadAvatar as uploadAvatarApi 
} from "../../api/authApi";
import { setAccessToken, getAccessToken } from '../../api/apiClient'

export const AuthContext = createContext(null);

export function AuthProvider({ children }){
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    
    const initialized = useRef(false);

    const isAuthenticated = !!user

    const init = useCallback( async ()=> {
        setIsLoading(true);
        try {
            const data = await refreshApi()
            setUser(data.user)
            setAccessToken(data.accessToken)
        } catch {
            setUser(null)
            setAccessToken(null)
        } finally {
            setIsLoading(false);
        }

    }, [])

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        init();
    }, [init]);

    const login = async (payload) => {
        const data = await loginApi(payload)

        setUser(data.user)
        setAccessToken(data.accessToken)

        return data;
    }

    const register = async (payload) => {
        const data = await registrationApi(payload)

        setUser(data.user)
        setAccessToken(data.accessToken)

        return data
    }

    const logout = async () => {
        await logoutApi();

        setUser(null);
        setAccessToken(null);
    };

    const refresh = async () => {
        const data = await refreshApi();

        setUser(data.user);
        setAccessToken(data.accessToken);

        return data.accessToken;
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            accessToken: getAccessToken(),
            isLoading,
            isAuthenticated,
            login,
            register,
            logout,
            refresh,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}