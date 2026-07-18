import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { CatProfileForm } from "./CatProfileForm";
import { useEditCat } from "./useEditCat";

export function EditCatPage() {
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
        isSaving,
        errorMessage,
        handleSubmit,
        handleCancel,
    } = useEditCat();

    return (
        <main className="app-page explosive-page">
            <FloatingPaws />

            <div className="dashboard-shell">
                <BrandBanner variant="compact" />

                <section className="glass-card dashboard-main-card">
                    <span className="section-kicker">Edit cat profile</span>

                    <h1 className="dashboard-hero-title">
                        Update this tiny menace 🐾
                    </h1>

                    <p className="dashboard-hero-copy">
                        Change the profile details and keep your cat's CatMatch presence fresh.
                    </p>

                    {isLoading && (
                        <p className="tiny-note">
                            Loading cat profile...
                        </p>
                    )}

                    {!isLoading && (
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
                            errorMessage={errorMessage}
                            isSaving={isSaving}
                            submitLabel="Save changes"
                            savingLabel="Saving changes..."
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                        />
                    )}
                </section>
            </div>
        </main>
    );
}