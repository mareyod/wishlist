import { Router } from 'express';
import { body } from 'express-validator';

import userController from '../controllers/user-controller';
import uploadWishImage from '../middlewares/upload-wish-image';
import authMiddleware from '../middlewares/auth-middleware';

const router = Router();

router.post(
    '/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    userController.registration
);
router.post(
    '/login', 
    userController.login
);

router.post(
    '/logout', 
    userController.logout
);

router.get(
    '/activate/:link', 
    userController.activate
);

router.get(
    '/refresh', 
    userController.refresh
);

router.post(
    '/uploadAvatar', 
    uploadWishImage.single('file'), 
    userController.uploadAvatar
);

router.post(
    '/changeAvatar', 
    authMiddleware, 
    uploadWishImage.single('file'), 
    userController.changeAvatar
);

export default router