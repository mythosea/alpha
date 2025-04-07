"use client"

export function GlitchEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 animate-glitch opacity-10"></div>
      <div className="absolute inset-0 animate-glitch-2 opacity-10 delay-150"></div>
    </div>
  )
}

