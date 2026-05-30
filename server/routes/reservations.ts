import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import reservationsController from '../controllers/reservations-controller';

const router = Router();

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

export default router;