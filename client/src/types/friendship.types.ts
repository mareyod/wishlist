export type ViewerRole =
    | 'owner'
    | 'friend'
    | 'guest'
    | 'stranger';

export interface ViewerContext {
    readonly role: ViewerRole;
    readonly groupIds: readonly number[];
    readonly canReserve: boolean;
    readonly canSeeReservations: boolean;
}

export interface FollowerGroup {
    readonly id: number;
    readonly name: string;
    readonly color: string;
}

export interface FollowerUser {
    readonly id: number;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly friendship_id: number;
    readonly groups: readonly FollowerGroup[];
    readonly group_ids: readonly number[];
}

export interface FollowingUser {
    readonly id: number;
    readonly nickname: string;
    readonly avatar_url: string | null;
}

export interface FriendshipEntity {
    readonly id: number;
    readonly requester_id: number;
    readonly addressee_id: number;
    readonly status: string;
}

export interface FriendshipGroupLink {
    readonly friendship_group_id: number;
    readonly name: string;
    readonly color: string;
}

export type FriendUser = FollowerUser | FollowingUser;