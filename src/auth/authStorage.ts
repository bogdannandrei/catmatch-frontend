import type { UserResponse } from "../api/authApi";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const CURRENT_USER_KEY = "currentUser";

export function saveAuthSession(accessToken: string, refreshToken: string, currentUser: UserResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
}

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getCurrentUser(): UserResponse | null {
    const currentUserRaw = localStorage.getItem(CURRENT_USER_KEY);

    if (!currentUserRaw) {
        return null;
    }

    return JSON.parse(currentUserRaw) as UserResponse;
}

export function clearAuthSession() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function isLoggedIn(): boolean {
    return getAccessToken() !== null;
}