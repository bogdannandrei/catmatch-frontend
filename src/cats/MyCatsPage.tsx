import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useMyCats } from "./useMyCats";
import { useNavigate } from "react-router-dom";


export function MyCatsPage() {
    const { cats, isLoading, errorMessage } = useMyCats();
    const navigate = useNavigate();

    function handleOpenCreateCatPage() {
        navigate("/my-cats/new");
    }

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">My cats</span>

                    <h1 className="dashboard-hero-title">
                        Mango, Papaya and the future chaos crew 🐾
                    </h1>

                    <p className="dashboard-hero-copy">
                        This is where each cat gets their own profile, personality,
                        location and matching preferences.
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

                    {!isLoading && !errorMessage && cats.length === 0 && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">No cats yet</span>
                                <h2>Your cat empire starts here.</h2>
                                <p>
                                    Add Mango, Papaya or whichever tiny menace deserves
                                    a profile first.
                                </p>
                            </div>

                            <button className="primary-button magic-button" type="button" onClick={handleOpenCreateCatPage}>
                                Add new cat
                            </button>
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
                                        Status: <strong>{cat.status}</strong>
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}

                    {!isLoading && cats.length > 0 && (
                        <button className="primary-button magic-button" type="button" onClick={handleOpenCreateCatPage}>
                            Add new cat
                        </button>
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