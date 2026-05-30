import groupsService from '../service/groups-service';
import type { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

type GroupParams = ParamsDictionary & {
    groupId: string;
};

type GroupFriendParams = ParamsDictionary & {
    groupId: string;
    friendId: string;
}

type GroupWishParams = ParamsDictionary & {
    groupId: string;
    wishId: string;
}

interface CreateGroupBody {
    name: string;
    color: string;
}

interface UpdateGroupBody {
    name: string;
    color: string;
}

class GroupsController{
    async getGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id
            const data = await groupsService.getGroups(ownerId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async createGroup(req: Request<Record<string, never>,unknown,CreateGroupBody>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id
            const {name, color} = req.body
            const data = await groupsService.createGroup(ownerId, name, color)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async updateGroup(req: Request<GroupParams,unknown,UpdateGroupBody>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const {name, color} = req.body
            const data = await groupsService.updateGroup(ownerId, groupId, name, color)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async deleteGroup(req: Request<GroupParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const data = await groupsService.deleteGroup(ownerId, groupId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async addGroupToFriend(req: Request<GroupFriendParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const friendId = Number(req.params.friendId)
            const data = await groupsService.addGroupToFriend(ownerId, groupId, friendId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async removeGroupFromFriend(req: Request<GroupFriendParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const friendId = Number(req.params.friendId)
            const data = await groupsService.removeGroupFromFriend(ownerId, groupId, friendId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async addGroupToWishlistItem(req: Request<GroupWishParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const wishId = Number(req.params.wishId)
            const data = await groupsService.addGroupToWishlistItem(ownerId, groupId, wishId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };

    async removeGroupFromWishlistItem(req: Request<GroupWishParams>, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new Error('Пользователь не найден');
            }
            const ownerId = req.user.id;
            const groupId = Number(req.params.groupId)
            const wishId = Number(req.params.wishId)
            const data = await groupsService.removeGroupFromWishlistItem(ownerId, groupId, wishId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    };
}

export default new GroupsController();