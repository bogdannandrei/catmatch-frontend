import { AppNav } from "../components/AppNav";
import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useChats } from "./useChats";

export function ChatsPage() {
    const {
        conversations,
        isLoading,
        errorMessage,
        handleOpenConversation,
    } = useChats();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />
            <AppNav />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">Chats</span>

                    <h1 className="dashboard-hero-title">
                        Conversations started from real matches 💬
                    </h1>

                    <p className="dashboard-hero-copy">
                        Chat with owners whose cats matched with yours.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading chats...
                        </p>
                    )}

                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    {!isLoading && !errorMessage && conversations.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No chats yet</span>
                                <h2>Your inbox is still quiet.</h2>
                                <p>
                                    Start a chat from one of your matches.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && conversations.length > 0 && (
                        <div className="chat-list">
                            {conversations.map((conversation) => (
                                <button
                                    className="chat-list-item"
                                    type="button"
                                    key={conversation.id}
                                    onClick={() => handleOpenConversation(conversation.id)}
                                >
                                    <div className="chat-avatar">
                                        {conversation.otherCatProfilePhotoUrl ? (
                                            <img
                                                src={conversation.otherCatProfilePhotoUrl}
                                                alt={conversation.otherCatName}
                                            />
                                        ) : (
                                            <span>😺</span>
                                        )}
                                    </div>

                                    <div>
                                        <strong>
                                            {conversation.otherDisplayName || conversation.otherUsername}
                                        </strong>

                                        <p>
                                            {conversation.myCatName} matched with {conversation.otherCatName}
                                        </p>

                                        <small>
                                            Updated at {formatDate(conversation.updatedAt)}
                                        </small>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString();
}