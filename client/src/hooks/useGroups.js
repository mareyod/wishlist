import { useState, useEffect, useCallback } from 'react'

import { createGroup, deleteGroup, getGroups, updateGroup } from '../api/groupsApi'

export default function useGroups() {

    const [groups, setGroups] = useState([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(null)

    const [selectedGroupId, setSelectedGroupId] = useState(null)

    const refreshGroups = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getGroups()
            setGroups(data)
            setError(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshGroups()
    }, [refreshGroups])

    const handleCreateGroup = async (name, color) => {
        try {
            await createGroup(name, color)
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось создать группу:', e)
        }
    }

    const handleDeleteGroup = async (groupId) => {
        try {
            await deleteGroup(groupId)
            if (selectedGroupId === groupId) {
                setSelectedGroupId(null)
            }
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось удалить группу:', e)

        }
    }

    const handleEditGroup = async (groupId, name, color) => {
        try {
            await updateGroup(groupId, name, color)
            await refreshGroups()
        } catch (e) {
            console.error('Не удалось изменить группу:', e)

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