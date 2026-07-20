import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useMyMatches } from "./useMyMatches";
import {AppNav} from "../components/AppNav.tsx";

export function MatchesPage() {
    const { matches, isLoading, errorMessage } = useMyMatches();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />
            <AppNav/>
            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">My matches</span>

                    <h1 className="dashboard-hero-title">
                        Your cats have chemistry 😻
                    </h1>

                    <p className="dashboard-hero-copy">
                        These are the cats that liked your cats back. Later we can add
                        chat, match status and profile details.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading your matches...
                        </p>
                    )}

                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    {!isLoading && !errorMessage && matches.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No matches yet</span>
                                <h2>No mutual likes for now.</h2>
                                <p>
                                    Go to Discover, like some cats and wait for them to like
                                    your cats back.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && matches.length > 0 && (
                        <div className="quick-grid">
                            {matches.map((match) => (
                                <article
                                    className="quick-card quick-card-wild"
                                    key={`${match.myCatProfileId}-${match.matchedCatProfileId}`}
                                >
                                    <span>😻</span>

                                    <h3>
                                        {match.myCatName} + {match.matchedCatName}
                                    </h3>

                                    <p>
                                        <strong>{match.myCatName}</strong> matched with{" "}
                                        <strong>{match.matchedCatName}</strong>
                                    </p>

                                    <p>
                                        {match.matchedCatBreed || "Unknown breed"}
                                    </p>

                                    <p>
                                        {match.matchedCatBio || "No bio yet. Still mysterious."}
                                    </p>

                                    <p>
                                        Location:{" "}
                                        <strong>
                                            {formatLocation(
                                                match.matchedCatCity,
                                                match.matchedCatCountry
                                            )}
                                        </strong>
                                    </p>

                                    <p className="tiny-note">
                                        Matched at: {formatDate(match.matchedAt)}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function formatLocation(city: string | null, country: string | null): string {
    if (city && country) {
        return `${city}, ${country}`;
    }

    if (city) {
        return city;
    }

    if (country) {
        return country;
    }

    return "Unknown location";
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString();
}