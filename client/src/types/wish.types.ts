import type { ViewerContext, ViewerRole } from './friendship.types';

import type { FriendshipGroup } from './group.types';
import type { UserDtoInterface } from './user.types';

export interface WishVisibilityGroup {
    readonly id: number;
    readonly name: string;
    readonly color: string;
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
    readonly groups: FriendshipGroup[];
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

export interface WishFormValues {
    title: string;
    description: string;
    external_link: string;
    price: number | '' | null;
    is_public: boolean;
    visibility_group_ids: number[];
    image_url: string | null;
    image_file: File | null;
    remove_image?: boolean;
}

export interface WishFormErrors {
    title?: string;
    price?: string;
    external_link?: string;
    image?: string | null;
}

export interface EditableWish extends Omit<WishEntity, 'price'> {
    price: number | null;
    groups?: readonly WishVisibilityGroup[];
}

export interface WishFormModalProps {
    wish: EditableWish | null;
    groups: FriendshipGroup[];
    onSave: (wish: WishFormValues) => void | Promise<void>;
    onClose: () => void;
}