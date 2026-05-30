import db from '../db';
import type { FriendshipEntity, FriendshipGroupLink, ViewerContext, FollowerUser, FollowingUser } from '../types/friendship.types';


class FriendshipModel {

    async getViewerContext(ownerId: number, viewerId: number | null): Promise<ViewerContext> {

        if (!viewerId) {
            return {
                role: 'stranger',
                groupIds: [],
                canReserve: false,
                canSeeReservations: true
            }
        }

        if (ownerId === viewerId) {
            return {
                role: 'owner',
                groupIds: [],
                canReserve: false,
                canSeeReservations: false
            }
        }

        const friendship = await this.findFollow(viewerId, ownerId)

        if (!friendship) {
            return {
                role: 'guest',
                groupIds: [],
                canReserve: false,
                canSeeReservations: true
            }
        }

        const groups = await this.getFriendGroups(friendship.id)
        return {
            role: 'friend',
            groupIds: groups.map(g => g.friendship_group_id),
            canReserve: true,
            canSeeReservations: true
        }
    }

    async getFollowers(userId: number): Promise<FollowerUser[]> {

        const res = await db.query<FollowerUser>(
            `
            SELECT
                u.id,
                u.nickname,
                u.avatar_url,

                f.id AS friendship_id,

                COALESCE(
                    json_agg(
                        DISTINCT jsonb_build_object(
                            'id', fg.id,
                            'name', fg.name,
                            'color', fg.color
                        )
                    ) FILTER (WHERE fg.id IS NOT NULL),
                    '[]'
                ) AS groups,

                COALESCE(
                    array_agg(DISTINCT fg.id) FILTER (WHERE fg.id IS NOT NULL),
                    '{}'
                ) AS group_ids

            FROM friendships f

            JOIN users u
                ON u.id = f.requester_id

            LEFT JOIN friendship_group_members fgm
                ON fgm.friendship_id = f.id

            LEFT JOIN friendship_groups fg
                ON fg.id = fgm.friendship_group_id

            WHERE f.addressee_id = $1

            GROUP BY
                u.id,
                u.nickname,
                u.avatar_url,
                f.id

            ORDER BY u.nickname;
            `,
            [userId]
        )

        return res.rows
    }

    async getFollowing(userId: number): Promise<FollowingUser[]> {

        const res = await db.query<FollowingUser>(
            `
            SELECT DISTINCT
            u.id,
            u.nickname,
            u.avatar_url
            FROM friendships f
            JOIN users u
            ON (
                u.id = f.addressee_id
                AND f.requester_id = $1
                )
            ORDER BY u.nickname
            `,
            [userId]
        )

        return res.rows
    }

    async findFollow(from: number, to: number): Promise<FriendshipEntity | undefined> {
        const res = await db.query<FriendshipEntity>(
            `
            SELECT *
            FROM friendships
            WHERE requester_id = $1
                AND addressee_id = $2
            LIMIT 1
            `,
            [from, to]
        )

        return res.rows[0]
    }

    async createFollow(from: number, to: number): Promise<FriendshipEntity> {
        const res = await db.query<FriendshipEntity>(
            `
            INSERT INTO friendships
            (requester_id, addressee_id, status)
            VALUES ($1, $2, 'pending')
            RETURNING *
            `,
            [from, to]
        )

        const follow = res.rows[0];

        if (!follow) {
            throw new Error('Не удалось подписаться');
        }

        return follow
    }

    async deleteFollow(followId: number): Promise<void> {
        await db.query(
            `
            DELETE FROM friendships
            WHERE id = $1
            `,
            [followId]
        )
    }

    async getFriendGroups(friendshipId: number): Promise<FriendshipGroupLink[]> {

        const res = await db.query<FriendshipGroupLink>(
            `
            SELECT
                fg.id as friendship_group_id,
                fg.name,
                fg.color

            FROM friendship_groups fg

            JOIN friendship_group_members fgm
                ON fg.id = fgm.friendship_group_id
            WHERE fgm.friendship_id = $1

            ORDER BY fg.name
            `,
            [friendshipId]
        )

        return res.rows
    }

}
export default new FriendshipModel();