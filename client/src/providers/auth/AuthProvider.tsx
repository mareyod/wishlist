import { createContext, useCallback, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { 
    refresh as refreshApi, 
    logout as logoutApi, 
    login as loginApi, 
    registration as registrationApi, 
    uploadAvatar as uploadAvatarApi,
    changeAvatar as changeAvatarApi 
} from "../../api/authApi";
import { setAccessToken, getAccessToken } from '../../api/apiClient'

import type { UserDtoInterface } from "../../types/user.types";
import type { LoginBody, RegistrationBody, AuthResponse } from "../../types/auth.types";
import type { AuthContextValue } from "../../types/auth-context.types";

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextValue | null>(null);


export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserDtoInterface | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    const initialized = useRef<boolean>(false);

    const isAuthenticated = !!user

    const init = useCallback( async (): Promise<void> => {
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

    const login = async (payload: LoginBody): Promise<AuthResponse> => {
        const data = await loginApi(payload)

        setUser(data.user)
        setAccessToken(data.accessToken)

        return data;
    }

    const register = async (payload: RegistrationBody): Promise<AuthResponse> => {
        const data = await registrationApi(payload)

        setUser(data.user)
        setAccessToken(data.accessToken)

        return data
    }

    const logout = async (): Promise<void> => {
        await logoutApi();

        setUser(null);
        setAccessToken(null);
    };

    const refresh = async (): Promise<string> => {
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
            uploadAvatarApi,
            changeAvatarApi
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}