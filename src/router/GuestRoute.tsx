import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../auth/authStorage";

export function GuestRoute() {
    if (isLoggedIn()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}