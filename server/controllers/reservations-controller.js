const reservationsService = require('../service/reservations-service')

class ReservationsController {

  async reserve(req, res, next) {
    try {
      const userId = req.user.id
      const itemId = req.params.itemId
      const result = await reservationsService.reserve(itemId, userId)

      return res.json(result)
    } catch (e) {
      next(e)
    }
  }

  async unreserve(req, res, next) {
    try {
      const userId = req.user.id
      const itemId = req.params.itemId

      const result = await reservationsService.unreserve(itemId, userId)

      return res.json(result)
    } catch (e) {
      next(e)
    }
  }

  async getReservation(req, res, next) {
    try {
      const userId = req.user.id
      const itemId = req.params.itemId

      const result = await reservationsService.getReservation(itemId, userId)

      return res.json(result)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new ReservationsController()