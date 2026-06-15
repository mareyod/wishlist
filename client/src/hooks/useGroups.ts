import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    const queryClient = useQueryClient()
    const queryKey = ['groups']

    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)

    const {
        data: groups,
        isLoading,
        error: queryError
    } = useQuery({
        queryKey,
        queryFn: getGroups,
        enabled,
    })

    const invalidateGroups = (): Promise<void> => {
        return queryClient.invalidateQueries({ queryKey })
    }
 
    const createMutation = useMutation({
        mutationFn: ({ name, color }: { name: string; color: string }) => createGroup(name, color),
        onSuccess: invalidateGroups,
    })
 
    const deleteMutation = useMutation({
        mutationFn: (groupId: number) => deleteGroup(groupId),
        onSuccess: invalidateGroups,
    })
 
    const editMutation = useMutation({
        mutationFn: ({ groupId, name, color }: { groupId: number; name: string; color: string }) => updateGroup(groupId, name, color),
        onSuccess: invalidateGroups,
    })

    const handleCreateGroup = async (name: string, color: string): Promise<void> => {
        await createMutation.mutateAsync({ name, color })
    }

    const handleDeleteGroup = async (groupId: number): Promise<void> => {
        if (selectedGroupId === groupId) {
            setSelectedGroupId(null)
        }
        await deleteMutation.mutateAsync(groupId)
    }

    const handleEditGroup = async (groupId: number, name: string, color: string) => {
        await editMutation.mutateAsync({ groupId, name, color })
    }

    const error =
        queryError instanceof Error ? queryError.message :
        createMutation.error instanceof Error ? createMutation.error.message :
        deleteMutation.error instanceof Error ? deleteMutation.error.message :
        editMutation.error instanceof Error ? editMutation.error.message :
        null

    return {
        groups: groups ?? [],
        loading: isLoading,
        error,
        selectedGroupId,
        setSelectedGroupId,
        handleCreateGroup,
        handleDeleteGroup,
        handleEditGroup
    }
}