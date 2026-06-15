import type { UserDtoInterface } from './user.types';
import type { AuthResponse, LoginBody, RegistrationBody, AvatarUploadResponse, ChangeAvatarResponse } from './auth.types';

export interface AuthContextValue {
    readonly user: UserDtoInterface | null;
    readonly isLoading: boolean;
    readonly isAuthenticated: boolean;
    readonly login: (payload: LoginBody) => Promise<AuthResponse>;
    readonly register: (payload: RegistrationBody) => Promise<AuthResponse>;
    readonly logout: () => Promise<void>;
    readonly refresh: () => Promise<string>;
    readonly uploadAvatarApi: (file: File) => Promise<AvatarUploadResponse>;
    readonly changeAvatarApi: (file: File) => Promise<ChangeAvatarResponse>;
}