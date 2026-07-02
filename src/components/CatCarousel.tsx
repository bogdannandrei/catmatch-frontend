const cats = [
    {
        emoji: "🐈",
        name: "Mango",
        text: "Orange chaos specialist",
    },
    {
        emoji: "🐈‍⬛",
        name: "Papaya",
        text: "Tiny but emotionally unavailable",
    },
    {
        emoji: "😼",
        name: "Ciupy",
        text: "Cafe owner energy",
    },
    {
        emoji: "😻",
        name: "Luna",
        text: "Professional blanket thief",
    },
    {
        emoji: "🧡",
        name: "Mochi",
        text: "Soft paws, strong opinions",
    },
    {
        emoji: "🧶",
        name: "Nori",
        text: "Yarn criminal, first class",
    },
];

export function CatCarousel() {
    return (
        <div className="cat-carousel">
            <div className="cat-carousel-track">
                {[...cats, ...cats].map((cat, index) => (
                    <article className="cat-slide" key={`${cat.name}-${index}`}>
                        <div className="cat-slide-emoji">{cat.emoji}</div>

                        <div>
                            <h3>{cat.name}</h3>
                            <p>{cat.text}</p>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}