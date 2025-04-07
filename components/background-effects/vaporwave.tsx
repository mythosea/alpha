"use client"

import { useEffect, useRef } from "react"

export function VaporwaveEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Set up the grid
    const gridSize = 50
    const horizon = canvas.height * 0.5
    const perspectiveScale = 15
    const scrollSpeed = 0.5

    // Colors
    const gridColor = "#ff71ce"
    const backgroundColor = "rgba(18, 18, 18, 0.9)"

    let offset = 0

    function drawGrid() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, horizon)
      gradient.addColorStop(0, "#05ffa1")
      gradient.addColorStop(1, "#b967ff")

      // Fill background
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw sun
      ctx.beginPath()
      ctx.arc(canvas.width / 2, horizon - 100, 60, 0, Math.PI * 2)
      ctx.fillStyle = "#fffb96"
      ctx.fill()

      // Draw horizon line
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, horizon)
      ctx.lineTo(canvas.width, horizon)
      ctx.stroke()

      // Draw vertical grid lines with perspective
      for (let x = -gridSize; x <= canvas.width + gridSize; x += gridSize) {
        const adjustedX = ((x + offset) % (gridSize * 2)) - gridSize

        ctx.beginPath()
        ctx.moveTo(canvas.width / 2 + (adjustedX - canvas.width / 2) / perspectiveScale, horizon)
        ctx.lineTo(adjustedX, canvas.height)
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw horizontal grid lines with perspective
      for (let y = horizon; y <= canvas.height; y += gridSize) {
        const scale = (y - horizon) / (canvas.height - horizon)
        const startX = canvas.width / 2 - (canvas.width * scale) / 2
        const endX = canvas.width / 2 + (canvas.width * scale) / 2

        ctx.beginPath()
        ctx.moveTo(startX, y)
        ctx.lineTo(endX, y)
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Update offset for animation
      offset = (offset + scrollSpeed) % gridSize

      requestAnimationFrame(drawGrid)
    }

    drawGrid()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 opacity-20" />
}

