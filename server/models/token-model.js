

const db = require('../db')

class TokenModel {

    async create(userId, refreshToken) {
        const token = await db.query(
            `INSERT INTO tokens 
            (user_id, refresh_token)
            VALUES ($1, $2)
            RETURNING *`,
            [userId, refreshToken]
        )

        return token.rows[0]
    }

    async findByUserId(userId) {
        const token = await db.query(
            `SELECT * FROM tokens WHERE user_id = $1`,
            [userId]
        )

        return token.rows[0]
    }

    async updateToken(userId, refreshToken) {
        const tokenData = await db.query(
            `UPDATE tokens
            SET refresh_token = $1
            WHERE user_id = $2
            RETURNING *`,
            [refreshToken, userId]
        )

        return tokenData.rows[0]
    }

    async deleteToken(refreshToken){
        const tokenData = await db.query(
            `DELETE FROM tokens
                WHERE refresh_token = $1
                RETURNING *`,
            [refreshToken]
        )

        return tokenData.rows[0]
    }

    async findToken(refreshToken){
        const tokenData = await db.query(
            `SELECT * FROM tokens
                WHERE refresh_token = $1`,
            [refreshToken]
        )

        return tokenData.rows[0]
    }


}

module.exports = new TokenModel()