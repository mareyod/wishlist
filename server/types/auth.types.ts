import type { Request } from 'express';
import type { UserDtoInterface } from '../types/user.types';

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
};

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

export interface ErrorResponse {
    readonly message: string;
}

export interface AuthenticatedRequest extends Request {
    user: JwtUserPayload;
}

export interface OptionalAuthRequest extends Request {
    user: JwtUserPayload | null;
}