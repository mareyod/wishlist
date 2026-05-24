import React from 'react'
import styles from './ConfirmModal.module.css'

export default function ConfirmModal({onConfirm, onCancel}) {
  return (
    <div className={styles.background} onClick={onCancel}>
        <div className={styles.modal}>
            <h1 className={styles.title}>Удалить желание</h1>
            <p className={styles.question}>Уверены, что хотите удалить это желание?</p>
            <div className={styles.buttonArea}>
                <button className={styles.cancel} onClick={onCancel}>Отмена</button>
                <button className={styles.confirm} onClick={onConfirm}>Удалить</button>
            </div>
        </div>
                    
    </div>
  )
}
