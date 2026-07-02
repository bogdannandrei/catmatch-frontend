import catmatchBrandHero from "../assets/catmatch-mango-papaya-banner.png";

type BrandHeroProps = {
    compact?: boolean;
};

export function BrandHero({ compact = false }: BrandHeroProps) {
    return (
        <section className={compact ? "brand-stage brand-stage-compact" : "brand-stage"}>
            <div className="brand-stage-glow" />

            <img
                className="brand-hero-image"
                src={catmatchBrandHero}
                alt="CatMatch"
            />
        </section>
    );
}