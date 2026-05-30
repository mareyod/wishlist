import db from '../db';

import type { TokenEntity } from '../types/token.types';


class TokenModel {

    async create(userId: number, refreshToken: string): Promise<TokenEntity> {
        const result = await db.query<TokenEntity>(
            `INSERT INTO tokens 
            (user_id, refresh_token)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, refreshToken]
        )

        const token = result.rows[0];

        if (!token) {
            throw new Error('Не удалось создать токен');
        }

        return token;
    }

    async findByUserId(userId: number): Promise<TokenEntity | undefined> {
        const token = await db.query<TokenEntity>(
            `SELECT * FROM tokens WHERE user_id = $1`,
            [userId]
        )

        return token.rows[0]
    }

    async updateToken(userId: number, refreshToken: string): Promise<TokenEntity> {
        const result = await db.query<TokenEntity>(
            `UPDATE tokens
            SET refresh_token = $1
            WHERE user_id = $2
            RETURNING *`,
            [refreshToken, userId]
        )

        const token = result.rows[0];

        if (!token) {
            throw new Error('Не удалось обновить токен');
        }

        return token
    }

    async deleteToken(refreshToken: string): Promise<TokenEntity | undefined>{
        const tokenData = await db.query<TokenEntity>(
            `DELETE FROM tokens
                WHERE refresh_token = $1
                RETURNING *`,
            [refreshToken]
        )

        return tokenData.rows[0]
    }

    async findToken(refreshToken: string): Promise<TokenEntity | undefined>{
        const tokenData = await db.query(
            `SELECT * FROM tokens
                WHERE refresh_token = $1`,
            [refreshToken]
        )

        return tokenData.rows[0]
    }
 
}

export default new TokenModel();