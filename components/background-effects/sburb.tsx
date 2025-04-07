"use client"

import { useEffect, useRef } from "react"

export function SburbEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // SBURB logo parameters
    const logoColor = "#00ff00"
    const logoSize = 80
    const logoCount = 5
    const logos: { x: number; y: number; rotation: number; speed: number; size: number }[] = []

    // Create logos with random positions and rotation speeds
    for (let i = 0; i < logoCount; i++) {
      logos.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        rotation: 0,
        speed: (Math.random() * 0.5 + 0.5) * 0.01,
        size: logoSize * (Math.random() * 0.5 + 0.75),
      })
    }

    function drawSburbLogo(x: number, y: number, size: number, rotation: number) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Set styles
      ctx.strokeStyle = logoColor
      ctx.lineWidth = 2
      ctx.globalAlpha = 0.5

      // Draw spirograph
      const outerRadius = size / 2
      const middleRadius = outerRadius * 0.7
      const innerRadius = outerRadius * 0.4

      // Outer circle
      ctx.beginPath()
      ctx.arc(0, 0, outerRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Middle circle
      ctx.beginPath()
      ctx.arc(0, 0, middleRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Inner circle
      ctx.beginPath()
      ctx.arc(0, 0, innerRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Horizontal line
      ctx.beginPath()
      ctx.moveTo(-outerRadius, 0)
      ctx.lineTo(outerRadius, 0)
      ctx.stroke()

      // Vertical line
      ctx.beginPath()
      ctx.moveTo(0, -outerRadius)
      ctx.lineTo(0, outerRadius)
      ctx.stroke()

      // House symbol in the center
      const houseSize = innerRadius * 0.8
      ctx.beginPath()
      ctx.moveTo(-houseSize, houseSize) // Bottom left
      ctx.lineTo(-houseSize, -houseSize * 0.2) // Up to roof start
      ctx.lineTo(0, -houseSize) // Roof peak
      ctx.lineTo(houseSize, -houseSize * 0.2) // Roof end
      ctx.lineTo(houseSize, houseSize) // Bottom right
      ctx.closePath()
      ctx.stroke()

      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw each logo
      for (const logo of logos) {
        // Update rotation
        logo.rotation += logo.speed

        // Draw logo
        drawSburbLogo(logo.x, logo.y, logo.size, logo.rotation)

        // Slowly drift position
        logo.x += Math.sin(logo.rotation * 10) * 0.2
        logo.y += Math.cos(logo.rotation * 10) * 0.2

        // Wrap around edges
        if (logo.x < -logo.size) logo.x = canvas.width + logo.size
        if (logo.x > canvas.width + logo.size) logo.x = -logo.size
        if (logo.y < -logo.size) logo.y = canvas.height + logo.size
        if (logo.y > canvas.height + logo.size) logo.y = -logo.size
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 opacity-25" />
}

