import MainLayout from './components/layout/MainLayout'
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import WishlistPage from './pages/WishlistPage/WishlistPage';
import FriendsPage from './pages/FriendsPage/FriendsPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from './hooks/useAuth';
import AppLoader from './AppLoader';

export default function AppRouter() {
    const { isLoading } = useAuth()

    if (isLoading) {
        return <AppLoader />
    }

  return (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            <Route path="/users/:nickname" element={<WishlistPage />} />
            
            <Route path="/friends" element={<ProtectedRoute><FriendsPage /></ProtectedRoute>}/>
            
            <Route path="*" element={<NotFoundPage />} />

        </Route>
    </Routes>
  )
}
