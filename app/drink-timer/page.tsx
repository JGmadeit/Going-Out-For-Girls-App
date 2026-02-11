"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RetroGrid } from "@/components/retro-grid"
import { Home, Play, Pause, RotateCcw, Bell } from "lucide-react"
import Link from "next/link"

export default function DrinkTimer() {
  const [drinkInterval, setDrinkInterval] = useState(60) // Default 60 minutes
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // In seconds
  const [isActive, setIsActive] = useState(false)
  const [showNotification, setShowNotification] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const notificationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3")

    // Clean up on unmount
    return () => {
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current)
      }
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer reached zero
            if (interval) clearInterval(interval)
            playNotification()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timeRemaining === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  // Play notification sound and show visual notification
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
    }

    setShowNotification(true)

    // Hide notification after 5 seconds
    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current)
    }

    notificationTimeout.current = setTimeout(() => {
      setShowNotification(false)
    }, 5000)
  }

  // Handle interval change
  const handleIntervalChange = (value: number[]) => {
    const newInterval = value[0]
    setDrinkInterval(newInterval)

    // Only update the timer if it's not currently running
    if (!isActive) {
      setTimeRemaining(newInterval * 60)
    }
  }

  // Toggle timer
  const toggleTimer = () => {
    if (timeRemaining === 0) {
      // If timer is finished, reset it
      resetTimer()
    }
    setIsActive((prev) => !prev)
  }

  // Reset timer
  const resetTimer = () => {
    setIsActive(false)
    setTimeRemaining(drinkInterval * 60)
    setShowNotification(false)

    if (notificationTimeout.current) {
      clearTimeout(notificationTimeout.current)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-[#FF9FC2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Retro Grid Background */}
      <RetroGrid />

      <div className="w-full max-w-[600px] relative z-10">
        {/* Home Button */}
        <div className="absolute -top-16 left-0 z-20">
          <Link href="/">
            <Button variant="outline" className="retro-button">
              <Home size={20} className="mr-2" /> Home
            </Button>
          </Link>
        </div>

        <Card className="retro-card">
          <CardHeader className="text-center border-b-4 border-dashed border-[#00D5A1] pb-4">
            <CardTitle className="text-4xl font-bold text-[#9579CA] retro-text">Drink Timer</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Timer Display */}
            <div className="text-center">
              <div
                className={`text-8xl font-bold ${timeRemaining === 0 ? "text-[#FF9FC2]" : "text-[#9579CA]"} retro-timer`}
              >
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xl text-[#00D5A1] mt-2">
                {isActive ? "Time until next drink" : "Set your drink interval"}
              </div>
            </div>

            {/* Notification */}
            {showNotification && (
              <div className="bg-[#FF9FC2] p-4 border-4 border-[#00D5A1] text-white text-center animate-pulse">
                <Bell size={32} className="mx-auto mb-2" />
                <div className="text-2xl font-bold">Time for a drink!</div>
              </div>
            )}

            {/* Interval Slider (only shown when timer is not active) */}
            {!isActive && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#9579CA] text-xl">Interval: {drinkInterval} minutes</span>
                </div>
                <Slider
                  value={[drinkInterval]}
                  min={5}
                  max={120}
                  step={5}
                  onValueChange={handleIntervalChange}
                  className="custom-slider"
                />
                <div className="flex justify-between text-sm text-[#9579CA]">
                  <span>5 min</span>
                  <span>60 min</span>
                  <span>120 min</span>
                </div>
              </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="retro-button" onClick={toggleTimer}>
                {isActive ? (
                  <>
                    <Pause size={24} className="mr-2" /> Pause
                  </>
                ) : timeRemaining === 0 ? (
                  <>
                    <RotateCcw size={24} className="mr-2" /> Restart
                  </>
                ) : (
                  <>
                    <Play size={24} className="mr-2" /> Start
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="retro-button"
                onClick={resetTimer}
                disabled={!isActive && timeRemaining === drinkInterval * 60}
              >
                <RotateCcw size={24} className="mr-2" /> Reset
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-[#FFE192]/50 p-4 border-4 border-[#00D5A1] space-y-2">
              <h3 className="text-xl font-bold text-[#9579CA]">Drinking Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-[#9579CA]">
                <li>Stay hydrated! Alternate alcoholic drinks with water</li>
                <li>Pace yourself for a better night out</li>
                <li>Eat before and during drinking</li>
                <li>Know your limits and stick to them</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        body {
          font-family: 'VT323', monospace;
          letter-spacing: 0.5px;
          font-size: 18px;
        }
        
        .retro-card {
          background-color: white;
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.5);
          border: 4px solid #00D5A1;
          border-radius: 0;
        }
        
        .retro-text {
          text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
          letter-spacing: 2px;
          font-family: 'VT323', monospace;
        }
        
        .retro-timer {
          text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          letter-spacing: 4px;
          font-family: 'VT323', monospace;
        }
        
        .retro-button {
          background-color: white;
          border: 3px solid #00D5A1;
          border-radius: 0;
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
          font-family: 'VT323', monospace;
          font-size: 1.3rem;
          color: #9579CA;
          transition: all 0.1s;
          transform: translateY(0);
          padding: 0.5rem 0.5rem;
        }
        
        .retro-button:hover {
          background-color: #FFE192;
          border-color: #00D5A1;
        }
        
        .retro-button:active {
          transform: translateY(2px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
          background-color: #FF9FC2;
          border-color: #00D5A1;
        }
        
        .custom-slider {
          height: 12px;
          border: 2px solid #FF9FC2;
          background-color: #FFE192;
        }
        
        .custom-slider [role="slider"] {
          background-color: #9579CA;
          border: 2px solid white;
          width: 24px;
          height: 24px;
          border-radius: 0;
          transform: rotate(45deg);
        }
        
        .custom-slider [data-orientation="horizontal"] {
          background-color: #FFE192;
          border-radius: 0;
        }
        
        .custom-slider [data-orientation="horizontal"] > span {
          background-color: #FF9FC2;
          border-radius: 0;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
