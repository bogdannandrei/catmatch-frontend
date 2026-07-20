import { API_ROUTES } from "./apiRoutes";
import { httpClient } from "./httpClient";

export type CatMatchStatus = "ACTIVE" | "UNMATCHED";

export type CatMatchResponse = {
    id: number;

    myCatProfileId: number;
    myCatName: string;
    myCatBreed: string | null;
    myCatProfilePhotoUrl: string | null;

    matchedCatProfileId: number;
    matchedCatName: string;
    matchedCatBreed: string | null;
    matchedCatBio: string | null;
    matchedCatCity: string | null;
    matchedCatCountry: string | null;
    matchedCatProfilePhotoUrl: string | null;

    status: CatMatchStatus;
    matchedAt: string;
    createdAt: string;
    updatedAt: string;
};

export async function getMyMatches(): Promise<CatMatchResponse[]> {
    const response = await httpClient.get<CatMatchResponse[]>(
        API_ROUTES.catMatches.my
    );

    return response.data;
}