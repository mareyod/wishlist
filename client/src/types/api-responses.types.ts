import type { AuthResponse } from './auth.types';
import type { FollowerUser, FollowingUser} from './friendship.types';
import type { FriendshipGroup } from './group.types';
import type { GetWishesResult,  WishEntity } from './wish.types';

export interface SuccessResponse {
    readonly success: true;
}

export type LoginResponse = AuthResponse;

export type RegistrationResponse = AuthResponse;

export type RefreshResponse = AuthResponse;

export type FollowersResponse = FollowerUser[];

export type FollowingResponse = FollowingUser[];

export type GroupsResponse = FriendshipGroup[];

export type WishlistResponse = GetWishesResult;

export type CreateWishResponse = WishEntity;

export type UpdateWishResponse = WishEntity;

export type DeleteWishResponse = SuccessResponse;

export type ReserveWishResponse = SuccessResponse;

export type UnreserveWishResponse = SuccessResponse;

export type CreateGroupResponse = FriendshipGroup;

export type UpdateGroupResponse = FriendshipGroup;

export type DeleteGroupResponse = SuccessResponse;

export type GroupAssignResponse = SuccessResponse;