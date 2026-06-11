import type { UserDtoInterface } from "./user.types";

export interface JwtUserPayload {
    readonly id: number;
    readonly email: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly isActivated: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserDtoInterface;
}

export interface TokenPair {
    readonly accessToken: string;
    readonly refreshToken: string;
}

export interface RegistrationBody {
    readonly email: string;
    readonly password: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
}

export interface LoginBody {
    readonly email: string;
    readonly password: string;
}

export interface ActivationParams {
    readonly link: string;
}

export interface RefreshTokenCookies {
    readonly refreshToken: string;
}

export interface AvatarUploadResponse {
    readonly path: string;
}

export interface ChangeAvatarResponse {
    readonly user: UserDtoInterface;
    readonly avatar_url: string;
}

export interface ErrorResponse {
    readonly message: string;
}