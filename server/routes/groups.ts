import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import GroupsController from '../controllers/groups-controller';

const router = Router();

router.get(
    '/',
    authMiddleware, 
    GroupsController.getGroups
);

router.post(
    '/', 
    authMiddleware,
    GroupsController.createGroup
);

router.patch(
    '/:groupId',
    authMiddleware, 
    GroupsController.updateGroup
);

router.delete(
    '/:groupId',
    authMiddleware, 
    GroupsController.deleteGroup
);

router.post(
    '/:groupId/friends/:friendId',
    authMiddleware,
    GroupsController.addGroupToFriend
);

router.delete(
    '/:groupId/friends/:friendId',
    authMiddleware,
    GroupsController.removeGroupFromFriend
);

router.post(
    '/:groupId/wishes/:wishId',
    authMiddleware,
    GroupsController.addGroupToWishlistItem
);

router.delete(
    '/:groupId/wishes/:wishId',
    authMiddleware,
    GroupsController.removeGroupFromWishlistItem
);

export default router;