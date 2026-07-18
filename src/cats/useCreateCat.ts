import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createCatProfile,
    type CatGender,
    type CreateCatProfileRequest,
} from "../api/catProfilesApi";

export function useCreateCat() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [breed, setBreed] = useState("");
    const [gender, setGender] = useState<CatGender>("UNKNOWN");
    const [birthDate, setBirthDate] = useState("");
    const [bio, setBio] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const request: CreateCatProfileRequest = {
                name: name.trim(),
                breed: trimOrNull(breed),
                gender,
                birthDate: trimOrNull(birthDate),
                bio: trimOrNull(bio),
                city: trimOrNull(city),
                country: trimOrNull(country),
                profilePhotoUrl: trimOrNull(profilePhotoUrl),
            };

            await createCatProfile(request);

            navigate("/my-cats");
        } catch (error) {
            console.error("Failed to create cat profile:", error);
            setErrorMessage("Could not create cat profile.");
        } finally {
            setIsLoading(false);
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