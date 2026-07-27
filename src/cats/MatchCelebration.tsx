import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CatProfileResponse } from "../api/catProfilesApi";

type MatchCelebrationProps = {
    myCat: CatProfileResponse | null;
    matchedCat: CatProfileResponse | null;
    onClose: () => void;
};

export function MatchCelebration({
                                     myCat,
                                     matchedCat,
                                     onClose,
                                 }: MatchCelebrationProps) {
    const navigate = useNavigate();

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    if (!matchedCat) {
        return null;
    }

    function handleViewMatches() {
        onClose();
        navigate("/matches");
    }

    return (
        <div className="match-celebration-overlay" role="dialog" aria-modal="true">
            <div className="match-confetti-layer" aria-hidden="true">
                <span className="match-confetti confetti-one">💖</span>
                <span className="match-confetti confetti-two">🐾</span>
                <span className="match-confetti confetti-three">✨</span>
                <span className="match-confetti confetti-four">😻</span>
                <span className="match-confetti confetti-five">💘</span>
                <span className="match-confetti confetti-six">🐾</span>
            </div>

            <section className="match-celebration-card">
                <button
                    className="match-close-button"
                    type="button"
                    onClick={onClose}
                    aria-label="Close match celebration"
                >
                    ×
                </button>

                <span className="section-kicker">New match</span>

                <h1 className="match-celebration-title">
                    It&apos;s a match!
                </h1>

                <p className="match-celebration-copy">
                    {myCat ? (
                        <>
                            <strong>{myCat.name}</strong> and{" "}
                            <strong>{matchedCat.name}</strong> liked each other back.
                        </>
                    ) : (
                        <>
                            You matched with <strong>{matchedCat.name}</strong>.
                        </>
                    )}
                </p>

                <div className="match-portrait-row">
                    <MatchPortrait cat={myCat} fallbackLabel="Your cat" />
                    <div className="match-heart-core">♥</div>
                    <MatchPortrait cat={matchedCat} fallbackLabel="Matched cat" />
                </div>

                <div className="match-details-pill">
                    <span>{matchedCat.breed || "Unknown breed"}</span>
                    <span>{formatLocation(matchedCat.city, matchedCat.country)}</span>
                </div>

                <div className="match-action-row">
                    <button
                        className="secondary-button"
                        type="button"
                        onClick={onClose}
                    >
                        Keep swiping
                    </button>

                    <button
                        className="primary-button magic-button"
                        type="button"
                        onClick={handleViewMatches}
                    >
                        View matches
                    </button>
                </div>
            </section>
        </div>
    );
}

type MatchPortraitProps = {
    cat: CatProfileResponse | null;
    fallbackLabel: string;
};

function MatchPortrait({ cat, fallbackLabel }: MatchPortraitProps) {
    return (
        <div className="match-portrait-card">
            <div className="match-portrait-image">
                {cat?.profilePhotoUrl ? (
                    <img src={cat.profilePhotoUrl} alt={cat.name} />
                ) : (
                    <span>{cat ? getCatEmoji(cat.name) : "🐱"}</span>
                )}
            </div>

            <strong>{cat?.name || fallbackLabel}</strong>

            {cat?.breed && (
                <small>{cat.breed}</small>
            )}
        </div>
    );
}

function getCatEmoji(catName: string): string {
    const normalizedName = catName.toLowerCase();

    if (normalizedName.includes("mango")) {
        return "🐈";
    }

    if (normalizedName.includes("papaya")) {
        return "🐈‍⬛";
    }

    return "😺";
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