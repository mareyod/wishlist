export interface UserDtoInterface {
    readonly id: number;
    readonly email: string;
    readonly nickname: string;
    readonly avatar_url: string | null;
    readonly isActivated: boolean;
}