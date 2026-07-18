import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useDiscoverCats } from "./useDiscoverCats";

export function DiscoverCatsPage() {
    const { cats, isLoading, errorMessage } = useDiscoverCats();

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
                        These are active cat profiles from other users. Later we will add
                        like, skip and match logic here.
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

                    {!isLoading && !errorMessage && cats.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No cats found</span>
                                <h2>The discovery feed is quiet right now.</h2>
                                <p>
                                    Create another test user with at least one active cat profile,
                                    then come back here.
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && cats.length > 0 && (
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
                                        <button className="secondary-button" type="button">
                                            Skip
                                        </button>

                                        <button className="primary-button magic-button" type="button">
                                            Like
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