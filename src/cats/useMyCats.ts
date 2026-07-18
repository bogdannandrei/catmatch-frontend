import { useEffect, useState } from "react";
import {
    type CatProfileResponse,
    getMyCatProfiles,
} from "../api/catProfilesApi";

export function useMyCats() {
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

    return {
        cats,
        isLoading,
        errorMessage,
    };
}