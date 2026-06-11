import { Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

import type { ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return null

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return children
}