import { Router } from 'express';
import { body } from 'express-validator';

import authMiddleware from '../middlewares/auth-middleware';
import optionalAuthMiddleware from '../middlewares/optional-auth-middleware';

import uploadWishImage from '../middlewares/upload-wish-image';

import wishController from '../controllers/wish-controller';

const router = Router();

router.get(
    '/:nickname',
    optionalAuthMiddleware,
    wishController.getWishes
)

router.post(
    '/',
    authMiddleware,
    uploadWishImage.single('image'),

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
    uploadWishImage.single('image'),

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

export default router;