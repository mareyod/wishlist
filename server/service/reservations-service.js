const ReservationsModel = require('../models/reservations-model')
const ApiError = require('../exceptions/api-error')
const db = require('../db')

class ReservationsService {

  async reserve(itemId, userId) {

    const itemRes = await db.query(
      `SELECT owner_user_id FROM wishlist_items WHERE id = $1`,
      [itemId]
    )

    const item = itemRes.rows[0]

    if (!item) {
      throw ApiError.BadRequest('Item not found')
    }

    if (item.owner_user_id === userId) {
      throw ApiError.BadRequest('Owner cannot reserve own item')
    }

    await ReservationsModel.createReservation(itemId, userId)

    return { success: true }
  }

  async unreserve(itemId, userId) {

    const deleted = await ReservationsModel.deleteReservation(itemId, userId)

    if (!deleted) {
      throw ApiError.BadRequest('Reservation not found')
    }

    return { success: true }
  }

  async getReservation(itemId, userId) {

    const reservation = await ReservationsModel.getReservation(itemId)

    if (!reservation) {
      return {
        is_reserved: false,
        is_reserved_by_me: false
      }
    }

    return {
      is_reserved: true,
      is_reserved_by_me: reservation.reserver_id === userId
    }
  }
}

module.exports = new ReservationsService()