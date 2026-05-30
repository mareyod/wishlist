import db from '../db';

import type { ReservationEntity } from '../types/reservation.types';


class ReservationsModel {

  async findByItemId(itemId: number): Promise<ReservationEntity | undefined> {
    const res = await db.query<ReservationEntity>(
      `
      SELECT *
      FROM reservations
      WHERE item_id = $1
      `,
      [itemId]
    )

    return res.rows[0]
  }

  async findByItemAndUser(itemId: number, userId: number): Promise<ReservationEntity | undefined> {
    const res = await db.query<ReservationEntity>(
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

  async createReservation(itemId: number, userId: number): Promise<void>  {
    await db.query(
      `
      INSERT INTO reservations (item_id, reserver_id)
      VALUES ($1, $2)
      ON CONFLICT (item_id) DO NOTHING
      `,
      [itemId, userId]
    )
  }

  async deleteReservation(itemId: number, userId: number): Promise<boolean> {
    const result = await db.query(
      `
      DELETE FROM reservations
      WHERE item_id = $1 AND reserver_id = $2
      RETURNING id
      `,
      [itemId, userId]
    )
    return (result.rowCount ?? 0) > 0;

  }

  async getReservation(itemId: number): Promise<ReservationEntity | undefined> {
    const res = await db.query<ReservationEntity>(
      `
      SELECT *
      FROM reservations
      WHERE item_id = $1
      `,
      [itemId]
    )

    return res.rows[0]
  }

  async deleteByUserAndOwner(reserverId: number, ownerId: number): Promise<boolean> {
    const result = await db.query(
      `
      DELETE FROM reservations r
      USING wishlist_items wi
      WHERE r.item_id = wi.id
        AND r.reserver_id = $1
        AND wi.owner_user_id = $2
      RETURNING id
      `,
      [reserverId, ownerId]
    )
    return (result.rowCount ?? 0) > 0;
  }

}

export default new ReservationsModel();