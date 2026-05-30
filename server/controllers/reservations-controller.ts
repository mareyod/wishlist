import reservationsService from '../service/reservations-service';

import type { Request, Response, NextFunction } from 'express';

class ReservationsController {

  async reserve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
          next(new Error('Unauthorized'));
          return;
      }
      const userId = req.user.id
      const itemId = Number(req.params.itemId)
      const result = await reservationsService.reserve(itemId, userId)

      res.json(result)
    } catch (e) {
      next(e)
    }
  }

  async unreserve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
          next(new Error('Unauthorized'));
          return;
      }
      const userId = req.user.id
      const itemId = Number(req.params.itemId)

      const result = await reservationsService.unreserve(itemId, userId)

      res.json(result)
    } catch (e) {
      next(e)
    }
  }

  async getReservation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
          next(new Error('Unauthorized'));
          return;
      }
      const userId = req.user.id
      const itemId = Number(req.params.itemId)

      const result = await reservationsService.getReservation(itemId, userId)

      res.json(result)
    } catch (e) {
      next(e)
    }
  }
}

export default new ReservationsController();