"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X, ArrowUp, ArrowDown, Home } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"
import { RetroGrid } from "@/components/retro-grid"
import Link from "next/link"

// Service categories with suggested tip percentages and emojis
const categories = [
  { name: "Casual Dining", tip: 10, emoji: "🍜" },
  { name: "Fine Dining", tip: 20, emoji: "🍷" },
  { name: "Proper Sitdown", tip: 15, emoji: "🍽️" },
  { name: "Street Food", tip: 10, emoji: "🥙" },
  { name: "Taxi", tip: 15, emoji: "🚕" },
]

// Standard tip percentage options
const tipOptions = [10, 15, 20, 25]

export default function TipCalculator() {
  // State for form inputs and validation
  const [category, setCategory] = useState("Proper Sitdown")
  const [billAmount, setBillAmount] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(null)
  const [customPercentage, setCustomPercentage] = useState(15)
  const [isCustom, setIsCustom] = useState(false)
  const [displayPercentages, setDisplayPercentages] = useState<number[]>([])
  const [isRounded, setIsRounded] = useState<"up" | "down" | null>(null)
  const [roundedTotal, setRoundedTotal] = useState<number | null>(null)

  // Refs for input field and container
  const billInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get the debounced bill amount to avoid excessive calculations
  const debouncedBillAmount = useDebounce(billAmount, 300)
  // Get the debounced custom percentage to avoid excessive updates
  const debouncedCustomPercentage = useDebounce(customPercentage, 100)

  // Get the suggested tip percentage based on selected category
  const getSuggestedTipPercentage = () => {
    if (isCustom) return customPercentage
    const selectedCategory = categories.find((cat) => cat.name === category)
    return selectedCategory ? selectedCategory.tip : 15
  }

  // Update display percentages when custom percentage changes or category changes
  useEffect(() => {
    if (isCustom) {
      // For custom mode, show N-10, N-5, N, N+5, N+10
      const basePercentage = debouncedCustomPercentage
      const percentages = []

      // Only add percentages that are >= 0
      if (basePercentage - 10 >= 0) percentages.push(basePercentage - 10)
      if (basePercentage - 5 >= 0) percentages.push(basePercentage - 5)
      percentages.push(basePercentage)
      percentages.push(basePercentage + 5)
      percentages.push(basePercentage + 10)

      setDisplayPercentages(percentages)
    } else {
      // For regular categories, use standard options plus suggested
      const suggestedPercentage = getSuggestedTipPercentage()
      if (tipOptions.includes(suggestedPercentage)) {
        setDisplayPercentages(tipOptions)
      } else {
        setDisplayPercentages([...tipOptions, suggestedPercentage].sort((a, b) => a - b))
      }
    }

    // Reset rounding when category or custom percentage changes
    setIsRounded(null)
    setRoundedTotal(null)
  }, [debouncedCustomPercentage, category, isCustom])

  // Handle bill amount input change
  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")

    // Handle decimal input
    if (value === "") {
      setBillAmount("")
      setErrorMessage("")
      return
    }

    // Check if it's a valid number with up to 2 decimal places
    const regex = /^\d+(\.\d{0,2})?$/
    if (regex.test(value) && Number(value) > 0) {
      setBillAmount(value)
      setErrorMessage("")
    } else if (value === "0" || value === "0.0" || value === "0.00") {
      setBillAmount(value)
      setErrorMessage("Please enter a valid bill amount greater than 0.")
    } else if (value === ".") {
      setBillAmount("0.")
      setErrorMessage("")
    } else if (/^\d+\.$/.test(value)) {
      setBillAmount(value)
      setErrorMessage("")
    }

    // Reset rounding when bill amount changes
    setIsRounded(null)
    setRoundedTotal(null)
  }

  // Handle key down for bill amount input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "Tab" ||
      e.key === "Escape" ||
      e.key === "Enter" ||
      e.key === "."
    ) {
      return
    }

    // Allow: numbers
    if (/^\d$/.test(e.key)) {
      return
    }

    // Block any other input
    e.preventDefault()
  }

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    if (value === "Customize") {
      setIsCustom(true)
      setSelectedPercentage(null)
    } else {
      setCategory(value)
      setIsCustom(false)
      setSelectedPercentage(null) // Reset selected percentage when category changes
    }
    setIsRounded(null)
    setRoundedTotal(null)
  }

  // Handle custom slider change
  const handleCustomSliderChange = (value: number[]) => {
    setCustomPercentage(value[0])
    setSelectedPercentage(null)
    setIsRounded(null)
    setRoundedTotal(null)
  }

  // Handle percentage selection
  const handlePercentageSelect = (percentage: number) => {
    setSelectedPercentage(percentage)
    setIsRounded(null)
    setRoundedTotal(null)
  }

  // Handle clear bill amount
  const handleClearBillAmount = () => {
    setBillAmount("")
    setErrorMessage("")
    setIsRounded(null)
    setRoundedTotal(null)

    // Focus on the input after clearing
    if (billInputRef.current) {
      billInputRef.current.focus()
    }
  }

  // Calculate the regular (unrounded) total
  const calculateRegularTotal = () => {
    if (!debouncedBillAmount || errorMessage) return 0
    const amount = Number.parseFloat(debouncedBillAmount)
    const tipPercentage = selectedPercentage !== null ? selectedPercentage : getSuggestedTipPercentage()
    const tipAmount = (amount * tipPercentage) / 100
    return amount + tipAmount
  }

  // Handle round up/down of the total amount
  const handleRound = (direction: "up" | "down") => {
    if (!debouncedBillAmount || errorMessage) return

    const regularTotal = calculateRegularTotal()

    // Round the total amount
    const newTotal = direction === "up" ? Math.ceil(regularTotal) : Math.floor(regularTotal)

    setIsRounded(direction)
    setRoundedTotal(newTotal)
  }

  // Calculate tip amount based on bill amount and percentage
  const calculateTip = (percentage: number) => {
    if (!debouncedBillAmount || errorMessage) return "0.00"
    const amount = Number.parseFloat(debouncedBillAmount)
    return ((amount * percentage) / 100).toFixed(2)
  }

  // Calculate the tip amount when rounded
  const calculateRoundedTip = () => {
    if (!debouncedBillAmount || errorMessage || !isRounded || roundedTotal === null) return "0.00"
    const amount = Number.parseFloat(debouncedBillAmount)
    return (roundedTotal - amount).toFixed(2)
  }

  // Calculate the effective tip percentage when rounded
  const calculateRoundedPercentage = () => {
    if (!debouncedBillAmount || errorMessage || !isRounded || roundedTotal === null) return 0
    const amount = Number.parseFloat(debouncedBillAmount)
    const tipAmount = roundedTotal - amount
    return Number(((tipAmount / amount) * 100).toFixed(1))
  }

  // Calculate total amount
  const calculateTotal = () => {
    if (!debouncedBillAmount || errorMessage) return "0.00"

    if (isRounded && roundedTotal !== null) {
      return roundedTotal.toFixed(2)
    }

    return calculateRegularTotal().toFixed(2)
  }

  // Get the display percentage for the summary section
  const getDisplayPercentage = () => {
    if (isRounded && roundedTotal !== null) {
      return calculateRoundedPercentage()
    }
    return selectedPercentage !== null ? selectedPercentage : getSuggestedTipPercentage()
  }

  // Check if a percentage is the suggested one
  const isSuggestedPercentage = (percentage: number) => {
    return !isCustom && percentage === getSuggestedTipPercentage()
  }

  return (
    <div className="min-h-screen bg-[#FF9FC2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Retro Grid Background */}
      <RetroGrid />

      <div className="w-full max-w-[600px] relative z-10" ref={containerRef}>
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
            <CardTitle className="text-4xl font-bold text-[#9579CA] retro-text">Tip Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Service Type Selector */}
            <div className="space-y-2">
              <Label htmlFor="category" className="retro-label">
                Service Type
              </Label>
              <Select value={isCustom ? "Customize" : category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" aria-label="Select service type" className="retro-select">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent className="retro-dropdown">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name} className="retro-dropdown-item">
                      {cat.emoji} {cat.name} ({cat.tip}%)
                    </SelectItem>
                  ))}
                  <SelectItem value="Customize" className="retro-dropdown-item">
                    ⚙️ Customize
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Percentage Slider (only shown when "Customize" is selected) */}
            {isCustom && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="retro-label">Custom Percentage: {customPercentage}%</Label>
                </div>
                <Slider
                  value={[customPercentage]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={handleCustomSliderChange}
                  className="custom-slider"
                />
              </div>
            )}

            {/* Bill Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="billAmount" className="retro-label">
                Bill Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9579CA] font-bold text-2xl">$</span>
                <Input
                  id="billAmount"
                  ref={billInputRef}
                  type="text"
                  inputMode="decimal"
                  value={billAmount}
                  onChange={handleBillAmountChange}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10 retro-input text-right"
                  placeholder="0.00"
                  aria-invalid={!!errorMessage}
                  aria-describedby={errorMessage ? "bill-error" : undefined}
                />
                {billAmount && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9579CA] hover:text-[#FF9FC2] transition-colors"
                    onClick={handleClearBillAmount}
                    aria-label="Clear bill amount"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              {/* Error Message Area */}
              {errorMessage && (
                <Alert variant="destructive" className="mt-2 retro-alert">
                  <AlertDescription id="bill-error" className="text-xl">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Tip Calculation Results */}
            {debouncedBillAmount && !errorMessage && Number.parseFloat(debouncedBillAmount) > 0 && (
              <div className="space-y-4 mt-4">
                {/* Tip Amounts Table */}
                <div className="border-4 border-[#00D5A1] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#00D5A1] bg-opacity-30">
                      <tr>
                        <th className="px-4 py-2 text-left text-xl font-bold text-[#9579CA]">Percentage</th>
                        <th className="px-4 py-2 text-right text-xl font-bold text-[#9579CA]">Tip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayPercentages.map((percentage) => {
                        const isSelected = selectedPercentage === percentage
                        const isSuggested = isSuggestedPercentage(percentage)

                        return (
                          <tr
                            key={percentage}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[#FF9FC2] hover:bg-[#FF9FC2]"
                                : isSuggested
                                  ? "bg-[#FFE192] hover:bg-[#FFE192]/80"
                                  : "hover:bg-[#FFE192]/50"
                            }`}
                            onClick={() => handlePercentageSelect(percentage)}
                          >
                            <td className="px-4 py-2 text-left border-t-2 border-[#00D5A1]/30 font-medium text-2xl">
                              {percentage}%
                              {isSuggested && <span className="text-sm ml-1 text-[#9579CA]/70">(Suggested)</span>}
                            </td>
                            <td className="px-4 py-2 text-right border-t-2 border-[#00D5A1]/30 font-medium text-2xl">
                              ${calculateTip(percentage)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Round Up/Down Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  <Button
                    variant="outline"
                    className={`retro-button ${isRounded === "down" ? "retro-button-active" : ""}`}
                    onClick={() => handleRound("down")}
                  >
                    <ArrowDown size={20} className="mr-1" /> Round Down
                  </Button>
                  <Button
                    variant="outline"
                    className={`retro-button ${isRounded === "up" ? "retro-button-active" : ""}`}
                    onClick={() => handleRound("up")}
                  >
                    <ArrowUp size={20} className="mr-1" /> Round Up
                  </Button>
                </div>

                {/* Suggested/Selected Tip and Total */}
                <div className="bg-[#FFE192]/50 p-5 border-4 border-[#00D5A1] retro-result">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-[#9579CA] text-xl">
                      {isRounded
                        ? `Rounded ${isRounded === "up" ? "Up" : "Down"} Tip (${getDisplayPercentage()}%):`
                        : `${isCustom || selectedPercentage !== null ? "Selected" : "Suggested"} Tip (${getDisplayPercentage()}%):`}
                    </span>
                    <span className="font-bold text-[#9579CA] text-2xl">
                      ${isRounded ? calculateRoundedTip() : calculateTip(getDisplayPercentage())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-[#00D5A1]">
                    <span className="font-bold text-[#9579CA] text-xl">Total + Tip:</span>
                    <span className="font-bold text-[#9579CA] text-3xl">${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            )}
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
        
        .retro-label {
          font-weight: bold;
          color: #9579CA;
          font-size: 1.5rem;
          font-family: 'VT323', monospace;
        }
        
        .retro-input, .retro-select {
          border: 3px solid #FF9FC2;
          border-radius: 0;
          background-color: white;
          font-weight: 500;
          transition: all 0.2s;
          font-family: 'VT323', monospace;
          font-size: 1.5rem;
        }
        
        .retro-input:focus, .retro-select:focus {
          border-color: #00D5A1;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
        }
        
        .retro-alert {
          border: 3px solid #FF9FC2;
          background-color: #FFE192;
          font-weight: bold;
          color: #9579CA;
          border-radius: 0;
        }
        
        .retro-result {
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          border-radius: 0;
        }
        
        .custom-slider {
          height: 12px;
          0,0,0.3);
          border-radius: 0;
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
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .retro-button:hover {
          background-color: #FFE192;
          border-color: #00D5A1;
        }
        
        .retro-button:active, .retro-button-active {
          transform: translateY(2px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
          background-color: #FF9FC2;
          border-color: #00D5A1;
        }
        
        .retro-dropdown {
          border: 3px solid #00D5A1;
          border-radius: 0;
          background-color: white;
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          font-family: 'VT323', monospace;
          z-index: 100;
        }
        
        .retro-dropdown-item {
          font-size: 1.3rem;
        }
        
        @media (max-width: 640px) {
          .retro-card {
            box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.5);
            border: 3px solid #00D5A1;
          }
          
          .retro-button {
            font-size: 1.1rem;
            padding: 0.4rem 0.3rem;
          }
        }
      `}</style>
    </div>
  )
}
