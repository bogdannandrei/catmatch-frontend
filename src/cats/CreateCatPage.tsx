import type { CatGender } from "../api/catProfilesApi";
import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { useCreateCat } from "./useCreateCat";

export function CreateCatPage() {
    const {
        name,
        setName,
        breed,
        setBreed,
        gender,
        setGender,
        birthDate,
        setBirthDate,
        bio,
        setBio,
        city,
        setCity,
        country,
        setCountry,
        profilePhotoUrl,
        setProfilePhotoUrl,
        isLoading,
        errorMessage,
        handleSubmit,
        handleCancel,
    } = useCreateCat();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">New cat profile</span>

                    <h1 className="dashboard-hero-title">
                        Give your cat main character energy 🐈
                    </h1>

                    <p className="dashboard-hero-copy">
                        Add the basics first. Later we can expand this with real photos,
                        personality tags, matching preferences and profile editing.
                    </p>

                    <form className="form-stack cat-form" onSubmit={handleSubmit}>
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Mango"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="breed">Breed</label>
                            <input
                                id="breed"
                                value={breed}
                                onChange={(event) => setBreed(event.target.value)}
                                placeholder="Orange tabby"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(event) => setGender(event.target.value as CatGender)}
                            >
                                <option value="UNKNOWN">Unknown</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="birthDate">Birth date</label>
                            <input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={(event) => setBirthDate(event.target.value)}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="bio">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(event) => setBio(event.target.value)}
                                placeholder="Confident, dramatic, emotionally invested."
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="city">City</label>
                            <input
                                id="city"
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                placeholder="Bucharest"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="country">Country</label>
                            <input
                                id="country"
                                value={country}
                                onChange={(event) => setCountry(event.target.value)}
                                placeholder="Romania"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="profilePhotoUrl">Profile photo URL</label>
                            <input
                                id="profilePhotoUrl"
                                value={profilePhotoUrl}
                                onChange={(event) => setProfilePhotoUrl(event.target.value)}
                                placeholder="https://example.com/mango.png"
                            />
                        </div>

                        {errorMessage && (
                            <p className="error-message">
                                {errorMessage}
                            </p>
                        )}

                        <div className="actions-row">
                            <button className="primary-button magic-button" type="submit" disabled={isLoading}>
                                {isLoading ? "Creating profile..." : "Create cat profile"}
                            </button>

                            <button className="secondary-button" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}