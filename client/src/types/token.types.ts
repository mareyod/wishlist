export interface TokenEntity {
    readonly id: number;
    readonly user_id: number;
    readonly refresh_token: string;
}