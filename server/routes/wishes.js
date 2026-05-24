
const Router = require('express').Router
const { body } = require('express-validator')

const authMiddleware = require('../middlewares/auth-middleware')
const optionalAuthMiddleware = require('../middlewares/optional-auth-middleware')

const upload = require('../middlewares/upload-wish-image')

const wishController = require('../controllers/wish-controller')

const router = new Router()

router.get(
    '/:nickname',
    optionalAuthMiddleware,
    wishController.getWishes
)

router.post(
    '/',
    authMiddleware,
    upload.single('image'),

    body('title')
        .trim()
        .isLength({
            min: 1,
            max: 255
        }),

    wishController.createWish
)

router.put(
    '/:id',
    authMiddleware,
    upload.single('image'),

    body('title')
        .trim()
        .isLength({
            min: 1,
            max: 255
        }),

    wishController.updateWish
)

router.delete(
    '/:id',
    authMiddleware,
    wishController.deleteWish
)

module.exports = router