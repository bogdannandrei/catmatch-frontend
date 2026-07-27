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

export type DiscoverCatProfilesFilters = {
    city?: string;
    country?: string;
    breed?: string;
    gender?: CatGender | "";
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

export async function discoverCatProfiles(
    swiperCatProfileId: number,
    limit = 20,
    filters: DiscoverCatProfilesFilters = {}
): Promise<CatProfileResponse[]> {
    const params: Record<string, string | number> = {
        swiperCatProfileId,
        limit,
    };

    if (filters.city?.trim()) {
        params.city = filters.city.trim();
    }

    if (filters.country?.trim()) {
        params.country = filters.country.trim();
    }

    if (filters.breed?.trim()) {
        params.breed = filters.breed.trim();
    }

    if (filters.gender) {
        params.gender = filters.gender;
    }

    const response = await httpClient.get<CatProfileResponse[]>(
        API_ROUTES.catProfiles.discover,
        {
            params,
        }
    );

    return response.data;
}

export async function uploadCatProfilePhoto(
    catProfileId: number,
    photo: File
): Promise<CatProfileResponse> {
    const formData = new FormData();

    formData.append("photo", photo);

    const response = await httpClient.post<CatProfileResponse>(
        API_ROUTES.catProfiles.photo(catProfileId),
        formData
    );

    return response.data;
}