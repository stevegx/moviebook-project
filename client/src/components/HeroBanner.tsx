import { useEffect, useState } from "react";

const heroSlides = [
  {
    title: "Find it.",
    description: "Search and discover movies based on your mood, interests, and favorite genres.",
  },
  {
    title: "Rate it.",
    description: "Share your opinion, rate movies, and help the community discover what's worth watching.",
  },
  {
    title: "Talk about it.",
    description: "Read reviews, join discussions, and see what the community thinks.",
  },
];

function HeroBanner({ backdrops }: { backdrops: any[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((previousSlide) =>
        previousSlide === heroSlides.length - 1 ? 0 : previousSlide + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = heroSlides[activeSlide];
  const backdrop = backdrops[activeSlide]?.backdrop_path;

  return (
    <section
      className="surface-panel flex min-h-72 flex-col justify-center bg-cover bg-center p-6 sm:min-h-96 sm:p-12"
      style={backdrop ? {
        backgroundImage: `linear-gradient(90deg, rgba(8,14,25,.97), rgba(8,14,25,.45)), url(https://image.tmdb.org/t/p/w1280${backdrop})`,
      } : undefined}
    >
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
        {currentSlide.title}
      </h1>

      <p className="max-w-md text-base text-movie-text-sec sm:text-lg">
        {currentSlide.description}
      </p>

      <div className="mt-5 flex gap-1">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => setActiveSlide(index)}
            className={`grid size-11 place-items-center rounded-lg before:size-2.5 before:rounded-full before:border before:border-movie-accent ${
              activeSlide === index
                ? "before:bg-movie-accent"
                : "before:bg-transparent"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={activeSlide === index}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;
