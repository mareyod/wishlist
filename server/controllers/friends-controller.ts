import FriendsService from '../service/friends-service';
import type { Request, Response, NextFunction } from 'express';

class FriendsController {

    async getFollowers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                next(new Error('Unauthorized'));
                return;
            }
            const userId = req.user.id
            const data = await FriendsService.getFollowers(userId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    }

    async getFollowing(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                next(new Error('Unauthorized'));
                return;
            }
            const userId = req.user.id
            const data = await FriendsService.getFollowing(userId)
            res.json(data)

        } catch (e) {
            next(e)
        }
    }

    async removeFollower(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                next(new Error('Unauthorized'));
                return;
            }

            const fromUserId = Number(req.params.userId)
            const toUserId = req.user.id

            const result = await FriendsService.removeFollow(fromUserId, toUserId)

            res.json(result)

        } catch (e) {
            next(e)
        }
    }

    async followUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                next(new Error('Unauthorized'));
                return;
            }

            const fromUserId = req.user.id
            const toUserId = Number(req.params.userId)

            const result = await FriendsService.createFollow(fromUserId, toUserId)

            res.json(result)

        } catch (e) {
            next(e)
        }
    }

    async unfollowUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                next(new Error('Unauthorized'));
                return;
            }

            const fromUserId = req.user.id
            const toUserId = Number(req.params.userId)

            const result = await FriendsService.removeFollow(fromUserId, toUserId)

            res.json(result)

        } catch (e) {
            next(e)
        }
    }



  
}

export default new FriendsController()