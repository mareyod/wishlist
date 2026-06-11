export interface FriendshipGroup {
    readonly id: number;
    readonly owner_user_id: number;
    readonly name: string;
    readonly color: string;
}

export interface CreateGroupPayload {
    readonly ownerId: number;
    readonly name: string;
    readonly color: string;
}

export interface UpdateGroupPayload {
    readonly groupId: number;
    readonly name: string;
    readonly color: string;
}

export interface GroupFriendPayload {
    readonly groupId: number;
    readonly friendshipId: number;
}

export interface GroupWishPayload {
    readonly groupId: number;
    readonly wishId: number;
}