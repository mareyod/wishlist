import { validationResult } from 'express-validator';

import wishService from '../service/wish-service';
import ApiError from '../exceptions/api-error';

import type { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';


type NicknameParams = ParamsDictionary & {
    nickname: string;
}

type WishIdParams = ParamsDictionary & {
    id: string;
}

interface CreateWishBody {
    title: string;
    description?: string;
    external_link?: string;
    price?: string;
    is_public: string;
    visibility_group_ids?: string;
}

interface UpdateWishBody extends CreateWishBody {
    remove_image?: string;
}


class WishController {

    async getWishes(req: Request<NicknameParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            const viewerId = req.user?.id || null
            const nickname = req.params.nickname
            const wishes = await wishService.getWishes(nickname, viewerId)
            res.json(wishes)
        } catch (e) {
            next(e)
        }
    }

    async createWish(req: Request<Record<string, never>, unknown, CreateWishBody>,  res: Response, next: NextFunction): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest(
                        'Ошибка валидации',
                        errors.array()
                    )
                )
            }
            if (!req.user) {
                return next(
                    ApiError.UnauthorizedError()
                );
            }

            const wish =  await wishService.createWish({ ownerId: req.user.id, body: req.body, file: req.file})

            res.json(wish)

        } catch (e) {
            next(e)
        }
    }

    async updateWish(req: Request<WishIdParams, unknown, UpdateWishBody>,  res: Response, next: NextFunction): Promise<void> {
        try {

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest( 'Ошибка валидации', errors.array())
                )
            }

            if (!req.user) {
                return next(
                    ApiError.UnauthorizedError()
                );
            }
            
            const wish = await wishService.updateWish({
                wishId: Number(req.params.id),
                ownerId: req.user.id,
                body: req.body,
                file: req.file
            })

            res.json(wish)

        } catch (e) {
            next(e)
        }
    }

    async deleteWish(req: Request<WishIdParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                return next(
                    ApiError.UnauthorizedError()
                );
            }
            const result = await wishService.deleteWish(Number(req.params.id), req.user.id)

            res.json(result)

        } catch (e) {
            next(e)
        }
    }
}
export default new WishController();