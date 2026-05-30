import type { JwtPayload } from './auth.types';

export interface AuthRequest extends Express.Request {
    user: JwtPayload;
}

export interface OptionalAuthRequest extends Express.Request {
    user: JwtPayload | null;
}