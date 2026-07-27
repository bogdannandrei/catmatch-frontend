import { AppNav } from "../components/AppNav";
import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { DiscoverCatDeck } from "./DiscoverCatDeck";
import { MatchCelebration } from "./MatchCelebration";
import { useDiscoverCats } from "./useDiscoverCats";

export function DiscoverCatsPage() {
    const {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,

        filterForm,
        updateFilter,
        handleApplyFilters,
        handleClearFilters,
        hasActiveFilters,

        isLoading,
        isLoadingDiscover,
        isRefilling,
        errorMessage,
        swipingCatId,
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
            <FloatingPaws />
            <AppNav />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">Discover</span>

                    <h1 className="dashboard-hero-title">
                        Find the next chaotic cat connection
                    </h1>

                    <p className="dashboard-hero-copy">
                        Choose which of your cats is swiping, filter the deck and like
                        or skip potential matches.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading your cats...
                        </p>
                    )}

                    {errorMessage && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    {!isLoading && myCats.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No cats yet</span>

                                <h2>You need a cat profile first.</h2>

                                <p>
                                    Create at least one cat profile before using Discover.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && myCats.length > 0 && (
                        <>
                            <div className="mission-card">
                                <div>
                                    <span className="mission-label">Swiping as</span>

                                    <h2>
                                        Choose your cat
                                    </h2>

                                    <p>
                                        Likes and skips will be saved for the selected cat.
                                    </p>
                                </div>

                                <select
                                    className="pretty-select"
                                    value={selectedSwiperCatId || ""}
                                    onChange={(event) =>
                                        setSelectedSwiperCatId(Number(event.target.value))
                                    }
                                >
                                    {myCats.map((cat) => (
                                        <option value={cat.id} key={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <form
                                className="discover-filter-panel"
                                onSubmit={handleApplyFilters}
                            >
                                <div>
                                    <span className="section-kicker">Filters</span>

                                    <h2>
                                        Refine discover
                                    </h2>

                                    <p>
                                        Narrow the deck by location, breed or gender.
                                    </p>
                                </div>

                                <div className="discover-filter-grid">
                                    <label>
                                        City
                                        <input
                                            value={filterForm.city}
                                            onChange={(event) =>
                                                updateFilter("city", event.target.value)
                                            }
                                            placeholder="Bucharest"
                                        />
                                    </label>

                                    <label>
                                        Country
                                        <input
                                            value={filterForm.country}
                                            onChange={(event) =>
                                                updateFilter("country", event.target.value)
                                            }
                                            placeholder="Romania"
                                        />
                                    </label>

                                    <label>
                                        Breed
                                        <input
                                            value={filterForm.breed}
                                            onChange={(event) =>
                                                updateFilter("breed", event.target.value)
                                            }
                                            placeholder="British, Ragdoll..."
                                        />
                                    </label>

                                    <label>
                                        Gender
                                        <select
                                            value={filterForm.gender}
                                            onChange={(event) =>
                                                updateFilter(
                                                    "gender",
                                                    event.target.value as "" | "MALE" | "FEMALE" | "UNKNOWN"
                                                )
                                            }
                                        >
                                            <option value="">Any gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="UNKNOWN">Unknown</option>
                                        </select>
                                    </label>
                                </div>

                                <div className="discover-filter-actions">
                                    <button
                                        className="primary-button magic-button"
                                        type="submit"
                                    >
                                        Apply filters
                                    </button>

                                    {hasActiveFilters && (
                                        <button
                                            className="secondary-button"
                                            type="button"
                                            onClick={handleClearFilters}
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            </form>

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

                            {!isLoadingDiscover && cats.length === 0 && (
                                <div className="mission-card">
                                    <div>
                                        <span className="mission-label">
                                            Empty deck
                                        </span>

                                        <h2>
                                            No cats found.
                                        </h2>

                                        <p>
                                            Try clearing the filters or come back after more
                                            cats join CatMatch.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!isLoadingDiscover && cats.length > 0 && (
                                <DiscoverCatDeck
                                    cats={cats}
                                    swipingCatId={swipingCatId}
                                    selectedSwiperCatId={selectedSwiperCatId}
                                    onSwipe={handleSwipe}
                                />
                            )}
                        </>
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