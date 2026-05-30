
import db from '../db';

import type {  WishRowRaw, WishRowWithGroups, WishVisibilityGroup, WishListItem, SanitizedWishItem, WishEntity } from '../types/wish.types';
import type { ViewerContext } from '../types/friendship.types';


class WishModel {

    async findByOwner(ownerId: number, viewerId: number): Promise<WishListItem[]> {
        const res = await db.query<WishRowWithGroups>(
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
            `,
            [ownerId, viewerId]
        )

        return res.rows.map(this.mapWishRow);
    }

    async findPublicByOwner(ownerId: number): Promise<WishListItem[]> {
        const res = await db.query<WishRowRaw>(
            `
            SELECT 
                wi.*,

                EXISTS (
                    SELECT 1 
                    FROM reservations r 
                    WHERE r.item_id = wi.id
                ) AS is_reserved,

                false AS is_reserved_by_me

            FROM wishlist_items wi

            WHERE wi.owner_user_id = $1
            AND wi.is_public = true

            `,
            [ownerId]
        )

        return res.rows.map(row => this.mapWishRow({
            ...row,
            groups: null
        }));
    }

    async findVisibleByGroups(ownerId: number, viewerId: number, groupIds: number[]): Promise<WishListItem[]> {
        const res = await db.query<WishRowRaw>(
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
            `,
            [ownerId, viewerId, groupIds]
        )

        return res.rows.map(row =>
            this.mapWishRow({
                ...row,
                groups: null
            })
        );
    }

    async findById(id: number): Promise<WishEntity | undefined> {
        const res = await db.query<WishEntity>(
            `
            SELECT *
            FROM wishlist_items
            WHERE id = $1
            `,
            [id]
        )

        return res.rows[0]
    }

    async create(input: {
        ownerId: number;
        title: string;
        description: string | null;
        external_link: string | null;
        price: number | null;
        imageUrl: string | null;
        is_public: boolean;
    }): Promise<WishEntity> {
        const res = await db.query<WishEntity>(
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
                input.ownerId,
                input.title,
                input.description,
                input.external_link,
                input.price,
                input.imageUrl,
                input.is_public
            ]
        )
        const wish = res.rows[0];

        if (!wish) {
            throw new Error('Не удалось добавить желание');
        }

        return wish
    }

    async update(input: {
        wishId: number;
        title: string;
        description: string | null;
        external_link: string | null;
        price: number | null;
        imageUrl: string | null;
        is_public: boolean;
    }): Promise<WishEntity> {
        const res = await db.query<WishEntity>(
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
                input.title,
                input.description,
                input.external_link,
                input.price,
                input.imageUrl,
                input.is_public,
                input.wishId
            ]
        )

        const wish = res.rows[0];

        if (!wish) {
            throw new Error('Не удалось добавить желание');
        }

        return wish
    }

    async delete(wishId: number): Promise<void> {
        await db.query(
            `
            DELETE FROM wishlist_items
            WHERE id = $1
            `,
            [wishId]
        )
    }

    async setVisibility(wishId: number, groupIds: number[]): Promise<void> {
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

    async clearVisibility(wishId: number): Promise<void>  {
        await db.query(
            `
            DELETE FROM wishlist_item_visibility
            WHERE wishlist_item_id = $1
            `,
            [wishId]
        )
    }
    private mapWishRow(row: WishRowWithGroups): WishListItem {

        return {
            ...row,
            groups: row.groups ?? [],
            is_reserved: Boolean(row.is_reserved),
            is_reserved_by_me: Boolean(row.is_reserved_by_me)
        };
    }

    // sanitizeWishlistItems(items: WishListItem[], viewerContext: ViewerContext): SanitizedWishItem[] {

    //     return items.map(item => {
    //         const isOwner = viewerContext.role === 'owner';
    //         const isFriend = viewerContext.role === 'friend';

    //         const sanitized: SanitizedWishItem = {
    //             ...item,
    //             can_reserve: isFriend,
    //             can_edit: isOwner,
    //             can_delete: isOwner,
    //         };

    //         if (isOwner) {
    //             return{
    //                 ...sanitized,
    //                 is_reserved: false,
    //                 is_reserved_by_me: false
    //             }
    //         }

    //         return {
    //             ...sanitized,
    //             groups: isFriend ? item.groups : undefined
    //         };
    //     });
    // }
}

export default new WishModel();