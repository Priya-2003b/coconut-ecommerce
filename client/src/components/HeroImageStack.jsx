import { useState } from "react";

// TODO: replace these placeholder URLs with real Agriwhale product photo URLs
const heroImages = [
  { src: "/images/cashew.png", label: "Cashew Nuts" },
  { src: "/images/cardamom.png", label: "Premium Cardamom" },
  { src: "/images/coconut.png", label: "Husk Coconuts" },
  { src: "/images/coffee.png", label: "Coffee Powder" },
];

function HeroImageStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTap = () => {
    setActiveIndex((prev) => (prev + 1) % heroImages.length);
  };

  const goPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const goNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % heroImages.length);
  };

  return (
    <div className="hero-stack-outer">
      <div className="hero-stack-wrapper">
        <button className="hero-stack-arrow left" onClick={goPrev} aria-label="Previous">
          ‹
        </button>

        <div className="hero-stack" onClick={handleTap}>
          {heroImages.map((img, i) => {
            // Position relative to the active index so the active card is on top, centered
            const offset = i - activeIndex;
            const isActive = offset === 0;

            return (
              <div
                key={i}
                className={`hero-stack-card ${isActive ? "active" : ""}`}
                style={{
                  transform: `translateX(${offset * 22}px) rotate(${offset * 6}deg)`,
                  zIndex: heroImages.length - Math.abs(offset),
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                }}
              >
                {img.src ? (
                  <img src={img.src} alt={img.label} />
                ) : (
                  <span>{img.label}</span>
                )}
              </div>
            );
          })}
        </div>

        <button className="hero-stack-arrow right" onClick={goNext} aria-label="Next">
          ›
        </button>
      </div>

      <div className="hero-stack-dots">
        {heroImages.map((_, i) => (
          <span
            key={i}
            className={`hero-stack-dot ${i === activeIndex ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroImageStack;
