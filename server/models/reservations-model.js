const db = require('../db')

class ReservationsModel {

  async findByItemId(itemId) {
    const res = await db.query(
      `
      SELECT *
      FROM reservations
      WHERE item_id = $1
      `,
      [itemId]
    )

    return res.rows[0]
  }

  async findByItemAndUser(itemId, userId) {
    const res = await db.query(
      `
      SELECT *
      FROM reservations
      WHERE item_id = $1
        AND reserver_id = $2
      `,
      [itemId, userId]
    )

    return res.rows[0]
  }

  async createReservation(itemId, userId) {
    return db.query(
      `
      INSERT INTO reservations (item_id, reserver_id)
      VALUES ($1, $2)
      ON CONFLICT (item_id) DO NOTHING
      `,
      [itemId, userId]
    )
  }

  async deleteReservation(itemId, userId) {
    const res = await db.query(
      `
      DELETE FROM reservations
      WHERE item_id = $1
        AND reserver_id = $2
      `,
      [itemId, userId]
    )

    return res.rowCount
  }

  async getReservation(itemId) {
    const res = await db.query(
      `
      SELECT *
      FROM reservations
      WHERE item_id = $1
      `,
      [itemId]
    )

    return res.rows[0]
  }

  async deleteByUserAndOwner(reserverId, ownerId) {
    return db.query(
      `
      DELETE FROM reservations r
      USING wishlist_items wi
      WHERE r.item_id = wi.id
        AND r.reserver_id = $1
        AND wi.owner_user_id = $2
      `,
      [reserverId, ownerId]
    )
  }

}

module.exports = new ReservationsModel()