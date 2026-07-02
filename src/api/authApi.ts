import {httpClient} from "./httpClient.ts";
import { API_ROUTES } from "./apiRoutes";

export type UserResponse = {
    id: number;
    email: string;
    username: string;
    displayName: string;
    role: string;
    status: string;
    emailVerified: boolean;
};

export type AuthResponse = {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
};

export type LoginRequest = {
    identifier: string;
    password: string;
}

export type LogoutRequest = {
    refreshToken: string;
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>(
        API_ROUTES.auth.login,
        request
    );

    return response.data;
}

export async function getCurrentUser(accessToken: string): Promise<UserResponse> {
    const response = await httpClient.get<UserResponse>(API_ROUTES.users.me, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return response.data;
}

export async function logout(request: LogoutRequest): Promise<void> {
    await httpClient.post(API_ROUTES.auth.logout, request);
}