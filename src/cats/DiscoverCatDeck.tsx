import { useState, type PointerEvent } from "react";
import type { CatProfileResponse } from "../api/catProfilesApi";
import type { CatSwipeDecision } from "../api/catSwipesApi";

type DiscoverCatDeckProps = {
    cats: CatProfileResponse[];
    swipingCatId: number | null;
    selectedSwiperCatId: number | null;
    onSwipe: (targetCatProfileId: number, decision: CatSwipeDecision) => Promise<void>;
};

const SWIPE_THRESHOLD = 120;
const EXIT_ANIMATION_MS = 280;

export function DiscoverCatDeck({
                                    cats,
                                    swipingCatId,
                                    selectedSwiperCatId,
                                    onSwipe,
                                }: DiscoverCatDeckProps) {
    const [dragStartX, setDragStartX] = useState<number | null>(null);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [exitDirection, setExitDirection] = useState<CatSwipeDecision | null>(null);

    const currentCat = cats[0];
    const previewCats = cats.slice(1, 4);

    if (!currentCat) {
        return null;
    }

    const isSaving = swipingCatId === currentCat.id;
    const isDisabled = isSaving || !selectedSwiperCatId || exitDirection !== null;

    function handlePointerDown(event: PointerEvent<HTMLElement>) {
        if (isDisabled) {
            return;
        }

        setDragStartX(event.clientX);
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function handlePointerMove(event: PointerEvent<HTMLElement>) {
        if (dragStartX === null || isDisabled) {
            return;
        }

        setDragOffsetX(event.clientX - dragStartX);
    }

    async function handlePointerUp() {
        if (dragStartX === null || isDisabled) {
            resetDrag();
            return;
        }

        if (dragOffsetX > SWIPE_THRESHOLD) {
            await swipeWithAnimation("LIKE");
            return;
        }

        if (dragOffsetX < -SWIPE_THRESHOLD) {
            await swipeWithAnimation("SKIP");
            return;
        }

        resetDrag();
    }

    async function handleButtonSwipe(decision: CatSwipeDecision) {
        if (isDisabled) {
            return;
        }

        await swipeWithAnimation(decision);
    }

    async function swipeWithAnimation(decision: CatSwipeDecision) {
        setExitDirection(decision);

        await wait(EXIT_ANIMATION_MS);

        resetDrag();
        setExitDirection(null);

        await onSwipe(currentCat.id, decision);
    }

    function resetDrag() {
        setDragStartX(null);
        setDragOffsetX(0);
    }

    const exitOffset = exitDirection === "LIKE" ? 980 : exitDirection === "SKIP" ? -980 : 0;
    const cardOffset = exitDirection ? exitOffset : dragOffsetX;
    const rotation = exitDirection
        ? exitDirection === "LIKE" ? 24 : -24
        : dragOffsetX / 18;

    const likeOpacity = exitDirection === "LIKE"
        ? 1
        : Math.min(Math.max(dragOffsetX / SWIPE_THRESHOLD, 0), 1);

    const skipOpacity = exitDirection === "SKIP"
        ? 1
        : Math.min(Math.max(-dragOffsetX / SWIPE_THRESHOLD, 0), 1);

    return (
        <section className="swipe-stage">
            <div className="swipe-hint-row">
                <span>← Skip</span>
                <strong>Drag the card or use the buttons</strong>
                <span>Like →</span>
            </div>

            <div className="swipe-deck-shell">
                {previewCats.map((cat, index) => (
                    <article
                        className="swipe-preview-card"
                        key={cat.id}
                        style={{
                            transform: `translateY(${(index + 1) * 18}px) scale(${1 - (index + 1) * 0.045})`,
                            opacity: 1 - index * 0.18,
                            zIndex: 3 - index,
                        }}
                    >
                        <div className="swipe-preview-portrait">
                            {cat.profilePhotoUrl ? (
                                <img src={cat.profilePhotoUrl} alt={cat.name} />
                            ) : (
                                <span>{getCatEmoji(cat.name)}</span>
                            )}
                        </div>

                        <div className="swipe-preview-content">
                            <strong>{cat.name}</strong>
                            <small>{cat.breed || "Unknown breed"}</small>
                        </div>
                    </article>
                ))}

                <article
                    className={[
                        "swipe-card",
                        dragStartX !== null ? "is-dragging" : "",
                        exitDirection ? "is-exiting" : "",
                    ].join(" ")}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={resetDrag}
                    style={{
                        transform: `translateX(${cardOffset}px) rotate(${rotation}deg)`,
                        opacity: exitDirection ? 0.72 : 1,
                    }}
                >
                    <div className="swipe-decision-badge swipe-decision-skip" style={{ opacity: skipOpacity }}>
                        SKIP
                    </div>

                    <div className="swipe-decision-badge swipe-decision-like" style={{ opacity: likeOpacity }}>
                        LIKE
                    </div>

                    <div className="swipe-card-portrait">
                        {currentCat.profilePhotoUrl ? (
                            <img src={currentCat.profilePhotoUrl} alt={currentCat.name} />
                        ) : (
                            <span>{getCatEmoji(currentCat.name)}</span>
                        )}
                    </div>

                    <div className="swipe-card-content">
                        <div>
                            <span className="section-kicker">Potential match</span>

                            <h2>{currentCat.name}</h2>

                            <p className="swipe-card-breed">
                                {currentCat.breed || "Unknown breed"}
                            </p>
                        </div>

                        <p className="swipe-card-bio">
                            {currentCat.bio || "No bio yet. Still mysterious enough to be interesting."}
                        </p>

                        <div className="swipe-chip-row">
                            <span>{formatLocation(currentCat.city, currentCat.country)}</span>
                            <span>{currentCat.gender}</span>
                            <span>{currentCat.status}</span>
                        </div>

                        <div
                            className="swipe-action-row"
                            onPointerDown={(event) => event.stopPropagation()}
                        >
                            <button
                                className="swipe-action-button swipe-action-skip"
                                type="button"
                                onClick={() => handleButtonSwipe("SKIP")}
                                disabled={isDisabled}
                            >
                                ✕
                            </button>

                            <button
                                className="swipe-action-button swipe-action-like"
                                type="button"
                                onClick={() => handleButtonSwipe("LIKE")}
                                disabled={isDisabled}
                            >
                                ♥
                            </button>
                        </div>

                        {isSaving && (
                            <p className="tiny-note">
                                Saving your swipe...
                            </p>
                        )}
                    </div>
                </article>
            </div>
        </section>
    );
}

function getCatEmoji(catName: string): string {
    if (catName.toLowerCase() === "mango") {
        return "🐈";
    }

    if (catName.toLowerCase() === "papaya") {
        return "🐈‍⬛";
    }

    return "🐾";
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

function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });
}