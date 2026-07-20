import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyMatches,
    type CatMatchResponse,
} from "../api/catMatchesApi";
import { createChatConversation } from "../api/chatApi";

export function useMyMatches() {
    const navigate = useNavigate();

    const [matches, setMatches] = useState<CatMatchResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [startingChatMatchId, setStartingChatMatchId] = useState<number | null>(null);

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

    async function handleStartChat(catMatchId: number) {
        try {
            setStartingChatMatchId(catMatchId);
            setErrorMessage(null);

            const conversation = await createChatConversation({
                catMatchId,
            });

            navigate(`/chats/${conversation.id}`);
        } catch (error) {
            console.error("Failed to start chat:", error);
            setErrorMessage("Could not start chat.");
        } finally {
            setStartingChatMatchId(null);
        }
    }

    return {
        matches,
        isLoading,
        errorMessage,
        startingChatMatchId,
        handleStartChat,
    };
}