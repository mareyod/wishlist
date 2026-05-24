const FriendshipModel = require('../models/friendship-model')
const ReservationsModel = require('../models/reservations-model')
const ApiError = require('../exceptions/api-error')

class FriendsService {



    async getFollowers(userId) {

        const followers = await FriendshipModel.getFollowers(userId)

        return followers
    }

    async getFollowing(userId) {

        const following = await FriendshipModel.getFollowing(userId)

        return following
    }

    async createFollow(fromUserId, toUserId) {

        if (fromUserId === toUserId) {
            throw ApiError.BadRequest('Нельзя подписаться на самого себя')
        }

        const existing = await FriendshipModel.findFollow(fromUserId, toUserId)

        if (existing) {
            throw ApiError.BadRequest('Вы уже подписаны на пользователя')
        }

        await FriendshipModel.createFollow(fromUserId, toUserId)

        return { success: true }
    }

    async removeFollow(fromUserId, toUserId) {

        const follow = await FriendshipModel.findFollow(fromUserId, toUserId)

        if (!follow) {
            throw ApiError.BadRequest('Подписка не найдена')
        }

        await ReservationsModel.deleteByUserAndOwner(fromUserId, toUserId)

        await FriendshipModel.deleteFollow(follow.id)

        return { success: true }
    }

}

module.exports = new FriendsService()