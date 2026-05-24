const db = require('../db');

class GroupsModel {



    async getGroups(ownerId) {

        const query = `
            SELECT
                fg.id,
                fg.name,
                fg.color,
                fg.created_at,

                COUNT(DISTINCT fgm.friendship_id)
                    AS friends_count,

                COUNT(DISTINCT wiv.wishlist_item_id)
                    AS items_count

            FROM friendship_groups fg

            LEFT JOIN friendship_group_members fgm
                ON fgm.friendship_group_id = fg.id

            LEFT JOIN wishlist_item_visibility wiv
                ON wiv.friendship_group_id = fg.id

            WHERE fg.owner_user_id = $1

            GROUP BY fg.id

            ORDER BY fg.created_at ASC;
        `;

        const values = [ownerId];

        const { rows } = await db.query(
            query,
            values
        );

        return rows;
    }



    async findGroupById(groupId) {

        const query = `
            SELECT *
            FROM friendship_groups
            WHERE id = $1
            LIMIT 1;
        `;

        const values = [groupId];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }


    async findGroupByName(
        ownerId,
        name
    ) {

        const query = `
            SELECT *
            FROM friendship_groups
            WHERE owner_user_id = $1
              AND LOWER(name) = LOWER($2)
            LIMIT 1;
        `;

        const values = [
            ownerId,
            name
        ];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }


    async createGroup({
        ownerId,
        name,
        color
    }) {

        const query = `
            INSERT INTO friendship_groups (
                owner_user_id,
                name,
                color
            )
            VALUES ($1, $2, $3)

            RETURNING
                id,
                owner_user_id,
                name,
                color,
                created_at;
        `;

        const values = [
            ownerId,
            name,
            color
        ];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }



    async updateGroup({groupId, name, color}) {
        const query = `
            UPDATE friendship_groups

            SET name = $2, color = $3

            WHERE id = $1

            RETURNING
                id,
                owner_user_id,
                name,
                created_at;
        `;

        const values = [
            groupId,
            name,
            color
        ];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }

    async deleteGroup(groupId) {

        const query = `
            DELETE FROM friendship_groups
            WHERE id = $1;
        `;

        const values = [groupId];

        await db.query(
            query,
            values
        );

        return true;
    }

    async addGroupToFriend({
        groupId,
        friendshipId
    }) {

        const query = `
            INSERT INTO friendship_group_members (
                friendship_id,
                friendship_group_id
            )
            VALUES ($1, $2)

            ON CONFLICT (
                friendship_id,
                friendship_group_id
            )
            DO NOTHING

            RETURNING *;
        `;

        const values = [
            friendshipId,
            groupId
        ];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }


    async removeGroupFromFriend({
        groupId,
        friendshipId
    }) {

        const query = `
            DELETE FROM friendship_group_members

            WHERE friendship_id = $1
              AND friendship_group_id = $2;
        `;

        const values = [
            friendshipId,
            groupId
        ];

        await db.query(
            query,
            values
        );

        return true;
    }



    async addGroupToWishlistItem({
        groupId,
        wishId
    }) {

        const query = `
            INSERT INTO wishlist_item_visibility (
                wishlist_item_id,
                friendship_group_id
            )
            VALUES ($1, $2)

            ON CONFLICT (
                wishlist_item_id,
                friendship_group_id
            )
            DO NOTHING

            RETURNING *;
        `;

        const values = [
            wishId,
            groupId
        ];

        const { rows } = await db.query(
            query,
            values
        );

        return rows[0];
    }



    async removeGroupFromWishlistItem({
        groupId,
        wishId
    }) {

        const query = `
            DELETE FROM wishlist_item_visibility

            WHERE wishlist_item_id = $1
              AND friendship_group_id = $2;
        `;

        const values = [
            wishId,
            groupId
        ];

        await db.query(
            query,
            values
        );

        return true;
    }



    async getGroupFriends(groupId) {

        const query = `
            SELECT
                u.id,
                u.nickname,
                u.email

            FROM friendship_group_members fgm

            JOIN friendships f
                ON f.id = fgm.friendship_id

            JOIN users u
                ON (
                    u.id = f.requester_id
                    OR
                    u.id = f.addressee_id
                )

            WHERE fgm.friendship_group_id = $1;
        `;

        const values = [groupId];

        const { rows } = await db.query(
            query,
            values
        );

        return rows;
    }


    async getGroupWishlistItems(groupId) {

        const query = `
            SELECT
                wi.id,
                wi.title,
                wi.description,
                wi.price,
                wi.is_public

            FROM wishlist_item_visibility wiv

            JOIN wishlist_items wi
                ON wi.id = wiv.wishlist_item_id

            WHERE wiv.friendship_group_id = $1

            ORDER BY wi.created_at DESC;
        `;

        const values = [groupId];

        const { rows } = await db.query(
            query,
            values
        );

        return rows;
    }
}

module.exports = new GroupsModel();