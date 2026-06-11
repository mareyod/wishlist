import type { EditableWish, SanitizedWishItem, WishFormValues } from './wish.types';
import type { FriendshipGroup } from './group.types';

export type ModalName =
    | 'wish.create'
    | 'wish.edit'
    | 'wish.details'
    | 'auth.login'
    | 'auth.register'
    | 'confirm';

export interface WishFormModalPayload {
    readonly wish: EditableWish | null;
    readonly groups: FriendshipGroup[];
    readonly onSave: (wish: WishFormValues) => void | Promise<void>;
}

export interface WishDetailsModalPayload {
    readonly wish: SanitizedWishItem;
}

export interface ConfirmModalPayload {
    readonly onConfirm: () => void;
    readonly onCancel: () => void;
}

export type ModalState =
    | { readonly name: 'wish.create'; readonly props: WishFormModalPayload }
    | { readonly name: 'wish.edit'; readonly props: WishFormModalPayload }
    | { readonly name: 'wish.details'; readonly props: WishDetailsModalPayload }
    | { readonly name: 'auth.login'; readonly props?: undefined }
    | { readonly name: 'auth.register'; readonly props?: undefined }
    | { readonly name: 'confirm'; readonly props: ConfirmModalPayload };

export interface OpenModal {
    (name: 'wish.create', props: WishFormModalPayload): void;
    (name: 'wish.edit', props: WishFormModalPayload): void;
    (name: 'wish.details', props: WishDetailsModalPayload): void;
    (name: 'auth.login'): void;
    (name: 'auth.register'): void;
    (name: 'confirm', props: ConfirmModalPayload): void;
}

export interface ModalContextValue {
    readonly openModal: OpenModal;
    readonly closeModal: () => void;
}