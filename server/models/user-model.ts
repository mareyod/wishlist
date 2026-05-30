
import db from '../db';

import type { UserEntity } from '../types/user.types';
class UserModel {

    async create(email: string, password: string, activationLink: string, nickname: string, avatar_url: string | null): Promise<UserEntity> {
        const res = await db.query<UserEntity>(
            `INSERT INTO users 
            (email, password, activation_link, nickname, avatar_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,   
            [email, password, activationLink, nickname, avatar_url]
        )

        const user = res.rows[0];

        if (!user) {
            throw new Error('Не удалось создать пользователя')
        }
        return user
    }

    async findByEmail(email: string): Promise<UserEntity | undefined> {
        const user = await db.query<UserEntity>(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        return user.rows[0]
    }
    async findByNickname(nickname: string): Promise<UserEntity | undefined>  {
        const user = await db.query<UserEntity>(
            `SELECT * FROM users WHERE nickname = $1`,
            [nickname]
        )
        return user.rows[0]
    }
    async findByLink(activationLink: string): Promise<UserEntity | undefined> {
        const user = await db.query<UserEntity>(
            `SELECT * FROM users WHERE activation_link = $1`,
            [activationLink]
        )

        return user.rows[0]
    }
    async findById(userId: number): Promise<UserEntity | undefined> {
        const user = await db.query<UserEntity>(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        )

        return user.rows[0]
    }

    async activate(activationLink: string): Promise<UserEntity | undefined> {
        const user = await db.query<UserEntity>(
            `UPDATE users
            SET is_activated = true
            WHERE activation_link = $1
            RETURNING *`,
            [activationLink]
        )

        return user.rows[0]
    }

    async updateAvatar(userId: number, avatar_url: string): Promise<UserEntity> {
        const res = await db.query<UserEntity>(
            `UPDATE users
            SET avatar_url = $1
            WHERE id = $2
            RETURNING *`,
            [avatar_url, userId]
        );

        const user = res.rows[0];

        if (!user) {
            throw new Error('Не удалось обновить фото')
        }
        return user
    }

}

export default new UserModel();