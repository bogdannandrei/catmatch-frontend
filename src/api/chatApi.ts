import { API_ROUTES } from "./apiRoutes";
import { httpClient } from "./httpClient";

export type ChatConversationResponse = {
    id: number;
    catMatchId: number;

    myUserId: number;
    myUsername: string;
    myDisplayName: string | null;

    otherUserId: number;
    otherUsername: string;
    otherDisplayName: string | null;

    myCatProfileId: number;
    myCatName: string;

    otherCatProfileId: number;
    otherCatName: string;
    otherCatProfilePhotoUrl: string | null;

    createdAt: string;
    updatedAt: string;
};

export type ChatMessageResponse = {
    id: number;
    conversationId: number;
    senderUserId: number;
    senderUsername: string;
    senderDisplayName: string | null;
    body: string;
    createdAt: string;
};

export type CreateChatConversationRequest = {
    catMatchId: number;
};

export type CreateChatMessageRequest = {
    body: string;
};

export async function createChatConversation(
    request: CreateChatConversationRequest
): Promise<ChatConversationResponse> {
    const response = await httpClient.post<ChatConversationResponse>(
        API_ROUTES.chats.base,
        request
    );

    return response.data;
}

export async function getMyChatConversations(): Promise<ChatConversationResponse[]> {
    const response = await httpClient.get<ChatConversationResponse[]>(
        API_ROUTES.chats.my
    );

    return response.data;
}

export async function getChatMessages(conversationId: number): Promise<ChatMessageResponse[]> {
    const response = await httpClient.get<ChatMessageResponse[]>(
        API_ROUTES.chats.messages(conversationId)
    );

    return response.data;
}

export async function sendChatMessage(
    conversationId: number,
    request: CreateChatMessageRequest
): Promise<ChatMessageResponse> {
    const response = await httpClient.post<ChatMessageResponse>(
        API_ROUTES.chats.messages(conversationId),
        request
    );

    return response.data;
}