import type { ViewerContext, ViewerRole } from './friendship.types';
import { FriendshipGroup } from './group.types';
import { UserDtoInterface } from './user.types';
export interface WishVisibilityGroup {
    readonly id: number;
    readonly name: string;
    readonly color: string;
}

export interface WishRowRaw {
    id: number;
    owner_user_id: number;
    title: string;
    description: string | null;
    external_link: string | null;
    price: number | null;
    image_url: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string | null;
    is_reserved: boolean;
    is_reserved_by_me: boolean;
}

export interface WishRowWithGroups extends WishRowRaw {
    groups: WishVisibilityGroup[] | null;
}

export interface WishEntity {
    readonly id: number;
    readonly owner_user_id: number;
    readonly title: string;
    readonly description: string | null;
    readonly external_link: string | null;
    readonly price: number | null;
    readonly image_url: string | null;
    readonly is_public: boolean;
    readonly created_at: string;
    readonly updated_at: string | null;
}

export interface WishListItem extends WishEntity {
    readonly is_reserved: boolean;
    readonly is_reserved_by_me: boolean;
    readonly groups?: readonly WishVisibilityGroup[];
}

export interface SanitizedWishItem extends WishListItem {
    readonly can_reserve: boolean;
    readonly can_edit: boolean;
    readonly can_delete: boolean;
}

export interface GetWishesResult {
    readonly owner: UserDtoInterface;
    readonly viewer: ViewerContext;
    readonly items: SanitizedWishItem[];
    readonly groups: FriendshipGroup[]
}


export interface CreateWishPayload {
    readonly ownerId: number;
    readonly title: string;
    readonly description: string | null;
    readonly external_link: string | null;
    readonly price: number | null;
    readonly imageUrl: string | null;
    readonly is_public: boolean;
}

export interface UpdateWishPayload {
    readonly wishId: number;
    readonly title: string;
    readonly description: string | null;
    readonly external_link: string | null;
    readonly price: number | null;
    readonly imageUrl: string | null;
    readonly is_public: boolean;
}

export interface WishlistViewerContext {
    readonly role: ViewerRole;
}

export interface CreateWishServiceInput {
    readonly ownerId: number;
    readonly body: {
        readonly title: string;
        readonly description?: string;
        readonly external_link?: string;
        readonly price?: string;
        readonly is_public: string;
        readonly visibility_group_ids?: string;
    };
    readonly file?:  Express.Multer.File | undefined;
}

export interface UpdateWishServiceInput {
    readonly wishId: number;
    readonly ownerId: number;
    readonly body: {
        readonly title: string;
        readonly description?: string;
        readonly external_link?: string;
        readonly price?: string;
        readonly is_public: string;
        readonly visibility_group_ids?: string;
        readonly remove_image?: string;
    };
    readonly file?: Express.Multer.File | undefined;
}