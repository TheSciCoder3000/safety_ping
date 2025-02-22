import { Navigate, Outlet } from 'react-router'
import { useAuth } from './contexts/AuthContext'
import BottomNav from './BottomNav';

function ProtectedRoute() {
    const { currentUser, loading } = useAuth();

    if (!loading) {
        if (currentUser) return (
            <>
                <Outlet />
                <BottomNav />
            </>
        )
        return <Navigate to="/login" />
    }
}

export default ProtectedRoute;