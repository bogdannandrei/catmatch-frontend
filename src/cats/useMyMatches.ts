import { useEffect, useState } from "react";
import {
    getMyMatches,
    type CatMatchResponse,
} from "../api/catMatchesApi";

export function useMyMatches() {
    const [matches, setMatches] = useState<CatMatchResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadMatches() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const myMatches = await getMyMatches();

                setMatches(myMatches);
            } catch (error) {
                console.error("Failed to load matches:", error);
                setErrorMessage("Could not load your matches.");
            } finally {
                setIsLoading(false);
            }
        }

        loadMatches();
    }, []);

    return {
        matches,
        isLoading,
        errorMessage,
    };
}