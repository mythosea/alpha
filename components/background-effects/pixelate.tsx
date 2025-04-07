"use client"

export function PixelateEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundSize: "10px 10px",
          backgroundImage:
            "linear-gradient(to right, rgba(128,0,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,0,255,0.2) 1px, transparent 1px)",
        }}
      ></div>
    </div>
  )
}

