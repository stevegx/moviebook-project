import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const BUFFERING_MESSAGES = [
  "Establishing secure connection to streaming node...",
  "Fetching ultra-high bitrate video shards...",
  "Bypassing regional restriction protocols...",
  "Decoding Dolby Atmos 7.1 audio tracks...",
  "Synchronizing multi-language sub-renderers...",
  "Optimizing buffer sizes for your bandwidth...",
  "Almost there! Finalizing secure handshake...",
];

export default function WatchMovie() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [bufferMessage, setBufferMessage] = useState<string>(
    BUFFERING_MESSAGES[0],
  );
  const [fakeProgress, setFakeProgress] = useState<number>(0);

  // 1. Σωστό Fetch των στοιχείων της ταινίας
  useEffect(() => {
    async function getMovie(movieId: string | undefined) {
      if (!movieId) return;
      try {
        const response = await fetch(`${API_URL}/movies/${movieId}`);
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed:", error);
      } finally {
        setLoading(false);
      }
    }
    getMovie(id);
  }, [id]);

  // 2. Infinite Buffering Text Loop
  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % BUFFERING_MESSAGES.length;
      setBufferMessage(BUFFERING_MESSAGES[messageIndex]);
    }, 4500); // Αλλαγή μηνύματος κάθε 4.5 δευτερόλεπτα

    return () => clearInterval(interval);
  }, []);

  // 3. Fake Progress Bar που κολλάει στο 99%
  useEffect(() => {
    const interval = setInterval(() => {
      setFakeProgress((prev) => {
        if (prev < 40) return prev + Math.random() * 8; // Γρήγορο ξεκίνημα
        if (prev < 75) return prev + Math.random() * 3; // Επιβράδυνση
        if (prev < 99) return prev + Math.random() * 0.4; // Σέρνεται...
        return 99.9; // Δεν φτάνει ΠΟΤΕ 100%
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-movie-accent"></div>
      </div>
    );
  }

  // Δημιουργία των σωστών links εικόνων από το TMDB αν υπάρχουν
  const backdropUrl = movie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white py-12 px-4 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-movie-accent/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-6xl mx-auto z-10 relative space-y-8">
        {/* Top Header / Back Button */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <Link
              to={`/movies/${id}`}
              className="text-xs font-mono uppercase tracking-widest text-movie-accent hover:underline"
            >
              ← Return to Details
            </Link>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight mt-1">
              Streaming:{" "}
              <span className="text-gray-400 italic font-medium">
                {movie?.title || "Movie Player"}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-white/2 border border-white/10 px-4 py-2 rounded-xl text-gray-400">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            LIVE_MIRROR_#01
          </div>
        </div>

        {/* ========================================== */}
        {/* INFINITE LOAD CINEMATIC PLAYER             */}
        {/* ========================================== */}
        <div className="w-full aspect-video bg-black rounded-3xl border border-white/6 shadow-[0_30px_80px_rgba(0,0,0,0.9)] relative overflow-hidden group flex flex-col justify-between">
          {/* Fake Video Background (Θολωμένο Backdrop της ταινίας για να ψαρώνει) */}
          {backdropUrl && (
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-md opacity-30 scale-105 transition-transform duration-10000 group-hover:scale-110"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            />
          )}

          {/* Player Vignette / Dark Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/70 z-0" />

          {/* Top Info Bar (Netflix/YouTube style) */}
          <div className="z-10 flex justify-between items-center p-6 bg-linear-to-b from-black/90 via-black/40 to-transparent absolute top-0 left-0 w-full transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="space-y-0.5">
              <span className="text-sm font-bold tracking-wide drop-shadow-md">
                {movie?.title}
              </span>
              <p className="text-[10px] font-mono text-gray-400">
                Auto-bitrate (1080p Enhanced) • Eng Audio
              </p>
            </div>
            <span className="text-xs font-mono bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase tracking-wider">
              Encrypted
            </span>
          </div>

          {/* MIDDLE: THE INFINITE BUFFERING SPIN & FAKE MESSAGES */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center space-y-4">
            {/* Massive Pro Loader Grid */}
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-movie-accent/20 border-t-4 border-t-movie-accent rounded-full animate-spin duration-1000" />
              <div className="absolute w-14 h-14 border-4 border-blue-500/10 border-b-4 border-b-blue-400 rounded-full animate-spin duration-700 reverse-spin" />
            </div>

            <div className="space-y-1 max-w-md">
              <p className="text-sm font-mono tracking-wide text-gray-200 h-6 animate-pulse">
                {bufferMessage}
              </p>
              <p className="text-[11px] font-mono text-movie-accent font-bold">
                Buffering data packages... {fakeProgress.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Bottom Custom Controls (Netflix Mockup style) */}
          <div className="z-10 w-full bg-linear-to-t from-black via-black/80 to-transparent p-6 absolute bottom-0 left-0 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 space-y-4">
            {/* Progress Timeline Scrubber */}
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative cursor-not-allowed">
                {/* Δείχνει ελάχιστο κόκκινο loading στην αρχή */}
                <div className="w-[1.2%] h-full bg-movie-accent rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-400">
                <span>00:00</span>
                <span>
                  {movie?.runtime ? `${movie.runtime} min` : "02:15:00"}
                </span>
              </div>
            </div>

            {/* Layout Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6 text-gray-300">
                <button className="text-xl cursor-not-allowed opacity-50">
                  ▶
                </button>
                <button className="text-sm font-mono cursor-not-allowed opacity-50">
                  ⏩ 10s
                </button>
                <div className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                  <span className="text-xs">🔊</span>
                  <div className="w-16 h-1 bg-white/30 rounded-full">
                    <div className="w-4/5 h-full bg-white" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs text-gray-400 font-mono">
                <span className="cursor-not-allowed opacity-50">
                  Subtitles (EN)
                </span>
                <span className="cursor-not-allowed opacity-50">⚙️ 1080p</span>
                <span className="text-lg cursor-not-allowed opacity-50">⛶</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* MOVIE INFO SUMMARY BOX                      */}
        {/* ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/1 border border-white/3 p-6 rounded-2xl backdrop-blur-md space-y-3">
            <h3 className="text-lg font-bold text-movie-accent uppercase tracking-wider font-mono">
              // Synopsis
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">
              {movie?.overview ||
                "No synopsis available for this source pipeline entry."}
            </p>
          </div>

          <div className="bg-white/1 border border-white/3 p-6 rounded-2xl backdrop-blur-md font-mono text-xs space-y-3 text-gray-400">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">
              // Meta_Data
            </h3>
            <div className="flex justify-between">
              <span>Release:</span>{" "}
              <span className="text-white">{movie?.release_date || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>{" "}
              <span className="text-yellow-500 font-bold">
                ★ {movie?.vote_average?.toFixed(1) || "0.0"}/10
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>{" "}
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />{" "}
                Decoding Streams
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
