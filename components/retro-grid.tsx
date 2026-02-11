"use client"

import { useEffect, useRef } from "react"

export function RetroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to fill the entire screen with higher resolution
    const scale = window.devicePixelRatio || 1
    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * scale
    canvas.height = height * scale
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Scale the context to ensure correct drawing
    ctx.scale(scale, scale)

    function drawGrid() {
      ctx.clearRect(0, 0, width, height)

      // Save the current context state
      ctx.save()

      // Translate to the center of the canvas
      ctx.translate(width / 2, height / 2)

      // Rotate the context by 45 degrees
      ctx.rotate(Math.PI / 4)

      // Translate back to draw the grid centered
      ctx.translate(-width / 2, -height / 2)

      // Calculate grid size to cover the rotated canvas (which is larger)
      const diagonal = Math.sqrt(width * width + height * height)
      // Increase grid size
      const gridSize = 60
      const extraSpace = diagonal / 2

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 1

      // Draw vertical lines
      for (let x = -extraSpace; x <= width + extraSpace; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, -extraSpace)
        ctx.lineTo(x, height + extraSpace)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = -extraSpace; y <= height + extraSpace; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(-extraSpace, y)
        ctx.lineTo(width + extraSpace, y)
        ctx.stroke()
      }

      // Draw some thicker lines for visual interest
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 2

      for (let x = -extraSpace; x <= width + extraSpace; x += gridSize * 5) {
        ctx.beginPath()
        ctx.moveTo(x, -extraSpace)
        ctx.lineTo(x, height + extraSpace)
        ctx.stroke()
      }

      for (let y = -extraSpace; y <= height + extraSpace; y += gridSize * 5) {
        ctx.beginPath()
        ctx.moveTo(-extraSpace, y)
        ctx.lineTo(width + extraSpace, y)
        ctx.stroke()
      }

      // Restore the context state
      ctx.restore()
    }

    drawGrid()

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      canvas.width = newWidth * scale
      canvas.height = newHeight * scale
      canvas.style.width = `${newWidth}px`
      canvas.style.height = `${newHeight}px`

      ctx.scale(scale, scale)
      drawGrid()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0" aria-hidden="true" />
}
