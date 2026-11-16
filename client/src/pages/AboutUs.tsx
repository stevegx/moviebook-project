import { Link } from "react-router-dom";
import tmdbLogo from "@/Assets/tmdb-logo.svg";

export default function AboutUs() {
  return (
    <div className="page-shell max-w-4xl space-y-6">
      <header className="space-y-2">
        <h1 className="page-title">
          About Us
        </h1>
      </header>

      <article className="surface-panel space-y-5 p-5 sm:p-8">

        <p className="leading-relaxed text-movie-text-sec">
          The creation of <strong>MovieBook</strong> marks the culmination of
          an incredible, fast-paced cinematic journey. Brought to life as a
          dedicated final project for the <strong>SKG Education</strong> Web
          Development Bootcamp, this application is the proud result of
          seamless collaboration, late-night debugging, and a shared passion
          for modern full-stack engineering.
        </p>

        <p className="leading-relaxed text-movie-text-sec">
          Every feature, every route, and every pixel on this interface
          represents a collective, relentless effort from all team members. We
          operated not just as individuals, but as a synchronized crew behind
          the scenes—pushing boundaries, overcoming technical hurdles, and
          elevating one another's skills at every milestone.
        </p>

        <p className="border-l-2 border-movie-accent pl-4 leading-relaxed italic">
          "To the entire SKG Education team, mentors, and fellow creators:
          thank you from the bottom of our hearts for this unforgettable
          chapter, the endless support, and this beautiful journey.{" "}
          <span className="text-movie-accent not-italic">❤️</span>"
        </p>
      </article>

      <aside className="surface-panel flex flex-wrap items-center gap-4 p-5">
        <a href="https://www.themoviedb.org" className="rounded">
          <img src={tmdbLogo} alt="The Movie Database" className="w-12" />
        </a>
        <p className="max-w-xl text-sm text-movie-text-sec">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </aside>

      <footer className="pt-1">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/team"
            className="button-secondary"
          >
            Meet the Crew
          </Link>
          <Link
            to="/"
            className="button-primary"
          >
            Explore MovieBook
          </Link>
        </div>
      </footer>
    </div>
  );
}
