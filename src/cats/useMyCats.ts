import { useEffect, useState } from "react";
import {
    deleteCatProfile,
    type CatProfileResponse,
    getMyCatProfiles,
} from "../api/catProfilesApi";

export function useMyCats() {
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deletedCatId, setDeletedCatId] = useState<number | null>(null);

    useEffect(() => {
        async function loadCats() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const catProfiles = await getMyCatProfiles();

                setCats(catProfiles);
            } catch (error) {
                console.error("Failed to load cat profiles:", error);
                setErrorMessage("Could not load your cats.");
            } finally {
                setIsLoading(false);
            }
        }

        loadCats();
    }, []);

    async function handleDeleteCat(catProfileId: number) {
        const confirmed = window.confirm("Are you sure you want to delete this cat profile?");

        if (!confirmed) {
            return;
        }

        try {
            setDeletedCatId(catProfileId);
            setErrorMessage(null);

            await deleteCatProfile(catProfileId);

            setCats((currentCats) =>
                currentCats.filter((cat) => cat.id !== catProfileId)
            );
        } catch (error) {
            console.error("Failed to delete cat profile:", error);
            setErrorMessage("Could not delete cat profile.");
        } finally {
            setDeletedCatId(null);
        }
    }

    return {
        cats,
        isLoading,
        errorMessage,
        deletedCatId,
        handleDeleteCat,
    };
}