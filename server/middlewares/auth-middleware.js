const ApiError = require('../exceptions/api-error')

const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {

    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) {
            return next(
                ApiError.UnauthorizedError()
            )
        }

        const parts =
            authorizationHeader.split(' ')

        if (
            parts.length !== 2 ||
            parts[0] !== 'Bearer'
        ) {
            return next(
                ApiError.UnauthorizedError()
            )
        }

        const accessToken = parts[1]

        if (!accessToken) {
            return next(
                ApiError.UnauthorizedError()
            )
        }

        const userData =
            tokenService.validateAccessToken(
                accessToken
            )

        if (!userData) {
            return next(
                ApiError.UnauthorizedError()
            )
        }

        req.user = userData

        next()

    } catch (e) {

        return next(
            ApiError.UnauthorizedError()
        )
    }
}