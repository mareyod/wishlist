const router = require('express').Router();

const groupController = require('../controllers/groups-controller');
const authMiddleware = require('../middlewares/auth-middleware')


router.get(
    '/',
    authMiddleware, 
    groupController.getGroups
);

router.post(
    '/', 
    authMiddleware,
    groupController.createGroup
);

router.patch(
    '/:groupId',
    authMiddleware, 
    groupController.updateGroup
);

router.delete(
    '/:groupId',
    authMiddleware, 
    groupController.deleteGroup
);

router.post(
    '/:groupId/friends/:friendId',
    authMiddleware,
    groupController.addGroupToFriend
);

router.delete(
    '/:groupId/friends/:friendId',
    authMiddleware,
    groupController.removeGroupFromFriend
);

router.post(
    '/:groupId/wishes/:wishId',
    authMiddleware,
    groupController.addGroupToWishlistItem
);

router.delete(
    '/:groupId/wishes/:wishId',
    authMiddleware,
    groupController.removeGroupFromWishlistItem
);

module.exports = router;