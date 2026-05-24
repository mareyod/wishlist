const friendsService = require('../service/friends-service')

class FriendsController {

    async getFollowers(req, res, next) {
        try {
            const userId = req.user.id
            const data = await friendsService.getFollowers(userId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    }

    async getFollowing(req, res, next) {
        try {
            const userId = req.user.id
            const data = await friendsService.getFollowing(userId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    }

    async removeFollower(req, res, next) {
        try {

            const fromUserId = req.params.userId
            const toUserId = req.user.id

            const result = await friendsService.removeFollow(fromUserId, toUserId)

            return res.json(result)

        } catch (e) {
            next(e)
        }
    }

    async followUser(req, res, next) {
        try {

            const fromUserId = req.user.id
            const toUserId = req.params.userId

            const result = await friendsService.createFollow(fromUserId, toUserId)

            return res.json(result)

        } catch (e) {
            next(e)
        }
    }

    async unfollowUser(req, res, next) {
        try {

            const fromUserId = req.user.id
            const toUserId = req.params.userId

            const result = await friendsService.removeFollow(fromUserId, toUserId)

            return res.json(result)

        } catch (e) {
            next(e)
        }
    }



  
}

module.exports = new FriendsController()