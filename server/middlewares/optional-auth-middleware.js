const tokenService = require('../service/token-service')

module.exports = function (req, res, next) {

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