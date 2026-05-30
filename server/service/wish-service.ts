import WishModel from '../models/wish-model';
import UserModel from '../models/user-model';
import FriendshipModel from '../models/friendship-model';
import GroupsModel from '../models/groups-model';

import ApiError from '../exceptions/api-error';
import UserDto from '../dtos/user-dto';

import type { SanitizedWishItem, WishEntity, WishListItem, CreateWishServiceInput, UpdateWishServiceInput, GetWishesResult } from '../types/wish.types';

import type { ViewerContext } from '../types/friendship.types';


class WishService {

    private parseGroupIds( value?: string ): number[] {
        if (!value) {
            return [];
        }

        const parsed: unknown = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed.map(Number).filter(Number.isFinite);
    }

    sanitizeWishlistItems(items: WishListItem[], viewerContext: ViewerContext): SanitizedWishItem[] {

        return items.map(item => {
            const isOwner = viewerContext.role === 'owner';
            const isFriend = viewerContext.role === 'friend';

            const sanitized: SanitizedWishItem = {
                ...item,
                can_reserve: isFriend,
                can_edit: isOwner,
                can_delete: isOwner,
            };

            if (isOwner) {
                return{
                    ...sanitized,
                    is_reserved: false,
                    is_reserved_by_me: false
                }
            }

            const { groups, ...itemWithoutGroups } = sanitized;
            return itemWithoutGroups;
        });
    }
    
    async getWishes(nickname: string, viewerId: number | null): Promise<GetWishesResult> {

        const owner = await UserModel.findByNickname(nickname)

        if (!owner) {
            throw ApiError.NotFound('Пользователь не найден')
        }

        const ownerDto = new UserDto(owner)
        const ownerId = owner.id

        const viewer = await FriendshipModel.getViewerContext(ownerId, viewerId)
        let items: WishListItem[];

        if (viewer.role === 'owner') {
            items = await WishModel.findByOwner(owner.id, owner.id)
        }
        else if(viewer.role === 'friend'){
            items =  await WishModel.findVisibleByGroups(ownerId, viewerId ?? -1, [...viewer.groupIds])
        }
        else  {
            items = await WishModel.findPublicByOwner(ownerId)
        }

        const groups = await GroupsModel.getGroups(ownerId)
        
        const sanitizedItems = this.sanitizeWishlistItems(items, viewer)

        return {
            owner: ownerDto,
            viewer,
            items: sanitizedItems,
            groups
        }
    }


    async createWish({ ownerId, body, file }: CreateWishServiceInput): Promise<WishEntity> {

        const imageUrl = file
            ? `/uploads/wishes/${file.filename}`
            : null;

        const wish =
            await WishModel.create({
                ownerId,
                title: body.title,
                description: body.description ?? null,
                external_link: body.external_link ?? null,
                price:
                    body.price === ''
                        ? null
                        : Number(body.price),
                imageUrl,
                is_public: body.is_public === 'true'
            })

        const groupIds = this.parseGroupIds(body.visibility_group_ids);

        if (!wish.is_public && groupIds.length > 0) {
            await WishModel.setVisibility(
                wish.id,
                groupIds
            )
        }

        return wish
    }

    async updateWish({ wishId, ownerId, body, file }: UpdateWishServiceInput): Promise<WishEntity> {

        const existingWish = await WishModel.findById(wishId)

        if (!existingWish) {
            throw ApiError.BadRequest('Желание не найдено')
        }

        if (existingWish.owner_user_id !== ownerId){
            throw ApiError.Forbidden()
        }

        let imageUrl = existingWish.image_url

        if (body.remove_image === 'true') {
            imageUrl = null
        }

        if (file) {
            imageUrl = `/uploads/wishes/${file.filename}`
        }

        const updatedWish =
            await WishModel.update({
                wishId,
                title: body.title,
                description: body.description ?? null,
                external_link: body.external_link ?? null,
                price:
                    body.price === ''
                        ? null
                        : Number(body.price),
                imageUrl,
                is_public: body.is_public === 'true'
            })

        await WishModel.clearVisibility(wishId)

        const groupIds = this.parseGroupIds(body.visibility_group_ids);

        if (!updatedWish.is_public && groupIds.length) {
            await WishModel.setVisibility(wishId,groupIds)
        }

        return updatedWish
    }

    async deleteWish(wishId: number, ownerId: number): Promise<void> {

        const wish = await WishModel.findById(wishId)

        if (!wish) {
            throw ApiError.BadRequest('Желание не найдено')
        }

        if (wish.owner_user_id !== ownerId) {
            throw ApiError.Forbidden()
        }

        return await WishModel.delete(wishId)
    }
}

export default new WishService();