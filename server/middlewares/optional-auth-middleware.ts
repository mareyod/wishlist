import type { Request, Response, NextFunction } from 'express';
import tokenService from '../service/token-service';

export default function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            req.user = null
            return next()
        }

        const parts =
            authorizationHeader.split(' ')

        if (
            parts.length !== 2 ||
            parts[0] !== 'Bearer'
        ) {
            req.user = null
            return next()
        }

        const accessToken = parts[1]

        if (!accessToken) {
            req.user = null
            return next()
        }

        const userData =
            tokenService.validateAccessToken(
                accessToken
            )

        if (!userData) {
            req.user = null
            return next()
        }

        req.user = userData
        
        next()

    } catch (e) {

        req.user = null

        next()
    }
}