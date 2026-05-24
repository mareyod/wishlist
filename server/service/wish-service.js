
const WishModel =  require('../models/wish-model')
const UserModel =  require('../models/user-model')
const FriendshipModel = require('../models/friendship-model')
const GroupsModel = require('../models/groups-model');

const ApiError =  require('../exceptions/api-error')
const UserDto = require('../dtos/user-dto')

class WishService {
    sanitizeWishlistItems(items, viewerContext) {
        return items.map(item => {

            const sanitizedItem = {...item}
            if (
                viewerContext.role === 'owner'
            ) {
                sanitizedItem.is_reserved = false
                sanitizedItem.is_reserved_by_me = false
                sanitizedItem.reserved_by_user_id = null
            }

            if (
                viewerContext.role !== 'owner'
            ) {
                delete sanitizedItem.groups
            }


            sanitizedItem.can_reserve = viewerContext.role === 'friend'


            sanitizedItem.can_edit = viewerContext.role === 'owner'

            sanitizedItem.can_delete = viewerContext.role === 'owner'

            return sanitizedItem
        })
    }
    async getWishes(nickname, viewerId) {

        const owner = await UserModel.findByNickname(nickname)

        if (!owner) {
            throw ApiError.NotFound()
        }

        const ownerDto = new UserDto(owner)
        const ownerId = owner.id

        const viewer = await FriendshipModel.getViewerContext(ownerId, viewerId)
        let items;

        if (viewer.role === 'owner') {
            items = await WishModel.findByOwner(ownerId, viewerId)
        }
        else if(viewer.role === 'friend'){
            items =  await WishModel.findVisibleByGroups(ownerId, viewerId, viewer.groupIds)
        }
        else  {
            items = await WishModel.findPublicByOwner(ownerId, viewerId)
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


    async createWish({ ownerId, body, file }) {

        const {
            title,
            description,
            external_link,
            price,
            is_public,
            visibility_group_ids
        } = body

        let imageUrl = null

        if (file) {
            imageUrl = `/uploads/wishes/${file.filename}`
        }

        const wish =
            await WishModel.create({
                ownerId,
                title,
                description,
                external_link,
                price:
                    price === ''
                        ? null
                        : price,
                imageUrl,
                is_public: is_public === 'true'
            })

        const groupIds =
            JSON.parse(
                visibility_group_ids || '[]'
            )

        if (
            !wish.is_public &&
            groupIds.length
        ) {
            await WishModel.setVisibility(
                wish.id,
                groupIds
            )
        }

        return wish
    }

    async updateWish({ wishId, ownerId, body, file }) {

        const existingWish = await WishModel.findById(wishId)

        if (!existingWish) {
            throw ApiError.BadRequest(
                'Желание не найдено'
            )
        }

        if (
            Number(existingWish.owner_user_id) !== Number(ownerId)
        ) {
            throw ApiError.Forbidden()
        }

        const {
            title,
            description,
            external_link,
            price,
            is_public,
            visibility_group_ids,
            remove_image
        } = body

        let imageUrl = existingWish.image_url

        if (remove_image === 'true') {
            imageUrl = null
        }

        if (file) {
            imageUrl = `/uploads/wishes/${file.filename}`
        }

        const updatedWish =
            await WishModel.update({
                wishId,
                title,
                description,
                external_link,
                price:
                    price === ''
                        ? null
                        : price,
                imageUrl,
                is_public:
                    is_public === 'true'
            })

        await WishModel.clearVisibility(wishId)

        const groupIds = JSON.parse(visibility_group_ids || '[]')

        if (
            !updatedWish.is_public &&
            groupIds.length
        ) {
            await WishModel.setVisibility(wishId,groupIds
            )
        }

        return updatedWish
    }

    async deleteWish(
        wishId,
        ownerId
    ) {

        const wish =
            await WishModel.findById(
                wishId
            )

        if (!wish) {
            throw ApiError.BadRequest(
                'Желание не найдено'
            )
        }

        if (
            Number(wish.owner_user_id) !== Number(ownerId)
        ) {
            throw ApiError.Forbidden()
        }

        return await WishModel.delete(
            wishId
        )
    }
}

module.exports = new WishService()