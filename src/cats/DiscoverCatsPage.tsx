import {BrandBanner} from "../components/BrandBanner";
import {FloatingPaws} from "../components/FloatingPaws";
import {useDiscoverCats} from "./useDiscoverCats";
import {AppNav} from "../components/AppNav.tsx";
import {DiscoverCatDeck} from "./DiscoverCatDeck";
import { MatchCelebration } from "./MatchCelebration";

export function DiscoverCatsPage() {
    const {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,
        isLoading,
        isLoadingDiscover,
        isRefilling,
        errorMessage,
        swipingCatId,
        matchMessage,
        matchedCat,
        lastSwipe,
        isUndoing,
        handleSwipe,
        handleUndoLastSwipe,
        handleCloseMatchAnimation,
    } = useDiscoverCats();

    const selectedSwiperCat = myCats.find(
        (cat) => cat.id === selectedSwiperCatId
    ) || null;

    return (
        <main className="app-page explosive-page">
            <FloatingPaws/>
            <AppNav/>
            <div className="dashboard-shell">
                <BrandBanner variant="compact"/>

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">Discover</span>

                    <h1 className="dashboard-hero-title">
                        Meet the cats waiting for their perfect match 😻
                    </h1>

                    <p className="dashboard-hero-copy">
                        Choose one of your cats, then like or skip cats from other users.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading discover cats...
                        </p>
                    )}

                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    {matchMessage && (
                        <p className="success-message">
                            {matchMessage}
                        </p>
                    )}

                    {!isLoading && myCats.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No cat selected</span>
                                <h2>You need at least one cat profile first.</h2>
                                <p>
                                    Create one of your cats before using Discover.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && myCats.length > 0 && (
                        <div className="mission-card discover-selector-card">
                            <div>
                                <span className="mission-label">Swiping as</span>
                                <h2>Choose your cat profile</h2>
                                <p>
                                    Likes and skips are made from one cat profile to another.
                                </p>
                            </div>

                            {lastSwipe && (
                                <div className="undo-swipe-card">
                                    <div>
                                        <span className="mission-label">Last swipe</span>
                                        <p>
                                            You {lastSwipe.decision === "LIKE" ? "liked" : "skipped"}{" "}
                                            <strong>{lastSwipe.targetCat.name}</strong>
                                        </p>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        type="button"
                                        onClick={handleUndoLastSwipe}
                                        disabled={isUndoing}
                                    >
                                        {isUndoing ? "Undoing..." : "Undo"}
                                    </button>
                                </div>
                            )}

                            <div className="form-field discover-select-field">
                                <select
                                    value={selectedSwiperCatId ?? ""}
                                    onChange={(event) => setSelectedSwiperCatId(Number(event.target.value))}
                                >
                                    {myCats.map((cat) => (
                                        <option value={cat.id} key={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {isLoadingDiscover && (
                        <p className="tiny-note">
                            Refreshing discover feed...
                        </p>
                    )}
                    {isRefilling && (
                        <p className="tiny-note">
                            Adding more cats to your deck...
                        </p>
                    )}

                    {!isLoading && !isLoadingDiscover && !errorMessage && cats.length === 0 && myCats.length > 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No cats found</span>
                                <h2>The discovery feed is quiet right now.</h2>
                                <p>
                                    There are no more cats available for the selected cat profile.
                                    Try selecting another one of your cats.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !isLoadingDiscover && cats.length > 0 && (
                        <DiscoverCatDeck
                            cats={cats}
                            swipingCatId={swipingCatId}
                            selectedSwiperCatId={selectedSwiperCatId}
                            onSwipe={handleSwipe}
                        />
                    )}
                </section>
            </div>

            <MatchCelebration
                myCat={selectedSwiperCat}
                matchedCat={matchedCat}
                onClose={handleCloseMatchAnimation}
            />
        </main>
    );
}