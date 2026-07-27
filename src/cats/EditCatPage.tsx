import { AppNav } from "../components/AppNav";
import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { CatPhotoUpload } from "./CatPhotoUpload";
import { CatProfileForm } from "./CatProfileForm";
import { useEditCat } from "./useEditCat";

export function EditCatPage() {
    const {
        catProfile,
        setCatProfile,
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
        isSaving,
        errorMessage,
        handleSubmit,
        handleBack,
    } = useEditCat();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />
            <AppNav />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">Edit cat</span>

                    <h1 className="dashboard-hero-title">
                        Update your cat profile
                    </h1>

                    <p className="dashboard-hero-copy">
                        Change your cat details, upload a profile photo and keep the
                        profile fresh for better matches.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading cat profile...
                        </p>
                    )}

                    {errorMessage && !catProfile && (
                        <p className="error-message">
                            {errorMessage}
                        </p>
                    )}

                    {!isLoading && catProfile && (
                        <>
                            <CatPhotoUpload
                                catProfile={catProfile}
                                onPhotoUploaded={setCatProfile}
                            />

                            <CatProfileForm
                                name={name}
                                setName={setName}
                                breed={breed}
                                setBreed={setBreed}
                                gender={gender}
                                setGender={setGender}
                                birthDate={birthDate}
                                setBirthDate={setBirthDate}
                                bio={bio}
                                setBio={setBio}
                                city={city}
                                setCity={setCity}
                                country={country}
                                setCountry={setCountry}
                                profilePhotoUrl={profilePhotoUrl}
                                setProfilePhotoUrl={setProfilePhotoUrl}
                                isSaving={isSaving}
                                errorMessage={errorMessage}
                                submitLabel="Save changes"
                                savingLabel="Saving..."
                                onSubmit={handleSubmit}
                                onCancel={handleBack}
                            />
                        </>
                    )}

                    {!isLoading && !catProfile && !errorMessage && (
                        <div className="mission-card">
                            <div>
                                <span className="mission-label">Not found</span>
                                <h2>Cat profile not found.</h2>
                                <p>
                                    The profile may have been deleted or you may not have
                                    access to it.
                                </p>
                            </div>

                            <button
                                className="secondary-button"
                                type="button"
                                onClick={handleBack}
                            >
                                Back to my cats
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}