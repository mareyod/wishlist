import GroupsModel from '../models/groups-model';
import WishModel from '../models/wish-model';
import FriendshipModel from '../models/friendship-model';

import ApiError from '../exceptions/api-error';
import type { FriendshipGroup } from '../types/group.types';

import type { WishEntity } from '../types/wish.types';

import type { FriendshipEntity } from '../types/friendship.types';

interface SuccessResponse {
    success: true;
    message: string;
}

class GroupsService {

    async getGroups(ownerId: number): Promise<FriendshipGroup[]> {

        return GroupsModel.getGroups(ownerId);

    }

    async createGroup(ownerId: number, name: string, color: string) {

        if (!name?.trim()) {
            throw ApiError.BadRequest('Введите имя группы');
        }

        const existingGroup = await GroupsModel.findGroupByName(ownerId, name);

        if (existingGroup) {
            throw ApiError.BadRequest('Группа уже существует');
        }
        
        return GroupsModel.createGroup({ownerId, name: name.trim(), color});

    }



    async updateGroup(ownerId: number, groupId: number, name: string, color: string): Promise<FriendshipGroup> {
        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }
        console.log(typeof group.owner_user_id, typeof ownerId)
        if (group.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        if (name !== undefined) {
            if (!name.trim()) {
                throw ApiError.BadRequest('Название группы не может быть пустым')
            }
            const existingGroup = await GroupsModel.findGroupByName(ownerId, name);

            if (existingGroup &&  existingGroup.id !== groupId) {
                throw ApiError.BadRequest('Группа с таким именем уже существует');
            }
        }

        const updatedGroup = await GroupsModel.updateGroup({groupId, name: name || group.name, color});

        return updatedGroup
;
    }



    async deleteGroup(ownerId: number, groupId: number): Promise<SuccessResponse> {

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


    async addGroupToFriend(ownerId: number, groupId: number, friendId: number): Promise<SuccessResponse> {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }
        if (Number(group.owner_user_id) !== Number(ownerId)) {
            throw ApiError.Forbidden();
        }

        const friendship: FriendshipEntity | undefined = await FriendshipModel.findFollow(friendId, ownerId);

        if (!friendship) {
            throw ApiError.NotFound('Подписка не найдена');
        }


        await GroupsModel.addGroupToFriend({groupId, friendshipId: friendship.id});

        return {
            success: true,
            message: 'Группа привязана к подписчику'
        };
    }



    async removeGroupFromFriend(ownerId: number, groupId: number, friendId: number): Promise<SuccessResponse> {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (group.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }
        
        const friendship: FriendshipEntity | undefined = await FriendshipModel.findFollow(friendId, ownerId);


        if (!friendship) {
            throw ApiError.NotFound('Подписка не найдена');
        }


        await GroupsModel.removeGroupFromFriend({groupId, friendshipId: friendship.id});

        return {
            success: true,
            message: 'Группа отвязана от подписчика'
        };
    }



    async addGroupToWishlistItem(ownerId: number, groupId: number, wishId: number): Promise<SuccessResponse> {


        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (group.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }

  
        const wish: WishEntity | undefined = await WishModel.findById(wishId);

        if (!wish) {
            throw ApiError.NotFound(
                'Желание не найдено'
            );
        }

        if (wish.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        await GroupsModel.addGroupToWishlistItem({groupId, wishId});

        return {
            success: true,
            message: 'Группа привязана к желанию'
        };
    }



    async removeGroupFromWishlistItem(ownerId: number, groupId: number, wishId: number): Promise<SuccessResponse> {

        const group = await GroupsModel.findGroupById(groupId);

        if (!group) {
            throw ApiError.NotFound('Группа не найдена');
        }

        if (group.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        const wish: WishEntity | undefined  = await WishModel.findById(wishId);

        if (!wish) {
            throw ApiError.NotFound('Wishlist item not found');
        }

        if (wish.owner_user_id !== ownerId) {
            throw ApiError.Forbidden();
        }

        await GroupsModel.removeGroupFromWishlistItem({groupId, wishId});

        return {
            success: true,
            message: 'Группа отвязана от желания'
        };
    }
}

export default new GroupsService();