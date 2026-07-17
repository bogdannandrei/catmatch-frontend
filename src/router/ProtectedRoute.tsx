import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/authStorage";

export function ProtectedRoute() {
    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}