const API_PREFIX = "/api";

export const API_ROUTES = {
    auth: {
        login: `${API_PREFIX}/auth/login`,
        register: `${API_PREFIX}/auth/register`,
        refresh: `${API_PREFIX}/auth/refresh`,
        logout: `${API_PREFIX}/auth/logout`,
    },

    users: {
        me: `${API_PREFIX}/users/me`,
    },

    catProfiles: {
        base: `${API_PREFIX}/cat-profiles`,
        my: `${API_PREFIX}/cat-profiles/my`,
        byId: (id: number) => `${API_PREFIX}/cat-profiles/${id}`,
    },
} as const;