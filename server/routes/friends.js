const Router = require('express').Router
const router = new Router()

const authMiddleware = require('../middlewares/auth-middleware')

const friendsController = require('../controllers/friends-controller')

router.get(
  '/followers',
  authMiddleware,
  friendsController.getFollowers
)

router.get(
  '/following',
  authMiddleware,
  friendsController.getFollowing
)

router.delete(
  '/follower/:userId',
  authMiddleware,
  friendsController.removeFollower
)

router.post(
  '/following/:userId',
  authMiddleware,
  friendsController.followUser
)

router.delete(
  '/following/:userId',
  authMiddleware,
  friendsController.unfollowUser
)



module.exports = router