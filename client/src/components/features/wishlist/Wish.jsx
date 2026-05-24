import { useState } from 'react'

import styles from './Wish.module.css'

const API_URL = import.meta.env.VITE_API_URL

const DEFAULT_IMAGE = '/img/WISH_PLACEHOLDER.jpg'

export default function Wish({
    wish,
    viewer,
    onClick,
    onEdit,
    onDelete,
    onReserve,
    onUnreserve

}) {
    const [hovered, setHovered] =  useState(false)
    const [menuOpen, setMenuOpen] =  useState(false)

    const isOwner =  viewer?.role === 'owner'
    const isFriend = viewer?.role === 'friend'

    const canReserve = isFriend
    const canEdit = isOwner
    const showReservation = !isOwner
    const showGroups = isOwner
    const isReserved = wish.is_reserved
    const reservedByMe = wish.is_reserved_by_me

    return (
        <div
            className={styles.card}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false)
                setMenuOpen(false)
            }}
        >
            {canEdit && hovered && (
                <div className={styles.options}>
                    <button
                        className={ styles.optionsButton }
                        onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpen(prev => !prev)
                        }}
                    >
                        ⋯
                    </button>

                    {menuOpen && (
                        <div className={styles.dropdown} >
                            <button className={styles.dropdownItem}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEdit(wish)
                                    setMenuOpen(false)
                                }}
                            >
                                Редактировать
                            </button>
                            <button className={styles.dropdownItem}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete(wish.id)
                                    setMenuOpen(false)
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className={styles.imageWrapper}>
              <img 
                className={styles.cardImg} 
                src={wish.image_url ? API_URL + wish.image_url : DEFAULT_IMAGE} 
              />
              {showReservation && isReserved && (
                <div className={styles.reservedOverlay}>
                    <div className={styles.reservedBadge}>
                        Забронировано
                    </div>
                </div>
              )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>
                    {wish.title}
                </h3>
                {!!wish.price && (
                    <div className={styles.price}>
                        {Math.round(wish.price)} ₽
                    </div>
                )}
                {showGroups && (
                    <div className={styles.groups}>
                        {wish.groups?.map(
                            group => (
                                <span key={group.id} className={styles.group} style={{ backgroundColor: group.color }}>
                                    {group.name}
                                </span>
                            )
                        )}
                    </div>
                )}
            </div>

            {canReserve && (
                <div
                    className={
                        styles.actions
                    }
                >
                    {!isReserved && (
                        <button
                            className={styles.reserveButton}
                            onClick={(e) => {
                                e.stopPropagation()
                                onReserve(wish.id)
                            }}
                        >
                            Забронировать
                        </button>
                    )}

                    {reservedByMe && (
                        <button
                            className={styles.unreserveButton}
                            onClick={(e) => {
                                e.stopPropagation()
                                onUnreserve(wish.id)
                            }}
                        >
                            Снять бронь
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}