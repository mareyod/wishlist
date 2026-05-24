import { useCallback, useEffect, useState } from 'react'

import { getWishlist, createWish, updateWish, deleteWish } from '../api/wishesApi'

import { reserveWish, unreserveWish } from '../api/reservationsApi'

export default function useWishlist(nickname, userId) {

    const [wishlist, setWishlist] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const refreshWishlist = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getWishlist(nickname)
            setWishlist(data)
            setError(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [nickname, userId])

    useEffect(() => {
        refreshWishlist()
    }, [refreshWishlist])


    const handleCreateWish = async (formData) => {
        try {
            await createWish(formData)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось создать желание:', e)
            setError(e.message)
        }
    }


    const handleUpdateWish = async (id, formData) => {
        try {
            await updateWish(id, formData)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось обновить желание:', e)
            setError(e.message)
        }

    }

    const handleDeleteWish = async (id) => {
        try {
            await deleteWish(id)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось удалить желание:', e)
            setError(e.message)
        }
    }

    const handleReserve = async (wishId) => {
        try {
            await reserveWish(wishId)
            await refreshWishlist()

        } catch (e) {
            console.error('Не удалось забронировать желание:', e)
            setError(e.message)
        }
    }

    const handleUnreserve = async (wishId) => {
        try {
            await unreserveWish(wishId)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось отменить бронирование желания:', e)
            setError(e.message)
        }
    }

    return {
        wishlist,
        loading,
        error,
        refreshWishlist,
        handleCreateWish,
        handleUpdateWish,
        handleDeleteWish,
        handleReserve,
        handleUnreserve
    }
}