import { useEffect, useRef } from "react";
import { AppNav } from "../components/AppNav";
import { FloatingPaws } from "../components/FloatingPaws";
import { useChatRoom } from "./useChatRoom";

export function ChatRoomPage() {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const {
        conversation,
        messages,
        messageBody,
        setMessageBody,
        currentUserId,
        isLoading,
        isSending,
        isPolling,
        errorMessage,
        handleSendMessage,
        handleBackToChats,
    } = useChatRoom();

    useEffect(() => {
        if (!isLoading) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }, [messages.length, isLoading]);

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />
            <AppNav />

            <div className="chat-shell">
                <section className="chat-room-card">
                    <div className="chat-room-header">
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={handleBackToChats}
                        >
                            ← Chats
                        </button>

                        <div>
                            <span className="section-kicker">Chat</span>

                            <h1>
                                {conversation
                                    ? `${conversation.myCatName} + ${conversation.otherCatName}`
                                    : "Conversation"}
                            </h1>

                            {conversation && (
                                <p>
                                    Talking with{" "}
                                    <strong>
                                        {conversation.otherDisplayName || conversation.otherUsername}
                                    </strong>
                                </p>
                            )}
                            {isPolling && (
                                <p className="tiny-note">
                                    Checking for new messages...
                                </p>
                            )}
                        </div>
                    </div>

                    {isLoading && (
                        <div className="chat-messages">
                            <p className="tiny-note">
                                Loading messages...
                            </p>
                        </div>
                    )}

                    {!isLoading && (
                        <>
                            <div className="chat-messages">
                                {errorMessage && (
                                    <p className="error-message">
                                        {errorMessage}
                                    </p>
                                )}

                                {messages.length === 0 && !errorMessage && (
                                    <div className="chat-empty-state">
                                        <span>💬</span>
                                        <h2>No messages yet</h2>
                                        <p>Send the first message and break the ice.</p>
                                    </div>
                                )}

                                {messages.map((message) => {
                                    const isMine = message.senderUserId === currentUserId;

                                    return (
                                        <article
                                            className={`chat-message ${isMine ? "chat-message-mine" : "chat-message-other"}`}
                                            key={message.id}
                                        >
                                            <div>
                                                <strong>
                                                    {message.senderDisplayName || message.senderUsername}
                                                </strong>

                                                <p>{message.body}</p>

                                                <small>{formatDate(message.createdAt)}</small>
                                            </div>
                                        </article>
                                    );
                                })}

                                <div ref={messagesEndRef} className="chat-messages-end" />
                            </div>

                            <form className="chat-input-bar" onSubmit={handleSendMessage}>
                                <input
                                    value={messageBody}
                                    onChange={(event) => setMessageBody(event.target.value)}
                                    placeholder="Write a message..."
                                    maxLength={1000}
                                />

                                <button
                                    className="primary-button magic-button"
                                    type="submit"
                                    disabled={isSending || !messageBody.trim()}
                                >
                                    {isSending ? "Sending..." : "Send"}
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString();
}