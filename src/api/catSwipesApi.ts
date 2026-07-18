import { API_ROUTES } from "./apiRoutes";
import { httpClient } from "./httpClient";

export type CatSwipeDecision = "LIKE" | "SKIP";

export type CreateCatSwipeRequest = {
    swiperCatProfileId: number;
    targetCatProfileId: number;
    decision: CatSwipeDecision;
};

export type CatSwipeResponse = {
    id: number;
    swiperCatProfileId: number;
    targetCatProfileId: number;
    decision: CatSwipeDecision;
    matched: boolean;
    createdAt: string;
    updatedAt: string;
};

export async function createCatSwipe(
    request: CreateCatSwipeRequest
): Promise<CatSwipeResponse> {
    const response = await httpClient.post<CatSwipeResponse>(
        API_ROUTES.catSwipes.base,
        request
    );

    return response.data;
}