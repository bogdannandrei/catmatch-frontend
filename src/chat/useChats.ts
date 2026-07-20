import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getMyChatConversations,
    type ChatConversationResponse,
} from "../api/chatApi";

export function useChats() {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState<ChatConversationResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadConversations() {
            try {
                setIsLoading(true);
                setErrorMessage(null);

                const myConversations = await getMyChatConversations();

                setConversations(myConversations);
            } catch (error) {
                console.error("Failed to load conversations:", error);
                setErrorMessage("Could not load your chats.");
            } finally {
                setIsLoading(false);
            }
        }

        loadConversations();
    }, []);

    function handleOpenConversation(conversationId: number) {
        navigate(`/chats/${conversationId}`);
    }

    return {
        conversations,
        isLoading,
        errorMessage,
        handleOpenConversation,
    };
}