import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import {
    clearAuthSession,
    getRefreshToken,
    getCurrentUser,
} from "../auth/authStorage";

export function AppNav() {
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

    return (
        <nav className="app-nav">
            <div className="app-nav-brand" onClick={() => navigate("/dashboard")}>
                <div className="app-nav-logo">🐾</div>

                <div>
                    <strong>CatMatch</strong>
                    <span>Cozy matches for chaotic cats</span>
                </div>
            </div>

            <div className="app-nav-links">
                <NavLink to="/dashboard">Home</NavLink>
                <NavLink to="/my-cats">My cats</NavLink>
                <NavLink to="/discover">Discover</NavLink>
                <NavLink to="/matches">Matches</NavLink>
                <NavLink to="/chats">Chats</NavLink>
            </div>

            <div className="app-nav-user">
                <div className="app-nav-user-pill">
                    <span>😺</span>
                    <strong>{currentUser?.displayName || currentUser?.username || "Cat lover"}</strong>
                </div>

                <button className="nav-logout-button" type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}