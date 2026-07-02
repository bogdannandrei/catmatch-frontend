import { BrandBanner } from "../components/BrandBanner";
import { CatCarousel } from "../components/CatCarousel";
import { FloatingPaws } from "../components/FloatingPaws";
import { useLogin } from "./useLogin";

export function LoginPage() {
    const {
        identifier,
        setIdentifier,
        password,
        setPassword,
        errorMessage,
        isLoading,
        handleSubmit,
    } = useLogin();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />

            <div className="landing-shell">
                <BrandBanner variant="hero" />

                <section className="login-grid">
                    <div className="glass-card copy-card">
                        <span className="section-kicker">Welcome to the chaos</span>

                        <h1 className="section-title">
                            The cozy social app your cats absolutely did not ask for.
                        </h1>

                        <p className="section-copy">
                            Mango and Papaya are the main characters. Everyone else is just
                            here for the drama, the matches and the premium loaf energy.
                        </p>

                        <div className="feature-grid">
                            <article className="feature-card">
                                <span>🐈</span>
                                <h3>Cat profiles</h3>
                                <p>Each cat gets their own personality, vibe and profile.</p>
                            </article>

                            <article className="feature-card">
                                <span>💞</span>
                                <h3>Soft matches</h3>
                                <p>Find friendly matches based on location and personality.</p>
                            </article>

                            <article className="feature-card">
                                <span>🧶</span>
                                <h3>Meme energy</h3>
                                <p>Playful, cozy and just unserious enough to feel human.</p>
                            </article>
                        </div>

                        <CatCarousel />
                    </div>

                    <section className="glass-card login-panel">
                        <div className="form-heading">
                            <span className="section-kicker">Member access</span>
                            <h2>Open the cat flap</h2>
                            <p>
                                Log in and continue building Mango and Papaya’s suspiciously
                                polished social empire.
                            </p>
                        </div>

                        <form className="form-stack" onSubmit={handleSubmit}>
                            <div className="form-field">
                                <label htmlFor="identifier">Email or username</label>
                                <input
                                    id="identifier"
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.target.value)}
                                    placeholder="ciupy_cafe@test.com"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Your password"
                                    required
                                />
                            </div>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <button className="primary-button magic-button" type="submit" disabled={isLoading}>
                                {isLoading ? "Checking the cat flap..." : "Log in"}
                            </button>
                        </form>

                        <p className="tiny-note">
                            No spam. No drama. Just cats judging each other respectfully.
                        </p>
                    </section>
                </section>
            </div>
        </main>
    );
}