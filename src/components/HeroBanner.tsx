import { useEffect, useState } from "react";

const heroSlides = [
  {
    title: "Find it.",
    description: "Search and discover movies based on your mood, interests, and favorite genres.",
  },
  {
    title: "Watch it.",
    description: "Keep track of the movies you are currently watching and never lose your place.",
  },
  {
    title: "Rate it.",
    description: "Share your opinion, rate movies, and help the community discover what is worth watching.",
  },
];

function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((previousSlide) =>
        previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = heroSlides[activeSlide];

  return (
    <section className="max-w-[1500px] mx-auto mb-12 px-12 py-16 bg-movie-surface rounded-2xl border border-movie-accent shadow-lg text-left">
      <h2 className="text-5xl font-bold text-movie-accent mb-4">
        {currentSlide.title}
      </h2>

      <p className="text-movie-text-sec text-lg max-w-md">
        {currentSlide.description}
      </p>

      <div className="mt-8 flex gap-3">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => setActiveSlide(index)}
            className={`w-3 h-3 rounded-full border border-movie-accent cursor-pointer transition-all ${
              activeSlide === index
                ? "bg-movie-accent scale-125"
                : "bg-transparent"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;