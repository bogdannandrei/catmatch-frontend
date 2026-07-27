import { useMemo, useState } from "react";
import { uploadCatProfilePhoto, type CatProfileResponse } from "../api/catProfilesApi";

type CatPhotoUploadProps = {
    catProfile: CatProfileResponse;
    onPhotoUploaded: (updatedCatProfile: CatProfileResponse) => void;
};

export function CatPhotoUpload({
                                   catProfile,
                                   onPhotoUploaded,
                               }: CatPhotoUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const displayedPhotoUrl = useMemo(() => {
        return previewUrl || catProfile.profilePhotoUrl;
    }, [catProfile.profilePhotoUrl, previewUrl]);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] || null;

        setErrorMessage(null);
        setSelectedFile(file);

        if (!file) {
            setPreviewUrl(null);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setErrorMessage("Please select an image file.");
            setPreviewUrl(null);
            setSelectedFile(null);
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
    }

    async function handleUploadPhoto() {
        if (!selectedFile) {
            return;
        }

        try {
            setIsUploading(true);
            setErrorMessage(null);

            const updatedCatProfile = await uploadCatProfilePhoto(
                catProfile.id,
                selectedFile
            );

            onPhotoUploaded(updatedCatProfile);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Failed to upload cat photo:", error);
            setErrorMessage("Could not upload photo.");
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <section className="cat-photo-upload-card">
            <div className="cat-photo-preview">
                {displayedPhotoUrl ? (
                    <img src={displayedPhotoUrl} alt={catProfile.name} />
                ) : (
                    <span>😺</span>
                )}
            </div>

            <div className="cat-photo-upload-content">
                <span className="section-kicker">Profile photo</span>

                <h2>Make {catProfile.name} shine</h2>

                <p>
                    Upload a JPEG, PNG or WEBP photo. Maximum size: 5 MB.
                </p>

                <label className="file-upload-button">
                    Choose photo
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                    />
                </label>

                {selectedFile && (
                    <p className="tiny-note">
                        Selected: {selectedFile.name}
                    </p>
                )}

                {errorMessage && (
                    <p className="error-message">
                        {errorMessage}
                    </p>
                )}

                <button
                    className="primary-button magic-button"
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload photo"}
                </button>
            </div>
        </section>
    );
}