"use client"

import { useEffect, useRef } from "react"

export function StarsEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: Star[] = []
    const numStars = 100

    class Star {
      x: number
      y: number
      size: number
      opacity: number
      speed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.5 + 0.3
        this.speed = Math.random() * 0.05 + 0.01
      }

      update() {
        this.opacity += Math.sin(Date.now() * this.speed) * 0.01
        if (this.opacity > 0.8) this.opacity = 0.8
        if (this.opacity < 0.2) this.opacity = 0.2
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function init() {
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star())
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < stars.length; i++) {
        stars[i].update()
        stars[i].draw()
      }
      requestAnimationFrame(animate)
    }

    init()
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

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 opacity-30" />
}

