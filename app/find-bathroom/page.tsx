"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RetroGrid } from "@/components/retro-grid"
import { Home, Search, MapPin, Compass } from "lucide-react"
import Link from "next/link"

export default function FindBathroom() {
  const [location, setLocation] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Handle search button click
  const handleSearch = () => {
    if (!location.trim()) {
      setErrorMessage("Please enter a location")
      return
    }

    setIsSearching(true)
    setErrorMessage("")

    // Simulate search delay
    setTimeout(() => {
      // Open Google Maps with the search query
      const searchQuery = encodeURIComponent(`public restroom near ${location}`)
      window.open(`https://www.google.com/maps/search/${searchQuery}`, "_blank")
      setIsSearching(false)
    }, 1000)
  }

  // Handle use current location button click
  const handleUseCurrentLocation = () => {
    setIsLocating(true)
    setErrorMessage("")

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Open Google Maps with the current location
          window.open(`https://www.google.com/maps/search/public+restroom/@${latitude},${longitude},15z`, "_blank")

          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setErrorMessage("Could not get your location. Please check your permissions.")
          setIsLocating(false)
        },
        { enableHighAccuracy: true },
      )
    } else {
      setErrorMessage("Geolocation is not supported by your browser")
      setIsLocating(false)
    }
  }

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
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
            <CardTitle className="text-4xl font-bold text-[#9579CA] retro-text">Find Bathroom</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="text-center text-[#9579CA] text-xl mb-4">Quickly locate the nearest public restroom</div>

            {/* Search Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="retro-input pl-10"
                  placeholder="Enter location (e.g., Times Square)"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9579CA]" size={20} />
              </div>

              {errorMessage && <div className="text-[#FF9FC2] font-bold text-center">{errorMessage}</div>}

              <Button variant="outline" className="retro-button w-full" onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2">
                      <Search size={20} />
                    </div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search size={20} className="mr-2" /> Search Bathrooms
                  </>
                )}
              </Button>

              <div className="text-center text-[#9579CA]">- OR -</div>

              <Button
                variant="outline"
                className="retro-button-secondary w-full"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2">
                      <Compass size={20} />
                    </div>
                    Locating...
                  </div>
                ) : (
                  <>
                    <Compass size={20} className="mr-2" /> Use Current Location
                  </>
                )}
              </Button>
            </div>

            {/* Tips */}
            <div className="bg-[#FFE192]/50 p-4 border-4 border-[#00D5A1] space-y-2">
              <h3 className="text-xl font-bold text-[#9579CA]">Bathroom Finding Tips:</h3>
              <ul className="list-disc list-inside space-y-1 text-[#9579CA]">
                <li>Hotels usually have clean public restrooms in the lobby</li>
                <li>Department stores and shopping malls are reliable options</li>
                <li>Fast food restaurants and coffee shops typically have bathrooms</li>
                <li>Many cities have dedicated public restroom apps</li>
                <li>Always buy something small if using a business's bathroom</li>
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
        
        .retro-input {
          border: 3px solid #FF9FC2;
          border-radius: 0;
          background-color: white;
          font-weight: 500;
          transition: all 0.2s;
          font-family: 'VT323', monospace;
          font-size: 1.5rem;
        }
        
        .retro-input:focus {
          border-color: #00D5A1;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
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
        
        .retro-button-secondary {
          background-color: white;
          border: 3px solid #9579CA;
          border-radius: 0;
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
          font-family: 'VT323', monospace;
          font-size: 1.3rem;
          color: #9579CA;
          transition: all 0.1s;
          transform: translateY(0);
          padding: 0.5rem 0.5rem;
        }
        
        .retro-button-secondary:hover {
          background-color: #FFE192;
          border-color: #9579CA;
        }
        
        .retro-button-secondary:active {
          transform: translateY(2px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
          background-color: #FF9FC2;
          border-color: #9579CA;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
