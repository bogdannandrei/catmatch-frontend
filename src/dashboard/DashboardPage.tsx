import {BrandBanner} from "../components/BrandBanner";
import {FloatingPaws} from "../components/FloatingPaws";
import {useDashboard} from "./useDashboard";

export function DashboardPage() {
    const {
        currentUser,
        handleLogout,
        handleOpenMyCats,
        handleOpenDiscover,
    } = useDashboard();

    const displayName =
        currentUser?.displayName || currentUser?.username || currentUser?.email;

    return (
        <main className="app-page explosive-page">
            <FloatingPaws/>

            <div className="dashboard-shell">
                <BrandBanner variant="compact"/>

                <section className="dashboard-layout">
                    <div className="glass-card dashboard-main-card">
                        <span className="section-kicker">Control center</span>

                        <h1 className="dashboard-hero-title">
                            Welcome back, {displayName || "cat person"} 🐾
                        </h1>

                        <p className="dashboard-hero-copy">
                            CatMatch is warming up. Next step: give Mango and Papaya proper
                            profiles, personalities and just enough internet presence.
                        </p>

                        <div className="mission-card">
                            <div>
                                <span className="mission-label">Today’s mission</span>
                                <h2>Build the tiny dating empire.</h2>
                                <p>
                                    Start with cat profiles. After that, we wire discovery,
                                    swipes and matches into the real backend flow.
                                </p>
                            </div>

                            <button className="primary-button magic-button" type="button" onClick={handleOpenMyCats}>
                                Manage my cats
                            </button>

                            <button
                                className="primary-button magic-button"
                                type="button"
                                onClick={handleOpenDiscover}
                            >
                                Discover cats
                            </button>
                        </div>

                        <div className="quick-grid">
                            <article className="quick-card quick-card-wild">
                                <span>🐈</span>
                                <h3>My cats</h3>
                                <p>Create and manage each cat profile separately.</p>
                            </article>

                            <article className="quick-card quick-card-wild">
                                <span>💞</span>
                                <h3>Matches</h3>
                                <p>Future home for mutual likes and promising cat friendships.</p>
                            </article>

                            <article className="quick-card quick-card-wild">
                                <span>🧶</span>
                                <h3>Discovery</h3>
                                <p>Browse cats by location, personality and chaos level.</p>
                            </article>
                        </div>
                    </div>

                    <aside className="glass-card dashboard-side-card">
                        <div className="side-avatar">😺</div>

                        <h2>Logged in</h2>

                        <p>
                            Current user:
                            <br/>
                            <strong>{displayName}</strong>
                        </p>

                        <div className="status-stack">
                            <div>
                                <span>🐾</span>
                                <p>Profiles module next</p>
                            </div>

                            <div>
                                <span>✨</span>
                                <p>Backend auth connected</p>
                            </div>

                            <div>
                                <span>🔥</span>
                                <p>Brand identity upgraded</p>
                            </div>
                        </div>

                        <button className="secondary-button" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </aside>
                </section>
            </div>
        </main>
    );
}