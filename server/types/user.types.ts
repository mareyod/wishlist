export interface UserEntity {
    readonly id: number;
    readonly email: string;
    readonly password: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly activation_link: string | null;
    readonly is_activated: boolean;
}

export interface UserDtoInterface {
    readonly id: number;
    readonly email: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly isActivated: boolean;
}