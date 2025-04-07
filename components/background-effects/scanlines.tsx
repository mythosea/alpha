"use client"

export function ScanlinesEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-20">
      <div className="absolute inset-0 bg-scanlines"></div>
    </div>
  )
}

