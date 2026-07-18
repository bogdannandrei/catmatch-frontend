import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    saveAuthSession,
} from "../auth/authStorage";

const BASE_URL = "http://localhost:8080";

type RefreshAuthResponse = {
    user: {
        id: number;
        email: string;
        username: string;
        displayName: string;
        role: string;
        status: string;
        emailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
    tokenType: string;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

export const httpClient = axios.create({
    baseURL: BASE_URL,
});

httpClient.interceptors.request.use((config) => {
    const accessToken = getAccessToken();

    if (accessToken && !config.headers.Authorization && !isAuthEndpoint(config.url)) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

httpClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequestConfig | undefined;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthEndpoint(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            clearAuthSession();
            return Promise.reject(error);
        }

        try {
            originalRequest._retry = true;

            const refreshResponse = await axios.post<RefreshAuthResponse>(
                `${BASE_URL}/api/auth/refresh`,
                {
                    refreshToken,
                }
            );

            saveAuthSession(
                refreshResponse.data.accessToken,
                refreshResponse.data.refreshToken,
                refreshResponse.data.user
            );

            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

            return httpClient(originalRequest);
        } catch (refreshError) {
            clearAuthSession();
            return Promise.reject(refreshError);
        }
    }
);

function isAuthEndpoint(url?: string): boolean {
    if (!url) {
        return false;
    }

    return (
        url.includes("/api/auth/login") ||
        url.includes("/api/auth/register") ||
        url.includes("/api/auth/refresh") ||
        url.includes("/api/auth/logout")
    );
}