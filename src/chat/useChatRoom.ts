import { type FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getChatMessages,
    getMyChatConversations,
    sendChatMessage,
    type ChatConversationResponse,
    type ChatMessageResponse,
} from "../api/chatApi";
import { getCurrentUser } from "../auth/authStorage";

export function useChatRoom() {
    const navigate = useNavigate();
    const { id } = useParams();

    const conversationId = Number(id);
    const currentUser = getCurrentUser();

    const [conversation, setConversation] = useState<ChatConversationResponse | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [messageBody, setMessageBody] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadChatRoom() {
            if (!conversationId || Number.isNaN(conversationId)) {
                setErrorMessage("Invalid conversation id.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setErrorMessage(null);

                const [myConversations, chatMessages] = await Promise.all([
                    getMyChatConversations(),
                    getChatMessages(conversationId),
                ]);

                const currentConversation = myConversations.find(
                    (item) => item.id === conversationId
                );

                setConversation(currentConversation || null);
                setMessages(chatMessages);
            } catch (error) {
                console.error("Failed to load chat room:", error);
                setErrorMessage("Could not load chat.");
            } finally {
                setIsLoading(false);
            }
        }

        loadChatRoom();
    }, [conversationId]);

    async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedMessage = messageBody.trim();

        if (!trimmedMessage) {
            return;
        }

        try {
            setIsSending(true);
            setErrorMessage(null);

            const sentMessage = await sendChatMessage(conversationId, {
                body: trimmedMessage,
            });

            setMessages((currentMessages) => [
                ...currentMessages,
                sentMessage,
            ]);

            setMessageBody("");
        } catch (error) {
            console.error("Failed to send message:", error);
            setErrorMessage("Could not send message.");
        } finally {
            setIsSending(false);
        }
    }

    function handleBackToChats() {
        navigate("/chats");
    }

    return {
        conversation,
        messages,
        messageBody,
        setMessageBody,
        currentUserId: currentUser?.id ?? null,
        isLoading,
        isSending,
        errorMessage,
        handleSendMessage,
        handleBackToChats,
    };
}