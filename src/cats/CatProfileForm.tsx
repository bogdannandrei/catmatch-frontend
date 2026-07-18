import type { FormEvent } from "react";
import type { CatGender } from "../api/catProfilesApi";

type CatProfileFormProps = {
    name: string;
    setName: (value: string) => void;

    breed: string;
    setBreed: (value: string) => void;

    gender: CatGender;
    setGender: (value: CatGender) => void;

    birthDate: string;
    setBirthDate: (value: string) => void;

    bio: string;
    setBio: (value: string) => void;

    city: string;
    setCity: (value: string) => void;

    country: string;
    setCountry: (value: string) => void;

    profilePhotoUrl: string;
    setProfilePhotoUrl: (value: string) => void;

    errorMessage: string | null;
    isSaving: boolean;

    submitLabel: string;
    savingLabel: string;

    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
};

export function CatProfileForm({
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
                                   errorMessage,
                                   isSaving,
                                   submitLabel,
                                   savingLabel,
                                   onSubmit,
                                   onCancel,
                               }: CatProfileFormProps) {
    return (
        <form className="form-stack cat-form" onSubmit={onSubmit}>
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
                <button
                    className="primary-button magic-button"
                    type="submit"
                    disabled={isSaving}
                >
                    {isSaving ? savingLabel : submitLabel}
                </button>

                <button
                    className="secondary-button"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}