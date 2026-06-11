import { useCallback, useEffect, useState } from 'react'
import { getWishlist, createWish, updateWish, deleteWish } from '../api/wishesApi'
import { reserveWish, unreserveWish } from '../api/reservationsApi'

import type { GetWishesResult, WishFormValues } from '../types/wish.types';

interface UseWishlistResult {
    wishlist: GetWishesResult | null;
    loading: boolean;
    error: string | null;
    refreshWishlist: () => Promise<void>;
    handleCreateWish: (formData: WishFormValues) => Promise<void>;
    handleUpdateWish: (id: number, formData: WishFormValues) => Promise<void>;
    handleDeleteWish: (id: number) => Promise<void>;
    handleReserve: (wishId: number) => Promise<void>;
    handleUnreserve: (wishId: number) => Promise<void>;
}
export default function useWishlist(nickname: string, userId: number | null): UseWishlistResult {

    const [wishlist, setWishlist] = useState<GetWishesResult | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const refreshWishlist = useCallback(async (): Promise<void> => {
        try {
            setLoading(true)
            const data: GetWishesResult = await getWishlist(nickname)
            setWishlist(data)
            setError(null)
        } catch (e) {
            setError(e instanceof Error ? e.message: 'Ошибка загрузки вишлиста');
        } finally {
            setLoading(false)
        }
    }, [nickname, userId])

    useEffect(() => {
        void refreshWishlist()
    }, [refreshWishlist])


    const handleCreateWish = async (formData: WishFormValues): Promise<void> => {
        try {
            await createWish(formData)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось создать желание:', e)
            setError(e instanceof Error ? e.message : 'Ошибка создания желания');
        }
    }


    const handleUpdateWish = async (id: number, formData: WishFormValues): Promise<void> => {
        try {
            await updateWish(id, formData)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось обновить желание:', e)
            setError(e instanceof Error ? e.message : 'Ошибка обновления желания');
        }

    }

    const handleDeleteWish = async (id: number): Promise<void> => {
        try {
            await deleteWish(id)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось удалить желание:', e)
            setError(e instanceof Error ? e.message : 'Ошибка удаления желания');
        }
    }

    const handleReserve = async (wishId: number): Promise<void> => {
        try {
            await reserveWish(wishId)
            await refreshWishlist()

        } catch (e) {
            console.error('Не удалось забронировать желание:', e)
            setError(e instanceof Error ? e.message : 'Ошибка бронирования');
        }
    }

    const handleUnreserve = async (wishId: number): Promise<void> => {
        try {
            await unreserveWish(wishId)
            await refreshWishlist()
        } catch (e) {
            console.error('Не удалось отменить бронирование желания:', e)
            setError(e instanceof Error ? e.message : 'Ошибка снятия брони');
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