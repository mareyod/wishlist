const Router = require('express').Router
const router = new Router()

const authMiddleware = require('../middlewares/auth-middleware')
const reservationsController = require('../controllers/reservations-controller')


router.post(
    '/:itemId', 
    authMiddleware, 
    reservationsController.reserve
)


router.delete(
    '/:itemId', 
    authMiddleware, 
    reservationsController.unreserve
)

router.get(
    '/:itemId', 
    authMiddleware, 
    reservationsController.getReservation
)

module.exports = router