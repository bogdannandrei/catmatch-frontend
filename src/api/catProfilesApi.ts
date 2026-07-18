import { getAccessToken } from "../auth/authStorage";
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

export async function getMyCatProfiles(): Promise<CatProfileResponse[]> {
    const accessToken = getAccessToken();

    const response = await httpClient.get<CatProfileResponse[]>(
        API_ROUTES.catProfiles.my,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return response.data;
}