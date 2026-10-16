const items = [
  "Synergy Group Fitness",
  "More Than Just A Gym",
  "Strength. Fitness. Community.",
  "Edinburgh's Functional Gym",
];

export const Marquee = () => {
  const strip = [...items, ...items, ...items];
  return (
    <div
      data-testid="editorial-marquee"
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[#F4F4F0]/10 py-8 md:py-12 bg-[#121212]"
    >
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {strip.map((text, i) => (
              <span
                key={`${half}-${i}`}
                className={`font-display font-bold uppercase tracking-tight text-5xl md:text-7xl px-8 ${
                  i % 2 === 0 ? "text-outline" : "text-[#F4F4F0]"
                }`}
              >
                {text}
                <span className="text-[#4C63F5] pl-8">//</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
