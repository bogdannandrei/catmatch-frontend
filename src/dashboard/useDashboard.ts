import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import { clearAuthSession, getCurrentUser, getRefreshToken } from "../auth/authStorage";

export function useDashboard() {
    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    async function handleLogout() {
        const refreshToken = getRefreshToken();

        try {
            if (refreshToken) {
                await logout({ refreshToken });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            clearAuthSession();
            navigate("/login");
        }
    }

    return {
        currentUser,
        handleLogout,
        handleOpenMyCats,
        handleOpenDiscover,
    };

    function handleOpenMyCats() {
        navigate("/my-cats");
    }

    function handleOpenDiscover() {
        navigate("/discover");
    }
}