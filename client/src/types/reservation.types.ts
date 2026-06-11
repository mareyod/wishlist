export interface ReservationEntity {
    readonly id: number;
    readonly item_id: number;
    readonly reserver_id: number;
}

export interface ReservationStatus {
    readonly is_reserved: boolean;
    readonly is_reserved_by_me: boolean;
}