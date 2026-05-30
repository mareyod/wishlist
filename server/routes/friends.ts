import { Router } from 'express';

import authMiddleware from '../middlewares/auth-middleware';
import FriendsController from '../controllers/friends-controller';

const router = Router();

router.get(
  '/followers',
  authMiddleware,
  FriendsController.getFollowers
)

router.get(
  '/following',
  authMiddleware,
  FriendsController.getFollowing
)

router.delete(
  '/follower/:userId',
  authMiddleware,
  FriendsController.removeFollower
)

router.post(
  '/following/:userId',
  authMiddleware,
  FriendsController.followUser
)

router.delete(
  '/following/:userId',
  authMiddleware,
  FriendsController.unfollowUser
)

export default router;