import { useCallback } from 'react'
import { getWishlist, createWish, updateWish, deleteWish } from '../api/wishesApi'
import { reserveWish, unreserveWish } from '../api/reservationsApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

    const queryClient = useQueryClient()

    const queryKey = ['wishlist', nickname, userId]

    const {
        data: wishlist,
        isLoading,
        error: queryError,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: () => getWishlist(nickname),
        enabled: !!nickname,
    })

    const invalidateWishlist = (): Promise<void> => {
        return queryClient.invalidateQueries({ queryKey })
    }

    const createMutation = useMutation({
        mutationFn: (formData: WishFormValues) => createWish(formData),
        onSuccess: invalidateWishlist
    })
 
    const updateMutation = useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: WishFormValues }) =>
            updateWish(id, formData),
        onSuccess: invalidateWishlist
    })
 
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteWish(id),
        onSuccess: invalidateWishlist
    })
 
    const reserveMutation = useMutation({
        mutationFn: (wishId: number) => reserveWish(wishId),
        onSuccess: invalidateWishlist
    })
 
    const unreserveMutation = useMutation({
        mutationFn: (wishId: number) => unreserveWish(wishId),
        onSuccess: invalidateWishlist
    })


    const handleCreateWish = useCallback(async (formData: WishFormValues): Promise<void> => {
        await createMutation.mutateAsync(formData)
    }, [createMutation])


    const handleUpdateWish = useCallback(async (id: number, formData: WishFormValues): Promise<void> => {
        await updateMutation.mutateAsync({ id, formData })

    }, [updateMutation])

    const handleDeleteWish = useCallback(async (id: number): Promise<void> => {
        await deleteMutation.mutateAsync(id)
    }, [deleteMutation])

    const handleReserve = useCallback(async (wishId: number): Promise<void> => {
        await reserveMutation.mutateAsync(wishId)
    }, [reserveMutation])

    const handleUnreserve = useCallback(async (wishId: number): Promise<void> => {
        await unreserveMutation.mutateAsync(wishId)
    }, [unreserveMutation])

    const refreshWishlist = useCallback(async (): Promise<void> => {
        await refetch()
    }, [refetch])

    const error =
        queryError instanceof Error ? queryError.message :
        createMutation.error instanceof Error ? createMutation.error.message :
        updateMutation.error instanceof Error ? updateMutation.error.message :
        deleteMutation.error instanceof Error ? deleteMutation.error.message :
        reserveMutation.error instanceof Error ? reserveMutation.error.message :
        unreserveMutation.error instanceof Error ? unreserveMutation.error.message :
        null

    return {
        wishlist: wishlist ?? null,
        loading: isLoading,
        error,
        refreshWishlist,
        handleCreateWish,
        handleUpdateWish,
        handleDeleteWish,
        handleReserve,
        handleUnreserve
    }
}