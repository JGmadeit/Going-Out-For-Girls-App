"use client"

import { useEffect, useRef } from "react"

export function MoneyAnimation() {
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

    // Money bill properties
    const bills: {
      x: number
      y: number
      width: number
      height: number
      rotation: number
      speed: number
      rotationSpeed: number
      color: string
      opacity: number
    }[] = []

    // Create initial bills - more for a fuller background
    for (let i = 0; i < 30; i++) {
      createBill()
    }

    function createBill() {
      // Use the new color palette
      const colors = ["#00D5A1", "#FFE192", "#9579CA", "#FFFFFF"]
      bills.push({
        x: Math.random() * width,
        y: -20 - Math.random() * height, // Start from above the viewport
        width: 30 + Math.random() * 30,
        height: 15 + Math.random() * 15,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 2, // Slower for background effect
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.1 + Math.random() * 0.3, // Semi-transparent for background effect
      })
    }

    function drawBill(bill: (typeof bills)[0]) {
      ctx.save()
      ctx.translate(bill.x, bill.y)
      ctx.rotate(bill.rotation)
      ctx.globalAlpha = bill.opacity

      // Draw money bill with anti-aliasing for clarity
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 2
      ctx.fillStyle = bill.color
      ctx.fillRect(-bill.width / 2, -bill.height / 2, bill.width, bill.height)
      ctx.shadowBlur = 0

      // Draw dollar sign with improved clarity
      ctx.fillStyle = "#FF9FC2"
      ctx.font = `bold ${bill.height * 0.7}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("$", 0, 0)

      ctx.restore()
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Update and draw bills
      for (let i = 0; i < bills.length; i++) {
        const bill = bills[i]
        bill.y += bill.speed
        bill.rotation += bill.rotationSpeed

        // Reset bill position if it goes off screen
        if (bill.y > height + 20) {
          bill.y = -20 - Math.random() * 50
          bill.x = Math.random() * width
        }

        drawBill(bill)
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Add new bills occasionally
    const intervalId = setInterval(() => {
      if (bills.length < 50) {
        createBill()
      }
    }, 1000)

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      canvas.width = newWidth * scale
      canvas.height = newHeight * scale
      canvas.style.width = `${newWidth}px`
      canvas.style.height = `${newHeight}px`

      ctx.scale(scale, scale)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" aria-hidden="true" />
}
