
import React, { useEffect } from 'react'
import styles from './WishDetailsModal.module.css'

import type { SanitizedWishItem } from '../../../types/wish.types'


const API_URL = import.meta.env.VITE_API_URL
const DEFAULT_WISHIMAGE_PLACEHOLDER = "/img/WISH_PLACEHOLDER.jpg"

interface WishDetailsModalProps {
  wish: SanitizedWishItem;
  onClose: () => void;
}

export default function WishDetailsModal({ wish, onClose }: WishDetailsModalProps) {

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const {
    title,
    description,
    price,
    image_url,
    external_link,
  } = wish

  const imageSrc = image_url ? `${API_URL}${image_url}` : DEFAULT_WISHIMAGE_PLACEHOLDER 

  const formattedPrice = price != null ? new Intl.NumberFormat('ru-RU').format(price) : null

  return (
    <div
      className={styles.background}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className={styles.left}>
          <div className={styles.imageWrapper}>
            <img
              className={styles.image}
              src={imageSrc}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  DEFAULT_WISHIMAGE_PLACEHOLDER
              }}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              {title || 'Без названия'}
            </h2>

            {description && (
              <p className={styles.description}>
                {description}
              </p>
            )}

            {formattedPrice && (
              <div className={styles.price}>
                {formattedPrice} ₽
              </div>
            )}

            {external_link && (
              <a
                href={external_link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                Открыть ссылку
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}