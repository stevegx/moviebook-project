import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-100 py-20 px-4 relative overflow-hidden select-none flex items-center justify-center">
      <div className="absolute top-[-10%] right-[-10%] w-150 h-150 bg-movie-accent/5 rounded-full blur-[180px] pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-blue-500/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto z-10 text-center space-y-12 relative">
        <header className="space-y-3 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter bg-linear-to-b from-white via-gray-200 to-gray-600 bg-clip-text text-transparent">
            About Us
          </h1>
          <div className="w-24 h-px bg-linear-to-r from-transparent via-movie-accent to-transparent mx-auto pt-2" />
        </header>

        <main className="space-y-8 bg-white/1 border border-white/3 p-8 sm:p-12 rounded-3xl backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.8)] relative group hover:border-movie-accent/20 transition-all duration-500">
          <span className="absolute top-4 left-6 text-7xl font-serif text-white pointer-events-none select-none">
            “
          </span>
          <span className="absolute bottom-0 right-6 text-7xl font-serif text-white pointer-events-none select-none">
            ”
          </span>

          <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed tracking-wide text-justify sm:text-center first-letter:text-3xl first-letter:font-bold first-letter:text-movie-accent">
            The creation of <strong>MovieBook</strong> marks the culmination of
            an incredible, fast-paced cinematic journey. Brought to life as a
            dedicated final project for the <strong>SKG Education</strong> Web
            Development Bootcamp, this application is the proud result of
            seamless collaboration, late-night debugging, and a shared passion
            for modern full-stack engineering.
          </p>

          <p className="text-gray-300 text-base sm:text-lg font-light leading-relaxed tracking-wide text-justify sm:text-center">
            Every feature, every route, and every pixel on this interface
            represents a collective, relentless effort from all team members. We
            operated not just as individuals, but as a synchronized crew behind
            the scenes—pushing boundaries, overcoming technical hurdles, and
            elevating one another's skills at every milestone.
          </p>

          <p className="text-gray-200 text-lg sm:text-xl font-medium tracking-wide italic pt-4">
            "To the entire SKG Education team, mentors, and fellow creators:
            thank you from the bottom of our hearts for this unforgettable
            chapter, the endless support, and this beautiful journey.{" "}
            <span className="text-movie-accent not-italic">❤️</span>"
          </p>
        </main>

        <footer className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/team"
              className="text-xs uppercase tracking-widest font-bold bg-white/[0.03] border border-white/[0.08] hover:border-movie-accent/40 text-white px-8 py-3.5 rounded-xl transition-all duration-300 hover:bg-white/[0.05] w-full sm:w-auto"
            >
              Meet the Crew
            </Link>
            <Link
              to="/"
              className="text-xs uppercase tracking-widest font-black bg-movie-accent text-white px-8 py-3.5 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_30px_rgba(229,9,20,0.2)] hover:shadow-[0_0_40px_rgba(229,9,20,0.4)] w-full sm:w-auto"
            >
              Explore MovieBook
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
