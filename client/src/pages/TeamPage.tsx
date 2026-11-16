const team = [
  { area: "Frontend", members: ["Stauros Vetsikas", "Eleni Zagora", "Vasiliki Papantonopoulou"] },
  { area: "Backend", members: ["Prodromos Pantos", "Stelios Metaxas", "Giwrgos Sarafas"] },
];

export default function TeamPage() {
  return (
    <section className="page-shell space-y-6">
      <header className="space-y-2">
        <h1 className="page-title">Meet the team</h1>
        <p className="text-movie-text-sec">The students who built MovieBook at the SKG Education Web Development Bootcamp.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2">
        {team.map(({ area, members }) => (
          <section key={area} className="surface-panel p-5 sm:p-6">
            <h2 className="section-title mb-3">{area}</h2>
            <ul className="divide-y divide-movie-border">
              {members.map((name) => <li key={name} className="py-3">{name}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
