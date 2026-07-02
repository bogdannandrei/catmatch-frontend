import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";

type CurrentUser = {
    id: number;
    email: string;
    username: string;
    displayName: string;
};

export function useDashboard() {
    const navigate = useNavigate();

    const currentUserRaw = localStorage.getItem("currentUser");
    const currentUser: CurrentUser | null = currentUserRaw
        ? JSON.parse(currentUserRaw)
        : null;

    async function handleLogout() {
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            if (refreshToken) {
                await logout({ refreshToken });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");

            navigate("/login");
        }
    }

    return {
        currentUser,
        handleLogout,
    };
}