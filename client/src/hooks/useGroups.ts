import { useState, useEffect, useCallback } from 'react'

import { createGroup, deleteGroup, getGroups, updateGroup } from '../api/groupsApi'

import type { FriendshipGroup } from '../types/group.types';

export interface UseGroupsResult {
    groups: FriendshipGroup[];
    loading: boolean;
    error: string | null;
    selectedGroupId: number | null;
    setSelectedGroupId: React.Dispatch<React.SetStateAction<number | null>>;
    handleCreateGroup: (name: string, color: string) => Promise<void>;
    handleDeleteGroup: (groupId: number) => Promise<void>;
    handleEditGroup: (groupId: number, name: string, color: string) => Promise<void>;
}

export default function useGroups(enabled = true): UseGroupsResult {

    const [groups, setGroups] = useState<FriendshipGroup[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

    const refreshGroups = useCallback(async (): Promise<void>  => {
	    if (!enabled) return
        try {	
            setLoading(true)
            const data = await getGroups()
            setGroups(data)
            setError(null)
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ошибка загрузки групп')
        } finally {
            setLoading(false)
        }
    }, [enabled])

    useEffect(() => {
        void refreshGroups()
    }, [refreshGroups])

    const handleCreateGroup = async (name: string, color: string): Promise<void> => {
        try {
            await createGroup(name, color)
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось создать группу:', e)
            setError(e instanceof Error ? e.message : 'Ошибка создания группы')
        }
    }

    const handleDeleteGroup = async (groupId: number): Promise<void> => {
        try {
            await deleteGroup(groupId)
            if (selectedGroupId === groupId) {
                setSelectedGroupId(null)
            }
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось удалить группу:', e)
            setError(e instanceof Error ? e.message : 'Ошибка удаления группы')


        }
    }

    const handleEditGroup = async (groupId: number, name: string, color: string) => {
        try {
            await updateGroup(groupId, name, color)
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось изменить группу:', e)
            setError(e instanceof Error ? e.message : 'Ошибка обновления группы')
        }
    }



    return {
        groups,

        loading,
        error,

        selectedGroupId,
        setSelectedGroupId,

        handleCreateGroup,
        handleDeleteGroup,
        handleEditGroup
    }
}