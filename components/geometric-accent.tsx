export function GeometricAccent() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-right geometric circle */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-border/40 opacity-40" />
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-border/30 opacity-30" />

      {/* Bottom-left geometric arc */}
      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full border border-border/30 opacity-25" />

      {/* Subtle dot grid pattern */}
      <svg
        className="absolute right-12 top-1/4 opacity-[0.06]"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="currentColor"
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <circle
            key={i}
            cx={(i % 6) * 24 + 12}
            cy={Math.floor(i / 6) * 24 + 12}
            r="1.5"
          />
        ))}
      </svg>
    </div>
  )
}
