import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styles from "./WishlistPage.module.css";

import useGroups from '../../hooks/useGroups'
import useWishlist from '../../hooks/useWishlist'
import useFollowUser from '../../hooks/useFollowUser';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';


import WishlistProfileHeader from '../../components/features/wishlist/WishlistProfileHeader'
import WishlistGrid from '../../components/features/wishlist/WishlistGrid'
import GroupsBar from '../../components/features/shared/GroupsBar';
import PageState from '../PageState/PageState';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import type { EditableWish, SanitizedWishItem, WishFormValues } from '../../types/wish.types'

type RouteParams = {
    nickname: string
}

interface WishlistPageContentProps {
    nickname: string
}

export default function WishlistPage() {
    const { nickname } = useParams<RouteParams>()

    if (!nickname) {
        return <NotFoundPage />
    }

    return <WishlistPageContent nickname={nickname} />
}
function WishlistPageContent({ nickname }: WishlistPageContentProps) {

    const { openModal } = useModal()
    const { user } = useAuth()
    const {
        wishlist,
        loading: wishlistLoading,
        error: wishlistError,
        refreshWishlist,
        handleCreateWish,
        handleUpdateWish,
        handleDeleteWish,
        handleReserve,
        handleUnreserve

    } = useWishlist(nickname, user?.id ?? null)

    const isOwner = wishlist?.viewer?.role === 'owner'

    const {
        groups,
        loading: groupsLoading,
        error: groupsError,
        selectedGroupId,
        setSelectedGroupId,
        handleCreateGroup,
        handleDeleteGroup,
        handleEditGroup
    } = useGroups(isOwner)

    const {
        follow,
        unfollow,
        loading: followLoading

    } = useFollowUser({
        userId: wishlist?.owner?.id,
        refresh: refreshWishlist
    })


    const handleOpenCreateWishModal = useCallback(() => {
        openModal('wish.create', {
            wish: null,
            groups: groups,
            onSave: handleCreateWish
        })
    }, [openModal, groups, handleCreateWish])

    const handleOpenEditWishModal = useCallback((wish: EditableWish) => {
        openModal('wish.edit', {
            wish,
            groups: groups,
            onSave: (formData: WishFormValues) => handleUpdateWish(wish.id, formData)
        })
    }, [openModal, groups, handleUpdateWish])

    const handleOpenWishDetailsModal = useCallback((wish: SanitizedWishItem) => {
        openModal('wish.details', {
            wish
        })
    }, [openModal])


    const { owner, viewer, items } = wishlist ?? {}

    const filteredItems = useMemo(() => {
        if (!items) return []
        if (!selectedGroupId) return items

        return items.filter(item =>
            item.groups?.some(group => group.id=== selectedGroupId)
        )
    }, [items, selectedGroupId])


    return (
        <PageState
            loading={(isOwner && groupsLoading) || wishlistLoading}
            error={wishlistError || groupsError}
            isEmpty={!wishlist}
            emptyText="Wishlist не найден"
            onRetry={refreshWishlist}
        >
            <div className={styles.wrapper}>
                <div className={styles.container}>
                    <WishlistProfileHeader
                        owner={owner}
                        viewer={viewer}
                        onAddWish={handleOpenCreateWishModal}
                        onFollow={follow}
                        onUnfollow={unfollow}
                        followLoading={followLoading}
                        onAvatarChanged={refreshWishlist}
                    />
                    {viewer?.role === 'owner' && (
                        <GroupsBar
                            groups={groups}
                            selected={selectedGroupId}
                            onSelect={setSelectedGroupId}
                            onCreate={handleCreateGroup}
                            onDelete={handleDeleteGroup}
                            onEdit={handleEditGroup}
                        />
                    )}
                    <WishlistGrid
                        items={filteredItems}
                        viewer={viewer}
                        onClick={handleOpenWishDetailsModal}
                        onEdit={handleOpenEditWishModal}
                        onDelete={handleDeleteWish}
                        onReserve={handleReserve}
                        onUnreserve={handleUnreserve}
                    />
                </div>
            </div>
        </PageState>
    )
}