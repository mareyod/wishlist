import { useState, useRef, useEffect } from 'react'

import styles from './Wish.module.css'

import type { SanitizedWishItem } from '../../../types/wish.types'
import type { ViewerContext } from '../../../types/friendship.types'

const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_IMAGE = '/img/WISH_PLACEHOLDER.jpg'

interface WishProps {
    wish: SanitizedWishItem;
    viewer?: ViewerContext | undefined;
    onClick: () => void;
    onEdit: (wish: SanitizedWishItem) => void;
    onDelete: (id: number) => void;
    onReserve: (id: number) => void;
    onUnreserve: (id: number) => void;
}


export default function Wish({
    wish,
    viewer,
    onClick,
    onEdit,
    onDelete,
    onReserve,
    onUnreserve

}: WishProps) {
    const [menuOpen, setMenuOpen] =  useState<boolean>(false)

    const isOwner =  viewer?.role === 'owner'
    const isFriend = viewer?.role === 'friend'

    const canReserve = isFriend
    const canEdit = isOwner
    const showReservation = !isOwner
    const showGroups = isOwner
    const isReserved = wish.is_reserved
    const reservedByMe = wish.is_reserved_by_me
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent): void {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [])

    return (
        <div
            className={styles.card}
            onClick={onClick}
            onMouseLeave={() => {
                setMenuOpen(false)
            }}
        >
            {canEdit && (
                <div className={styles.options} ref={menuRef}>
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