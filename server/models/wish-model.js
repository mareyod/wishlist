
const db = require('../db')

class WishModel {

    async findByOwner(ownerId, viewerId) {
        const res = await db.query(
            `
            SELECT 
                wi.*,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                ) AS is_reserved,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                    AND r.reserver_id = $2
                ) AS is_reserved_by_me,

                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', fg.id,
                            'name', fg.name,
                            'color', fg.color
                        )
                    ) FILTER (WHERE fg.id IS NOT NULL),
                    '[]'
                ) AS groups

            FROM wishlist_items wi

            LEFT JOIN wishlist_item_visibility wiv
                ON wiv.wishlist_item_id = wi.id

            LEFT JOIN friendship_groups fg
                ON fg.id = wiv.friendship_group_id
            WHERE wi.owner_user_id = $1
            GROUP BY wi.id
            ORDER BY wi.created_at DESC;
            `,
            [ownerId, viewerId]
        )

        return res.rows
    }

    async findPublicByOwner(ownerId, viewerId) {
        const res = await db.query(
            `
            SELECT 
                wi.*,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                ) AS is_reserved,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                    AND r.reserver_id = $2
                ) AS is_reserved_by_me

            FROM wishlist_items wi

            WHERE wi.owner_user_id = $1
            AND wi.is_public = true

            ORDER BY wi.created_at DESC;
            `,
            [ownerId, viewerId]
        )

        return res.rows
    }

    async findVisibleByGroups(ownerId, viewerId, groupIds) {
        const res = await db.query(
            `
            SELECT 
                DISTINCT wi.*,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                ) AS is_reserved,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                    AND r.reserver_id = $2
                ) AS is_reserved_by_me

            FROM wishlist_items wi

            LEFT JOIN wishlist_item_visibility wiv
                ON wiv.wishlist_item_id = wi.id

            WHERE wi.owner_user_id = $1
            AND (
                wi.is_public = true
                OR wiv.friendship_group_id = ANY($3)
            )
            ORDER BY wi.created_at DESC
            `,
            [ownerId, viewerId, groupIds]
        )

        return res.rows
    }

    async findById(id) {
        const res = await db.query(
            `
            SELECT *
            FROM wishlist_items
            WHERE id = $1
            `,
            [id]
        )

        return res.rows[0]
    }

    async create({
        ownerId,
        title,
        description,
        external_link,
        price,
        imageUrl,
        is_public
    }) {
        const res = await db.query(
            `
            INSERT INTO wishlist_items (
                owner_user_id,
                title,
                description,
                external_link,
                price,
                image_url,
                is_public
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *
            `,
            [
                ownerId,
                title,
                description,
                external_link,
                price,
                imageUrl,
                is_public
            ]
        )

        return res.rows[0]
    }

    async update(data) {
        const res = await db.query(
            `
            UPDATE wishlist_items
            SET
                title = $1,
                description = $2,
                external_link = $3,
                price = $4,
                image_url = $5,
                is_public = $6,
                updated_at = NOW()
            WHERE id = $7
            RETURNING *
            `,
            [
                data.title,
                data.description,
                data.external_link,
                data.price,
                data.imageUrl,
                data.is_public,
                data.wishId
            ]
        )

        return res.rows[0]
    }

    async delete(wishId) {
        const res = await db.query(
            `
            DELETE FROM wishlist_items
            WHERE id = $1
            RETURNING *
            `,
            [wishId]
        )

        return res.rows[0]
    }

    async setVisibility(wishId, groupIds) {
        for (const groupId of groupIds) {
            await db.query(
                `
                INSERT INTO wishlist_item_visibility
                (wishlist_item_id, friendship_group_id)
                VALUES ($1, $2)
                `,
                [wishId, groupId]
            )
        }
    }

    async clearVisibility(wishId) {
        await db.query(
            `
            DELETE FROM wishlist_item_visibility
            WHERE wishlist_item_id = $1
            `,
            [wishId]
        )
    }
}

module.exports = new WishModel()