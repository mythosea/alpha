"use client"

export function CRTEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-crt-overlay opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-20"></div>
      <div className="absolute inset-0 animate-flicker opacity-5"></div>
    </div>
  )
}

