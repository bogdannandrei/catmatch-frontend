import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    type CatGender,
    getCatProfile,
    type UpdateCatProfileRequest,
    updateCatProfile,
} from "../api/catProfilesApi";

export function useEditCat() {
    const navigate = useNavigate();
    const { id } = useParams();

    const catProfileId = Number(id);

    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState<CatGender>("UNKNOWN");
    const [birthDate, setBirthDate] = useState("");
    const [bio, setBio] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadCatProfile() {
            if (!catProfileId || Number.isNaN(catProfileId)) {
                setErrorMessage("Invalid cat profile id.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);

                const catProfile = await getCatProfile(catProfileId);

                setName(catProfile.name);
                setBreed(catProfile.breed || "");
                setGender(catProfile.gender);
                setBirthDate(catProfile.birthDate || "");
                setBio(catProfile.bio || "");
                setCity(catProfile.city || "");
                setCountry(catProfile.country || "");
                setProfilePhotoUrl(catProfile.profilePhotoUrl || "");
            } catch (error) {
                console.error("Failed to load cat profile:", error);
                setErrorMessage("Could not load cat profile.");
            } finally {
                setIsLoading(false);
            }
        }

        loadCatProfile();
    }, [catProfileId]);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!catProfileId || Number.isNaN(catProfileId)) {
            setErrorMessage("Invalid cat profile id.");
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage(null);

            const request: UpdateCatProfileRequest = {
                name: name.trim(),
                breed: trimOrNull(breed),
                gender,
                birthDate: trimOrNull(birthDate),
                bio: trimOrNull(bio),
                city: trimOrNull(city),
                country: trimOrNull(country),
                profilePhotoUrl: trimOrNull(profilePhotoUrl),
            };

            await updateCatProfile(catProfileId, request);

            navigate("/my-cats");
        } catch (error) {
            console.error("Failed to update cat profile:", error);
            setErrorMessage("Could not update cat profile.");
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        navigate("/my-cats");
    }

    return {
        name,
        setName,
        breed,
        setBreed,
        gender,
        setGender,
        birthDate,
        setBirthDate,
        bio,
        setBio,
        city,
        setCity,
        country,
        setCountry,
        profilePhotoUrl,
        setProfilePhotoUrl,
        isLoading,
        isSaving,
        errorMessage,
        handleSubmit,
        handleCancel,
    };
}

function trimOrNull(value: string): string | null {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
        return null;
    }

    return trimmedValue;
}