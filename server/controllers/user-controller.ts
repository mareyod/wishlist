import { NextFunction, Request, Response } from "express";
import { LoginBody, RegistrationBody, ActivationParams, AvatarUploadResponse, ErrorResponse, RefreshTokenCookies } from "../types/auth.types";

import { validationResult } from "express-validator";

import ApiError from "../exceptions/api-error";
import userService from "../service/user-service";



class UserController{
    async registration(req: Request<Record<string, never>, unknown, RegistrationBody>, res: Response, next: NextFunction): Promise<void>{
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password, nickname, avatar_url} = req.body

            const userData = await userService.registration(
                email,
                password,
                nickname,
                avatar_url
            )
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch(e){
            next(e)
        }
    }

    async login(req: Request<Record<string, never>, unknown, LoginBody>, res: Response, next: NextFunction): Promise<void>{
        try{
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(userData)
        } catch(e){
            next(e)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            const {refreshToken} = req.cookies as RefreshTokenCookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            res.json(token)
        } catch(e){
            next(e)
        }
    }

    async activate(req: Request<ActivationParams>, res: Response, next: NextFunction): Promise<void>{
        try{
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL ?? "/")
        } catch(e){
            next(e)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            const {refreshToken} = req.cookies as RefreshTokenCookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            res.json(userData)


        } catch(e){
            next(e)
        }
    }
    async uploadAvatar(req: Request, res: Response<AvatarUploadResponse | ErrorResponse>, next: NextFunction): Promise<void>{
        try{

            if(!req.file){
                res.status(400).json({message: 'Файл не загружен'})
                return
            }

            res.json({
                path: `/uploads/avatars/${req.file.filename}`
            })

        } catch(e){
            next(e)
        }
    }

    async changeAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            return next(ApiError.UnauthorizedError(),);
        }

        const userId = req.user.id;
        const file = req.file;

        const data = await userService.changeAvatar(userId, file);

        res.json(data);
    } catch (e) {
        next(e);
    }
}

}

export default new UserController();