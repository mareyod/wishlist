
const db = require('../db')

class UserModel {

    async create(email, password, activationLink, nickname, avatar_url) {
        const user = await db.query(
            `INSERT INTO users 
            (email, password, activation_link, nickname, avatar_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [email, password, activationLink, nickname, avatar_url]
        )

        return user.rows[0]
    }

    async findByEmail(email) {
        const user = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        )

        return user.rows[0]
    }
    async findByNickname(nickname) {
        const user = await db.query(
            `SELECT * FROM users WHERE nickname = $1`,
            [nickname]
        )
        return user.rows[0]
    }
    async findByLink(activationLink) {
        const user = await db.query(
            `SELECT * FROM users WHERE activation_link = $1`,
            [activationLink]
        )

        return user.rows[0]
    }
    async findById(userId) {
        const user = await db.query(
            `SELECT * FROM users WHERE id = $1`,
            [userId]
        )

        return user.rows[0]
    }

    async activate(activationLink) {
        const user = await db.query(
            `UPDATE users
            SET is_activated = true
            WHERE activation_link = $1
            RETURNING *`,
            [activationLink]
        )

        return user.rows[0]
    }

}

module.exports = new UserModel()