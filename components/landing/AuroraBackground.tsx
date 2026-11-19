"use client";

export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Deep black base */}
      <div className="absolute inset-0 bg-black" />

      {/* Aurora blob 1 — violet */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)",
          top: "-10%",
          left: "-10%",
          filter: "blur(120px)",
          animation: "aurora-1 20s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 2 — cyan */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, transparent 70%)",
          top: "20%",
          right: "-5%",
          filter: "blur(100px)",
          animation: "aurora-2 25s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 3 — emerald */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)",
          bottom: "10%",
          left: "30%",
          filter: "blur(130px)",
          animation: "aurora-3 22s ease-in-out infinite",
        }}
      />

      {/* Aurora blob 4 — rose accent */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(251,113,133,0.25) 0%, transparent 70%)",
          bottom: "-5%",
          right: "20%",
          filter: "blur(110px)",
          animation: "aurora-1 18s ease-in-out infinite reverse",
        }}
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />
    </div>
  );
}
