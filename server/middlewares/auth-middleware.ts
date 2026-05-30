import { NextFunction, Response, Request } from "express";

import ApiError from "../exceptions/api-error";
import tokenService from "../service/token-service";



export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {

    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const [scheme, accessToken] = authorizationHeader.split(" ");

        if (scheme !== "Bearer" || !accessToken) {
            return next(ApiError.UnauthorizedError())
        }


        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        
        next()

    } catch (e) {

        return next(ApiError.UnauthorizedError())
    }
}