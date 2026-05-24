const wishService = require('../service/wish-service')

const ApiError = require('../exceptions/api-error')

const { validationResult } = require('express-validator')

class WishController {

    async getWishes(req, res, next) {
        try {
            const viewerId = req.user?.id || null
            const nickname = req.params.nickname
            const wishes = await wishService.getWishes(nickname, viewerId)
            return res.json(wishes)
        } catch (e) {
            next(e)
        }
    }

    async createWish(req, res, next) {
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

            const wish =  await wishService.createWish({ ownerId: req.user.id, body: req.body, file: req.file})

            return res.json(wish)

        } catch (e) {
            next(e)
        }
    }

    async updateWish(req, res, next) {
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
            const wish = await wishService.updateWish({
                    wishId: req.params.id,
                    ownerId: req.user.id,
                    body: req.body,
                    file: req.file
                })

            return res.json(wish)

        } catch (e) {
            next(e)
        }
    }

    async deleteWish(
        req,
        res,
        next
    ) {
        try {

            const wish =
                await wishService.deleteWish(
                    req.params.id,
                    req.user.id
                )

            return res.json(wish)

        } catch (e) {
            next(e)
        }
    }
}

module.exports = new WishController()