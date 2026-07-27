import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getChatMessages,
    getMyChatConversations,
    sendChatMessage,
    type ChatConversationResponse,
    type ChatMessageResponse,
} from "../api/chatApi";
import { getCurrentUser } from "../auth/authStorage";

const CHAT_POLLING_INTERVAL_MS = 3000;

export function useChatRoom() {
    const navigate = useNavigate();
    const { id } = useParams();

    const conversationId = Number(id);
    const currentUser = getCurrentUser();

    const isRefreshingMessagesRef = useRef(false);

    const [conversation, setConversation] = useState<ChatConversationResponse | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [messageBody, setMessageBody] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isValidConversationId = Boolean(conversationId) && !Number.isNaN(conversationId);

    const refreshMessages = useCallback(async function refreshMessages(showPollingState: boolean) {
        if (!isValidConversationId || isRefreshingMessagesRef.current) {
            return;
        }

        try {
            isRefreshingMessagesRef.current = true;

            if (showPollingState) {
                setIsPolling(true);
            }

            const latestMessages = await getChatMessages(conversationId);

            setMessages((currentMessages) => {
                if (areMessagesEqual(currentMessages, latestMessages)) {
                    return currentMessages;
                }

                return latestMessages;
            });
        } catch (error) {
            console.error("Failed to refresh chat messages:", error);
        } finally {
            isRefreshingMessagesRef.current = false;

            if (showPollingState) {
                setIsPolling(false);
            }
        }
    }, [conversationId, isValidConversationId]);

    useEffect(() => {
        async function loadChatRoom() {
            if (!isValidConversationId) {
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

                if (!currentConversation) {
                    setConversation(null);
                    setErrorMessage("Conversation not found.");
                    return;
                }

                setConversation(currentConversation);
                setMessages(chatMessages);
            } catch (error) {
                console.error("Failed to load chat room:", error);
                setErrorMessage("Could not load chat.");
            } finally {
                setIsLoading(false);
            }
        }

        loadChatRoom();
    }, [conversationId, isValidConversationId]);

    useEffect(() => {
        if (isLoading || errorMessage || !isValidConversationId) {
            return;
        }

        const intervalId = window.setInterval(() => {
            refreshMessages(false);
        }, CHAT_POLLING_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [errorMessage, isLoading, isValidConversationId, refreshMessages]);

    async function handleSendMessage(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedMessage = messageBody.trim();

        if (!trimmedMessage || !isValidConversationId) {
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

            await refreshMessages(false);
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
        isPolling,
        errorMessage,
        handleSendMessage,
        handleBackToChats,
    };
}

function areMessagesEqual(
    currentMessages: ChatMessageResponse[],
    latestMessages: ChatMessageResponse[]
): boolean {
    if (currentMessages.length !== latestMessages.length) {
        return false;
    }

    return currentMessages.every((currentMessage, index) => {
        const latestMessage = latestMessages[index];

        return currentMessage.id === latestMessage.id
            && currentMessage.body === latestMessage.body
            && currentMessage.createdAt === latestMessage.createdAt;
    });
}