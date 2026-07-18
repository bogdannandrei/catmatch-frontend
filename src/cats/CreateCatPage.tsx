import { BrandBanner } from "../components/BrandBanner";
import { FloatingPaws } from "../components/FloatingPaws";
import { CatProfileForm } from "./CatProfileForm";
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
                        isSaving={isLoading}
                        submitLabel="Create cat profile"
                        savingLabel="Creating profile..."
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </section>
            </div>
        </main>
    );
}