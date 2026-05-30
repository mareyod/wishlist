import db from '../db';

import type { FriendshipGroup, CreateGroupPayload, UpdateGroupPayload, GroupFriendPayload, GroupWishPayload } from '../types/group.types';

class GroupsModel {

    async getGroups(ownerId: number): Promise<FriendshipGroup[]> {

        const result =  await db.query<FriendshipGroup>(
            `SELECT
                fg.id,
                fg.name,
                fg.color,
                fg.owner_user_id

            FROM friendship_groups fg

            LEFT JOIN friendship_group_members fgm
                ON fgm.friendship_group_id = fg.id

            LEFT JOIN wishlist_item_visibility wiv
                ON wiv.friendship_group_id = fg.id

            WHERE fg.owner_user_id = $1

            GROUP BY fg.id
            `,
            [ownerId]
        );

        return result.rows;
    }

    async findGroupById(groupId: number): Promise<FriendshipGroup | undefined> {

        const result = await db.query<FriendshipGroup>(
                `
                SELECT *
                FROM friendship_groups
                WHERE id = $1
                LIMIT 1
                `,
                [groupId]
            );

        return result.rows[0];
    }


    async findGroupByName(ownerId: number, name: string): Promise<FriendshipGroup | undefined> {

        const result = await db.query<FriendshipGroup>(
            `
            SELECT *
            FROM friendship_groups
            WHERE owner_user_id = $1
                AND LOWER(name) = LOWER($2)
            LIMIT 1
            `,
            [
                ownerId,
                name
            ]
        );

        return result.rows[0];
    }


    async createGroup(payload: CreateGroupPayload): Promise<FriendshipGroup> {

        const res = await db.query<FriendshipGroup>(
                `
                INSERT INTO friendship_groups
                (
                    owner_user_id,
                    name,
                    color
                )
                VALUES ($1,$2,$3)

                RETURNING *
                `,
                [
                    payload.ownerId,
                    payload.name,
                    payload.color
                ]
            );
        const group = res.rows[0];

        if (!group) {
            throw new Error('Не удалось создать группу')
        }
        return group
    }



    async updateGroup(payload: UpdateGroupPayload): Promise<FriendshipGroup>{
        
        const res = await db.query<FriendshipGroup>(
            `
            UPDATE friendship_groups

            SET
                name = $2,
                color = $3

            WHERE id = $1

            RETURNING *
            `,
            [
                payload.groupId,
                payload.name,
                payload.color
            ]
        );

        const group = res.rows[0];

        if (!group) {
            throw new Error('Не удалось обновить группу')
        }
        return group
    }

    async deleteGroup(groupId: number): Promise<void> {

        await db.query(
            `
            DELETE FROM friendship_groups
            WHERE id = $1
            `,
            [groupId]
        );
    }

    async addGroupToFriend(payload: GroupFriendPayload): Promise<void> {

        await db.query(
            `
            INSERT INTO friendship_group_members
            (
                friendship_id,
                friendship_group_id
            )
            VALUES ($1,$2)

            ON CONFLICT
            (
                friendship_id,
                friendship_group_id
            )
            DO NOTHING
            `,
            [
                payload.friendshipId,
                payload.groupId
            ]
        );
    }


    async removeGroupFromFriend(payload: GroupFriendPayload): Promise<void> {

        await db.query(
            `
            DELETE FROM friendship_group_members
            WHERE friendship_id = $1
                AND friendship_group_id = $2
            `,
            [
                payload.friendshipId,
                payload.groupId
            ]
        );
    }



    async addGroupToWishlistItem(payload: GroupWishPayload): Promise<void> {

        await db.query(
            `
            INSERT INTO wishlist_item_visibility
            (
                wishlist_item_id,
                friendship_group_id
            )
            VALUES ($1,$2)

            ON CONFLICT
            (
                wishlist_item_id,
                friendship_group_id
            )
            DO NOTHING
            `,
            [
                payload.wishId,
                payload.groupId
            ]
        );
    }



    async removeGroupFromWishlistItem( payload: GroupWishPayload): Promise<void> {

        await db.query(
            `
            DELETE FROM wishlist_item_visibility
            WHERE wishlist_item_id = $1
                AND friendship_group_id = $2
            `,
            [
                payload.wishId,
                payload.groupId
            ]
        );
    }
}

export default new GroupsModel();