import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styles from "./WishlistPage.module.css";

import useGroups from '../../hooks/useGroups'
import useWishlist from '../../hooks/useWishlist'
import useFollowUser from '../../hooks/useFollowUser'
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../hooks/useModal';


import WishlistProfileHeader from '../../components/features/wishlist/WishlistProfileHeader'
import WishlistGrid from '../../components/features/wishlist/WishlistGrid'
import GroupsBar from '../../components/features/shared/GroupsBar';
import PageState from '../PageState/PageState';

export default function WishlistPage() {

    const { nickname } = useParams()
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

    } = useWishlist(nickname, user?.id)

    const {
        groups,
        loading: groupsLoading,
        error: groupsError,
        selectedGroupId,
        setSelectedGroupId,
        handleCreateGroup,
        handleDeleteGroup,
        handleEditGroup

    } = useGroups()

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
            loading: false,
            serverError: '',
            onSave: handleCreateWish
        })
    }, [openModal, groups, handleCreateWish])

    const handleOpenEditWishModal = useCallback((wish) => {
        openModal('wish.edit', {
            wish,
            groups: groups,
            loading: false,
            serverError: '',
            onSave: (formData) => handleUpdateWish(wish.id, formData)
        })
    }, [openModal, groups, handleUpdateWish])

    const handleOpenWishDetailsModal = useCallback((wish) => {
        if (!wish) return 
        openModal('wish.details', {
            wish
        })
    }, [openModal])


    const { owner, viewer, items } = wishlist || {}

    const filteredItems = useMemo(() => {
        if (!selectedGroupId) return items

        return items.filter(item =>
            item.groups?.some(group => Number(group.id) === Number(selectedGroupId))
        )
    }, [items, selectedGroupId])



    return (
        <PageState
            loading={groupsLoading || wishlistLoading}
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
                        owner={owner}
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