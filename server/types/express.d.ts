import type { JwtUserPayload } from './auth.types';
declare global {
    namespace Express {
        interface Request {
            user?: JwtUserPayload | null;
            file?: Express.Multer.File;
        }
    }
}

export {};