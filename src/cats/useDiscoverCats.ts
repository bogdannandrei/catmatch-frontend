import { useEffect, useState } from "react";
import {
    discoverCatProfiles,
    type CatProfileResponse,
} from "../api/catProfilesApi";

export function useDiscoverCats() {
    const [cats, setCats] = useState<CatProfileResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadDiscoverCats() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const discoverableCats = await discoverCatProfiles();

                setCats(discoverableCats);
            } catch (error) {
                console.error("Failed to load discover cats:", error);
                setErrorMessage("Could not load discover cats.");
            } finally {
                setIsLoading(false);
            }
        }

        loadDiscoverCats();
    }, []);

    return {
        cats,
        isLoading,
        errorMessage,
    };
}