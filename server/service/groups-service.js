const GroupsModel = require('../models/groups-model');

const WishModel = require('../models/wish-model');

const friendshipModel = require('../models/friendship-model');

const ApiError = require('../exceptions/api-error');

class GroupsService {

    async getGroups(ownerId) {

        const groups = await GroupsModel.getGroups(ownerId);

        return groups;
    }



    async createGroup(ownerId, name, color) {

        if (!name || !name.trim()) {
            throw ApiError.BadRequest(
                'Group name is required'
            );
        }

        const existingGroup = await GroupsModel.findGroupByName(ownerId, name);

        if (existingGroup) {
            throw ApiError.BadRequest('Группа уже существует');
        }
        
        const group = await GroupsModel.createGroup({ownerId, name: name.trim(), color});

        return group;
    }



    async updateGroup(ownerId, groupId, name, color) {
        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }
        if (Number(group.owner_user_id) !== Number(ownerId)) {
            throw ApiError.Forbidden();
        }

        if (name !== undefined) {
            if (!name.trim()) {
                throw ApiError.BadRequest('Название группы не может быть пустым')
            }
            const existingGroup = await GroupsModel.findGroupByName(ownerId, name);

            if (existingGroup &&  Number(existingGroup.id) !== Number(groupId)) {
                throw ApiError.BadRequest('Группа с таким именем уже существует');
            }
        }

        const updatedGroup = await GroupsModel.updateGroup({groupId, name: name || group.name, color});

        return updatedGroup
;
    }



    async deleteGroup(ownerId, groupId) {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound( 'Группа не найдена');
        }

        if (Number(group.owner_user_id) !== Number(ownerId)) {
            throw ApiError.Forbidden();
        }

        await GroupsModel.deleteGroup(groupId);

        return {
            success: true,
            message: 'Группа удалена'
        };
    }


    async addGroupToFriend(ownerId, groupId, friendId) {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }
        if (Number(group.owner_user_id) !== Number(ownerId)) {
            throw ApiError.Forbidden();
        }

        const friendship = await friendshipModel.findFollow(friendId, ownerId);

        if (!friendship) {
            throw ApiError.NotFound('Подписка не найдена');
        }


        await GroupsModel.addGroupToFriend({groupId, friendshipId: friendship.id});

        return {
            success: true,
            message: 'Группа привязана к подписчику'
        };
    }



    async removeGroupFromFriend(ownerId, groupId, friendId) {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (Number(group.owner_user_id) !== Number(ownerId)) {
            throw ApiError.Forbidden();
        }
        
        const friendship = await friendshipModel.findFollow(friendId, ownerId);


        if (!friendship) {
            throw ApiError.NotFound('Подписка не найдена');
        }


        await GroupsModel.removeGroupFromFriend({groupId, friendshipId: friendship.id});

        return {
            success: true,
            message: 'Группа отвязана от подписчика'
        };
    }



    async addGroupToWishlistItem(ownerId, groupId, wishId) {


        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (group.owner_id !== ownerId) {
            throw ApiError.Forbidden();
        }

  
        const wish = await WishModel.findById(wishId);

        if (!wish) {
            throw ApiError.NotFound(
                'Желание не найдено'
            );
        }

        if (wish.owner_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        await GroupsModel.addGroupToWishlistItem({groupId, wishId});

        return {
            success: true,
            message: 'Группа привязана к желанию'
        };
    }



    async removeGroupFromWishlistItem(ownerId, groupId, wishId) {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (group.owner_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        const wish = await WishModel.findById(wishId);

        if (!wish) {
            throw ApiError.NotFound('Wishlist item not found');
        }

        if (wish.owner_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        await GroupsModel.removeGroupFromWishlistItem({groupId, wishId});

        return {
            success: true,
            message: 'Группа отвязана от желания'
        };
    }
}

module.exports = new GroupsService();