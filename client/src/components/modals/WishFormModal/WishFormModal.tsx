import React, { useState, useEffect, useRef} from 'react'
import styles from './WishFormModal.module.css'
import type { WishFormValues, WishFormErrors, WishFormModalProps } from '../../../types/wish.types'

const API_URL = import.meta.env.VITE_API_URL

const MAX_FILE_SIZE = 8 * 1024 * 1024

const emptyWish: WishFormValues = {
  title: '',
  description: '',
  external_link: '',
  price: '',
  is_public: false,
  visibility_group_ids: [],
  image_url: null,
  image_file: null
}

export default function WishFormModal({ wish, groups = [], onSave, onClose}: WishFormModalProps) {
  const [form, setForm] = useState<WishFormValues>(emptyWish)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [drag, setDrag] = useState<boolean>(false)

  const [errors, setErrors] = useState<WishFormErrors>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditMode = Boolean(wish)

  useEffect(() => {
    if (wish) {
      setForm({
        title: wish.title,
        description: wish.description ?? '',
        external_link: wish.external_link ?? '',
        price: wish.price ?? '',
        is_public: wish.is_public,
        visibility_group_ids: wish.groups?.map(g => g.id) ?? [],
        image_url: wish.image_url,
        image_file: null
      })
      setPreviewUrl( wish.image_url ? `${API_URL}${wish.image_url}` : null)

    } else {
      setForm(emptyWish)
      setPreviewUrl(null)
    }
  }, [wish])

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const validate = (): boolean => {
    const nextErrors: WishFormErrors = {}

    if (!form.title.trim()) {
      nextErrors.title = 'Введите название'
    }

    if (form.title.length > 255) {
      nextErrors.title = 'Максимум 255 символов'
    }

    if (
      form.price !== '' &&
      Number(form.price) < 0
    ) {
      nextErrors.price = 'Цена не может быть отрицательной'
    }

    if (
      form.external_link &&
      !/^https?:\/\/.+/i.test(
        form.external_link
      )
    ) {
      nextErrors.external_link =  'Введите корректный URL'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const updateField = <K extends keyof WishFormValues>(field: K, value: WishFormValues[K]) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const processFile = (file: File | undefined): void => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({
        ...prev,
        image: 'Можно загружать только изображения'
      }))
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        image: 'Максимальный размер 8MB'
      }))
      return
    }

    if (
      previewUrl &&
      previewUrl.startsWith('blob:')
    ) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(file)

    setPreviewUrl(objectUrl)

    setForm(prev => ({
      ...prev,
      image_file: file
    }))

    setErrors(prev => ({
      ...prev,
      image: null
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void  => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDrag(false)

    const file = e.dataTransfer.files?.[0]
    processFile(file)
  }

  const removeImage = (): void => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }

    setPreviewUrl(null)

    setForm(prev => ({
      ...prev,
      image_url: null,
      image_file: null,
      remove_image: true
    }))
  }

  const toggleGroup = (groupId: number): void => {

    const id = groupId
  
    setForm(prev => {
      const exists = prev.visibility_group_ids.includes(id)

      return {
        ...prev,
        visibility_group_ids: exists
          ? prev.visibility_group_ids.filter(i => i !== id)
          : [...prev.visibility_group_ids, id]
      }
    })
  }

  const handleSubmit =  (): void => {
    if (!validate()) return

    onSave({
      ...form,
      price:
        form.price === ''
          ? null
          : Number(form.price)
    })
    onClose()
  }

  return (
    <div className={styles.background} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        <div className={styles.left}>
          {previewUrl ? (
            <div className={styles.imageWrapper}>
              <img src={previewUrl} className={styles.img}/>

              <div className={styles.imageActions}>
                <button type="button" onClick={() => fileInputRef.current?.click() }>
                  Изменить
                </button>
                <button type="button" onClick={removeImage}>
                  Удалить
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`${styles.uploadBox} ${drag ? styles.dragActive : ''}`}
              onDragEnter={e => {
                e.preventDefault()
                setDrag(true)
              }}
              onDragLeave={e => {
                e.preventDefault()
                setDrag(false)
              }}
              onDragOver={e => {
                e.preventDefault()
              }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.uploadInner}>
                <div className={styles.icon}>
                  🖼
                </div>

                <p>
                  Перетащите изображение
                  или нажмите
                </p>

                <span>
                  JPG, PNG, WEBP до 8MB
                </span>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className={styles.hiddenInput}
            onChange={handleFileChange}
          />

          {errors.image && (
            <div className={styles.error}>
              {errors.image}
            </div>
          )}
        </div>

        <div className={styles.right}>
          <h2>
            {isEditMode
              ? 'Редактирование желания'
              : 'Новое желание'}
          </h2>

          <div className={styles.field}>
            <label>Название *</label>

            <input
              type="text"
              value={form.title}
              onChange={e =>
                updateField(
                  'title',
                  e.target.value
                )
              }
              maxLength={255}
            />

            {errors.title && (
              <div className={styles.error}>
                {errors.title}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Описание</label>

            <textarea
              rows={5}
              value={form.description}
              onChange={e =>
                updateField(
                  'description',
                  e.target.value
                )
              }
            />
          </div>

          <div className={styles.field}>
            <label>Ссылка</label>

            <input
              type="url"
              value={form.external_link}
              onChange={e =>
                updateField(
                  'external_link',
                  e.target.value
                )
              }
            />

            {errors.external_link && (
              <div className={styles.error}>
                {errors.external_link}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label>Цена</label>

            <input
              type="number"
              min="0"
              value={form.price ? `${Math.round(form.price)}` : ''}
              onChange={e =>
                updateField(
                  'price',
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
            />

            {errors.price && (
              <div className={styles.error}>
                {errors.price}
              </div>
            )}
          </div>

          <div className={styles.checkbox}>
            <label>
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={e =>
                  updateField(
                    'is_public',
                    e.target.checked
                  )
                }
              />

              Публичное желание
            </label>
          </div>

          {!form.is_public && (
            <div className={styles.field}>
              <label>
                Группы видимости
              </label>

              <div className={styles.groups}>
                {groups.map(group => (
                  <label
                    key={group.id}
                    className={
                      styles.groupItem
                    }
                  >
                    <input
                      type="checkbox"
                      checked={form.visibility_group_ids.includes(Number(group.id))}
                      onChange={() =>
                        toggleGroup(group.id)
                      }
                    />

                    {group.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
            >
              Отмена
            </button>

            <button
              type="button"
              onClick={handleSubmit}
            >
              {isEditMode ? 'Сохранить': 'Создать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}