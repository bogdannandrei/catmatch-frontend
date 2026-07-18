import { API_ROUTES } from "./apiRoutes";
import { httpClient } from "./httpClient";

export type CatGender = "MALE" | "FEMALE" | "UNKNOWN";

export type CatProfileStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export type CatProfileResponse = {
    id: number;
    ownerId: number;
    name: string;
    breed: string | null;
    gender: CatGender;
    birthDate: string | null;
    bio: string | null;
    city: string | null;
    country: string | null;
    profilePhotoUrl: string | null;
    status: CatProfileStatus;
    createdAt: string;
    updatedAt: string;
};

export type CreateCatProfileRequest = {
    name: string;
    breed: string | null;
    gender: CatGender;
    birthDate: string | null;
    bio: string | null;
    city: string | null;
    country: string | null;
    profilePhotoUrl: string | null;
};

export type UpdateCatProfileRequest = {
    name: string;
    breed: string | null;
    gender: CatGender;
    birthDate: string | null;
    bio: string | null;
    city: string | null;
    country: string | null;
    profilePhotoUrl: string | null;
};

export async function getMyCatProfiles(): Promise<CatProfileResponse[]> {
    const response = await httpClient.get<CatProfileResponse[]>(
        API_ROUTES.catProfiles.my
    );

    return response.data;
}

export async function getCatProfile(catProfileId: number): Promise<CatProfileResponse> {
    const response = await httpClient.get<CatProfileResponse>(
        API_ROUTES.catProfiles.byId(catProfileId)
    );

    return response.data;
}

export async function createCatProfile(
    request: CreateCatProfileRequest
): Promise<CatProfileResponse> {
    const response = await httpClient.post<CatProfileResponse>(
        API_ROUTES.catProfiles.base,
        request
    );

    return response.data;
}

export async function updateCatProfile(
    catProfileId: number,
    request: UpdateCatProfileRequest
): Promise<CatProfileResponse> {
    const response = await httpClient.put<CatProfileResponse>(
        API_ROUTES.catProfiles.byId(catProfileId),
        request
    );

    return response.data;
}

export async function deleteCatProfile(catProfileId: number): Promise<void> {
    await httpClient.delete(API_ROUTES.catProfiles.byId(catProfileId));
}