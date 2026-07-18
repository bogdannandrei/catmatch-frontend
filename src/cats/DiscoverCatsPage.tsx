import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useDiscoverCats } from "./useDiscoverCats";

export function DiscoverCatsPage() {
    const {
        myCats,
        cats,
        selectedSwiperCatId,
        setSelectedSwiperCatId,
        isLoading,
        isLoadingDiscover,
        errorMessage,
        swipingCatId,
        matchMessage,
        handleSwipe,
    } = useDiscoverCats();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

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
                        <div className="quick-grid">
                            {cats.map((cat) => (
                                <article className="quick-card quick-card-wild" key={cat.id}>
                                    <span>{getCatEmoji(cat.name)}</span>

                                    <h3>{cat.name}</h3>

                                    <p>
                                        <strong>{cat.breed || "Unknown breed"}</strong>
                                    </p>

                                    <p>{cat.bio || "No bio yet. Mysterious energy."}</p>

                                    <p>
                                        Location: <strong>{formatLocation(cat.city, cat.country)}</strong>
                                    </p>

                                    <div className="actions-row">
                                        <button
                                            className="secondary-button"
                                            type="button"
                                            onClick={() => handleSwipe(cat.id, "SKIP")}
                                            disabled={swipingCatId === cat.id || !selectedSwiperCatId}
                                        >
                                            {swipingCatId === cat.id ? "Saving..." : "Skip"}
                                        </button>

                                        <button
                                            className="primary-button magic-button"
                                            type="button"
                                            onClick={() => handleSwipe(cat.id, "LIKE")}
                                            disabled={swipingCatId === cat.id || !selectedSwiperCatId}
                                        >
                                            {swipingCatId === cat.id ? "Saving..." : "Like"}
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
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