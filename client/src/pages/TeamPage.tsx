import thedog from "../Assets/20260628_203743.jpg";
interface TeamMember {
  name: string;
  role?: string;
}

export default function TeamPage() {
  const frontend: TeamMember[] = [
    { name: "Stauros Vetsikas" },
    { name: "Eleni Zagora" },
    { name: "Vasiliki Papantonopoulou" },
  ];

  const backend: TeamMember[] = [
    { name: "Prodromos Pantos" },
    { name: "Stelios Metaxas" },
    { name: "Giwrgos Sarafas" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-100 flex flex-col justify-center items-center py-20 px-4 relative overflow-hidden select-none">
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-movie-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10">
        <header className="text-center mb-20 relative">
          <div className="inline-block text-xs uppercase tracking-[0.4em] text-movie-accent font-bold mb-3 bg-movie-accent/10 px-4 py-1.5 rounded-full border border-movie-accent/20 backdrop-blur-md">
            Behind The Screen
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 bg-linear-to-b from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            The Creative Minds
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
            <span className="text-white font-medium">MovieBook</span> project
            was crafted from the ground up by our synchronized front-end and
            back-end engineering crews.
          </p>

          <div className="w-24 h-px bg-linear-to-r from-transparent via-movie-accent to-transparent mx-auto mt-8 shadow-[0_0_10px_#fff]" />
        </header>

        <main className="w-full space-y-16">
          {/* 👥 Grid για τις 2 ομάδες (Front End & Back End) */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Front End Team */}
            <section className="group">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                <span className="text-2xl">🎬</span>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-movie-accent transition-colors duration-300">
                  Front End Team
                </h2>
                <span className="text-xs text-gray-500 font-mono ml-auto">
                  // client_side
                </span>
              </div>

              <div className="space-y-4">
                {frontend.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-linear-to-r from-white/2 to-transparent border border-white/5 hover:border-movie-accent/40 hover:from-movie-accent/2 transition-all duration-300 group/item backdrop-blur-md shadow-2xl"
                  >
                    <div className="text-lg font-semibold text-gray-200 group-hover/item:text-white transition-colors">
                      {member.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Back End Team */}
            <section className="group">
              <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
                <span className="text-2xl">🎛️</span>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors duration-300">
                  Back End Team
                </h2>
                <span className="text-xs text-gray-500 font-mono ml-auto">
                  // server_side
                </span>
              </div>

              <div className="space-y-4">
                {backend.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-linear-to-r from-white/2 to-transparent border border-white/5 hover:border-blue-500/40 hover:from-blue-500/2 transition-all duration-300 group/item backdrop-blur-md shadow-2xl"
                  >
                    <div className="text-lg font-semibold text-gray-200 group-hover/item:text-white transition-colors">
                      {member.name}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 🐾 Honorable Mention - Κεντραρισμένο ακριβώς από κάτω */}
          <section className="flex items-center justify-center w-full pt-8">
            <div className="flex flex-col items-center justify-center gap-4 max-w-md w-full text-center border-t border-gray-800/60 pt-8 group">
              {/* Emoji & Τίτλος (Αφαιρέθηκε το animate-bounce) */}
              <div className="flex items-center gap-2">
                <span className="text-3xl">🐾</span>
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-white group-hover:text-movie-accent transition-colors duration-300">
                  Honorable Mention
                </h2>
              </div>

              {/* Εικόνα του Όσκαρ */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-movie-accent/30 group-hover:border-movie-accent transition-all duration-300 shadow-lg">
                <img
                  src={thedog}
                  alt="the dog"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Όνομα */}
              <h3 className="text-lg font-semibold text-gray-300 font-mono tracking-tight">
                Oscar the dog
              </h3>
            </div>
          </section>
        </main>

        <footer className="mt-24 text-center">
          <div className="text-[10px] uppercase tracking-[0.5em] text-gray-600 font-mono">
            © 2026 MovieBook Inc. All Production Rights Reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
