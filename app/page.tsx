"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RetroGrid } from "@/components/retro-grid"
import { MoneyAnimation } from "@/components/money-animation"
import { Calculator, Car, MessageSquare, Search, MapPin, Clock, Users } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [showMoneyAnimation, setShowMoneyAnimation] = useState(false)

  return (
    <div className="min-h-screen bg-[#FF9FC2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <RetroGrid />
      {showMoneyAnimation && <MoneyAnimation />}

      <div className="w-full max-w-[600px] relative z-10">
        {/* Header Card */}
        <Card className="retro-card mb-6">
          <CardContent className="p-6 text-center">
            <h1 className="text-5xl font-bold text-[#9579CA] retro-text mb-2">GOGG</h1>
            <p className="text-2xl text-[#00D5A1]">Going Out for Girls Guide</p>
          </CardContent>
        </Card>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/tip-calculator" className="block">
            <Button
              variant="outline"
              className="retro-tool-button h-32 w-full"
              onMouseEnter={() => setShowMoneyAnimation(true)}
              onMouseLeave={() => setShowMoneyAnimation(false)}
            >
              <div className="flex flex-col items-center justify-center">
                <Calculator size={40} className="mb-2 text-[#9579CA]" />
                <span className="text-xl">Tip Calculator</span>
              </div>
            </Button>
          </Link>

          <Link href="/split-bill" className="block">
            <Button variant="outline" className="retro-tool-button h-32 w-full">
              <div className="flex flex-col items-center justify-center">
                <Users size={40} className="mb-2 text-[#9579CA]" />
                <span className="text-xl">Split Bill</span>
              </div>
            </Button>
          </Link>

          <Link href="/drink-timer" className="block">
            <Button variant="outline" className="retro-tool-button h-32 w-full">
              <div className="flex flex-col items-center justify-center">
                <Clock size={40} className="mb-2 text-[#9579CA]" />
                <span className="text-xl">Drink Timer</span>
              </div>
            </Button>
          </Link>

          <Link href="/find-bathroom" className="block">
            <Button variant="outline" className="retro-tool-button h-32 w-full">
              <div className="flex flex-col items-center justify-center">
                <MapPin size={40} className="mb-2 text-[#9579CA]" />
                <span className="text-xl">Find Bathroom</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Quick Links Card */}
        <Card className="retro-card">
          <CardContent className="p-6">
            <h2 className="text-3xl font-bold text-[#9579CA] retro-text mb-4">Quick Links</h2>

            <div className="grid grid-cols-2 gap-4">
              <a href="https://m.uber.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="retro-link-button w-full">
                  <div className="flex items-center justify-center">
                    <Car size={24} className="mr-2 text-[#9579CA]" />
                    <span>Uber</span>
                  </div>
                </Button>
              </a>

              <a href="https://ride.lyft.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="retro-link-button w-full">
                  <div className="flex items-center justify-center">
                    <Car size={24} className="mr-2 text-[#9579CA]" />
                    <span>Lyft</span>
                  </div>
                </Button>
              </a>

              <a href="https://m.yelp.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="retro-link-button w-full">
                  <div className="flex items-center justify-center">
                    <Search size={24} className="mr-2 text-[#9579CA]" />
                    <span>Yelp</span>
                  </div>
                </Button>
              </a>

              <Button
                variant="outline"
                className="retro-link-button w-full"
                onClick={() => (window.location.href = "sms:")}
              >
                <div className="flex items-center justify-center">
                  <MessageSquare size={24} className="mr-2 text-[#9579CA]" />
                  <span>Messages</span>
                </div>
              </Button>
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
        
        .retro-tool-button {
          background-color: white;
          border: 3px solid #00D5A1;
          border-radius: 0;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          font-family: 'VT323', monospace;
          font-size: 1.3rem;
          color: #9579CA;
          transition: all 0.2s;
          transform: translateY(0);
        }
        
        .retro-tool-button:hover {
          background-color: #FFE192;
          border-color: #FF9FC2;
          transform: translateY(-2px);
          box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.3);
        }
        
        .retro-link-button {
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
        
        .retro-link-button:hover {
          background-color: #FFE192;
          border-color: #00D5A1;
        }
        
        .retro-link-button:active {
          transform: translateY(2px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
          background-color: #FF9FC2;
          border-color: #00D5A1;
        }
      `}</style>
    </div>
  )
}
