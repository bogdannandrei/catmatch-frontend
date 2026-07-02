import bannerImage from "../assets/catmatch-mango-papaya-banner.png";

type BrandBannerProps = {
    variant?: "hero" | "compact";
};

export function BrandBanner({ variant = "hero" }: BrandBannerProps) {
    return (
        <section className={`brand-banner brand-banner-${variant}`}>
            <div className="brand-banner-glow" />

            <img
                className="brand-banner-image"
                src={bannerImage}
                alt="CatMatch featuring Mango, Papaya and meme cats"
            />
        </section>
    );
}