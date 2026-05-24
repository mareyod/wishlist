const groupsService = require('../service/groups-service');
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')

class GroupsController{
    async getGroups(req, res, next) {
        try {
            const ownerId = req.user.id
            const data = await groupsService.getGroups(ownerId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async createGroup(req, res, next) {
        try {
            
            const ownerId = req.user.id
            const name = req.body.name
            const color = req.body.color
            const data = await groupsService.createGroup(ownerId, name, color)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async updateGroup(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const name = req.body.name
            const color = req.body.color

            const data = await groupsService.updateGroup(ownerId, groupId, name, color)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async deleteGroup(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const data = await groupsService.deleteGroup(ownerId, groupId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async addGroupToFriend(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const friendId = req.params.friendId
            const data = await groupsService.addGroupToFriend(ownerId, groupId, friendId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async removeGroupFromFriend(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const friendId = req.params.friendId
            const data = await groupsService.removeGroupFromFriend(ownerId, groupId, friendId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async addGroupToWishlistItem(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const wishId = req.params.wishId
            const data = await groupsService.addGroupToWishlistItem(ownerId, groupId, wishId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async removeGroupFromWishlistItem(req, res, next) {
        try {
            const ownerId = req.user.id;
            const groupId = req.params.groupId
            const wishId = req.params.wishId
            const data = await groupsService.removeGroupFromWishlistItem(ownerId, groupId, wishId)
            return res.json(data)

        } catch (e) {
            next(e)
        }
    };
}

module.exports = new GroupsController();