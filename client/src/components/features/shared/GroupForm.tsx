import React from 'react'
import styles from './GroupForm.module.css'

interface GroupFormProps {
    value: string;
    setValue: (value: string) => void;
    color: string;
    setColor: (color: string) => void;
    colors: string[];
    onSubmit: () => void;
    onCancel: () => void;
    autoFocus?: boolean;
}


export default function GroupForm({
    value,
    setValue,
    color,
    setColor,
    colors,
    onSubmit,
    onCancel,
    autoFocus = true
}: GroupFormProps) {

  return (
    <div className={styles.editBox}>
        <input
            autoFocus={autoFocus}
            value={value}
            placeholder="Название"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit()
                if (e.key === 'Escape')  onCancel()
            }}
        />
        <div className={styles.colorPicker}>
            {colors.map(c => (
                <button
                    key={c}
                    type="button"
                    className={`
                        ${styles.colorDot}
                        ${color === c ? styles.activeDot : ''}
                    `}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                />

            ))}
        </div>
        <button
            type="button"
            className={styles.confirmButton}
            onClick={onSubmit}
        >
            ✓
        </button>
        <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
        >
            ×
        </button>
    </div>
  )
}
