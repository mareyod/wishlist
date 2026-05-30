import FriendshipModel from '../models/friendship-model';
import ReservationsModel from '../models/reservations-model';
import ApiError from '../exceptions/api-error';

import type { FollowerUser,  FollowingUser, FriendshipEntity } from '../types/friendship.types';

class FriendsService {

    async getFollowers(userId: number): Promise<FollowerUser[]> {
        const followers = await FriendshipModel.getFollowers(userId)
        return followers
    }

    async getFollowing(userId: number): Promise<FollowingUser[]> {
        const following = await FriendshipModel.getFollowing(userId)
        return following
    }

    async createFollow(fromUserId: number, toUserId: number): Promise<{ success: true }> {

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

    async removeFollow(fromUserId: number, toUserId: number): Promise<{ success: true }> {

        const follow = await FriendshipModel.findFollow(fromUserId, toUserId)

        if (!follow) {
            throw ApiError.BadRequest('Подписка не найдена')
        }

        await ReservationsModel.deleteByUserAndOwner(fromUserId, toUserId)

        await FriendshipModel.deleteFollow(follow.id)

        return { success: true }
    }

}

export default new FriendsService()