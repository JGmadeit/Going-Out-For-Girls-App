"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RetroGrid } from "@/components/retro-grid"
import { Home, Plus, Minus, Trash2, DollarSign, Users } from "lucide-react"
import Link from "next/link"

export default function SplitBill() {
  const [billAmount, setBillAmount] = useState("")
  const [tipPercentage, setTipPercentage] = useState("15")
  const [people, setPeople] = useState([{ id: 1, name: "Person 1", items: [{ id: 1, description: "", price: "" }] }])
  const [errorMessage, setErrorMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"even" | "itemized">("even")

  const billInputRef = useRef<HTMLInputElement>(null)

  // Handle bill amount input change
  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")

    if (value === "") {
      setBillAmount("")
      setErrorMessage("")
      return
    }

    // Check if it's a valid number with up to 2 decimal places
    const regex = /^\d+(\.\d{0,2})?$/
    if (regex.test(value)) {
      setBillAmount(value)
      setErrorMessage("")
    }
  }

  // Handle tip percentage input change
  const handleTipPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")

    if (value === "") {
      setTipPercentage("")
      return
    }

    // Check if it's a valid number with up to 2 decimal places
    const regex = /^\d+(\.\d{0,2})?$/
    if (regex.test(value)) {
      setTipPercentage(value)
    }
  }

  // Add a new person
  const addPerson = () => {
    const newId = people.length > 0 ? Math.max(...people.map((p) => p.id)) + 1 : 1
    setPeople([
      ...people,
      {
        id: newId,
        name: `Person ${newId}`,
        items: [{ id: 1, description: "", price: "" }],
      },
    ])
  }

  // Remove a person
  const removePerson = (personId: number) => {
    if (people.length > 1) {
      setPeople(people.filter((p) => p.id !== personId))
    }
  }

  // Update person name
  const updatePersonName = (personId: number, name: string) => {
    setPeople(people.map((p) => (p.id === personId ? { ...p, name } : p)))
  }

  // Add an item to a person
  const addItem = (personId: number) => {
    setPeople(
      people.map((p) => {
        if (p.id === personId) {
          const newItemId = p.items.length > 0 ? Math.max(...p.items.map((i) => i.id)) + 1 : 1
          return {
            ...p,
            items: [...p.items, { id: newItemId, description: "", price: "" }],
          }
        }
        return p
      }),
    )
  }

  // Remove an item from a person
  const removeItem = (personId: number, itemId: number) => {
    setPeople(
      people.map((p) => {
        if (p.id === personId) {
          if (p.items.length > 1) {
            return {
              ...p,
              items: p.items.filter((i) => i.id !== itemId),
            }
          }
        }
        return p
      }),
    )
  }

  // Update item description
  const updateItemDescription = (personId: number, itemId: number, description: string) => {
    setPeople(
      people.map((p) => {
        if (p.id === personId) {
          return {
            ...p,
            items: p.items.map((i) => (i.id === itemId ? { ...i, description } : i)),
          }
        }
        return p
      }),
    )
  }

  // Update item price
  const updateItemPrice = (personId: number, itemId: number, price: string) => {
    const value = price.replace(/[^\d.]/g, "")

    // Check if it's a valid number with up to 2 decimal places
    const regex = /^\d*(\.\d{0,2})?$/
    if (regex.test(value) || value === "") {
      setPeople(
        people.map((p) => {
          if (p.id === personId) {
            return {
              ...p,
              items: p.items.map((i) => (i.id === itemId ? { ...i, price: value } : i)),
            }
          }
          return p
        }),
      )
    }
  }

  // Calculate subtotal for a person
  const calculatePersonSubtotal = (personId: number) => {
    const person = people.find((p) => p.id === personId)
    if (!person) return 0

    return person.items.reduce((sum, item) => {
      const price = Number.parseFloat(item.price || "0")
      return sum + (isNaN(price) ? 0 : price)
    }, 0)
  }

  // Calculate total for all items
  const calculateItemizedTotal = () => {
    return people.reduce((sum, person) => {
      return sum + calculatePersonSubtotal(person.id)
    }, 0)
  }

  // Calculate tip amount
  const calculateTipAmount = () => {
    const subtotal = activeTab === "even" ? Number.parseFloat(billAmount || "0") : calculateItemizedTotal()

    if (isNaN(subtotal) || subtotal === 0) return 0

    const tipPercent = Number.parseFloat(tipPercentage || "0") / 100
    return subtotal * tipPercent
  }

  // Calculate total with tip
  const calculateTotal = () => {
    const subtotal = activeTab === "even" ? Number.parseFloat(billAmount || "0") : calculateItemizedTotal()

    if (isNaN(subtotal)) return 0

    return subtotal + calculateTipAmount()
  }

  // Calculate per person amount for even split
  const calculateEvenSplit = () => {
    const total = calculateTotal()
    if (people.length === 0 || total === 0) return 0

    return total / people.length
  }

  // Calculate per person amount for itemized split
  const calculateItemizedSplit = (personId: number) => {
    const personSubtotal = calculatePersonSubtotal(personId)
    const total = calculateItemizedTotal()

    if (total === 0) return 0

    // Calculate person's share of the tip proportionally
    const tipAmount = calculateTipAmount()
    const personTipShare = (personSubtotal / total) * tipAmount

    return personSubtotal + personTipShare
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
            <CardTitle className="text-4xl font-bold text-[#9579CA] retro-text">Split Bill</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Split Type Tabs */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={activeTab === "even" ? "default" : "outline"}
                className={`retro-tab-button ${activeTab === "even" ? "retro-tab-active" : ""}`}
                onClick={() => setActiveTab("even")}
              >
                <DollarSign size={20} className="mr-2" /> Even Split
              </Button>
              <Button
                variant={activeTab === "itemized" ? "default" : "outline"}
                className={`retro-tab-button ${activeTab === "itemized" ? "retro-tab-active" : ""}`}
                onClick={() => setActiveTab("itemized")}
              >
                <Users size={20} className="mr-2" /> Itemized
              </Button>
            </div>

            {activeTab === "even" && (
              <div className="space-y-4">
                {/* Bill Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="billAmount" className="retro-label">
                    Bill Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9579CA] font-bold text-2xl">
                      $
                    </span>
                    <Input
                      id="billAmount"
                      ref={billInputRef}
                      type="text"
                      inputMode="decimal"
                      value={billAmount}
                      onChange={handleBillAmountChange}
                      className="pl-10 retro-input text-right"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "itemized" && (
              <div className="space-y-6">
                {people.map((person) => (
                  <div key={person.id} className="space-y-4 p-4 border-2 border-[#00D5A1]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Input
                          value={person.name}
                          onChange={(e) => updatePersonName(person.id, e.target.value)}
                          className="retro-input font-bold"
                          placeholder="Person Name"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 retro-icon-button"
                        onClick={() => removePerson(person.id)}
                        disabled={people.length <= 1}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>

                    {person.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            value={item.description}
                            onChange={(e) => updateItemDescription(person.id, item.id, e.target.value)}
                            className="retro-input"
                            placeholder="Item description"
                          />
                        </div>
                        <div className="w-24 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9579CA] font-bold">$</span>
                          <Input
                            value={item.price}
                            onChange={(e) => updateItemPrice(person.id, item.id, e.target.value)}
                            className="retro-input pl-8 text-right"
                            placeholder="0.00"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="retro-icon-button"
                          onClick={() => removeItem(person.id, item.id)}
                          disabled={person.items.length <= 1}
                        >
                          <Minus size={18} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full retro-button-secondary"
                      onClick={() => addItem(person.id)}
                    >
                      <Plus size={18} className="mr-2" /> Add Item
                    </Button>

                    <div className="text-right font-bold text-[#9579CA]">
                      Subtotal: ${calculatePersonSubtotal(person.id).toFixed(2)}
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full retro-button-secondary" onClick={addPerson}>
                  <Plus size={18} className="mr-2" /> Add Person
                </Button>

                {activeTab === "itemized" && (
                  <div className="text-right font-bold text-[#9579CA] text-xl">
                    Items Total: ${calculateItemizedTotal().toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Tip Input */}
            <div className="space-y-2">
              <Label htmlFor="tipPercentage" className="retro-label">
                Tip Percentage
              </Label>
              <div className="relative">
                <Input
                  id="tipPercentage"
                  type="text"
                  inputMode="decimal"
                  value={tipPercentage}
                  onChange={handleTipPercentageChange}
                  className="retro-input pr-8 text-right"
                  placeholder="15"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9579CA] font-bold text-2xl">%</span>
              </div>
            </div>

            {/* Results */}
            <div className="bg-[#FFE192]/50 p-5 border-4 border-[#00D5A1] retro-result space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#9579CA] text-xl">Subtotal:</span>
                <span className="font-bold text-[#9579CA] text-2xl">
                  ${(activeTab === "even" ? Number.parseFloat(billAmount || "0") : calculateItemizedTotal()).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-[#9579CA] text-xl">Tip ({tipPercentage || 0}%):</span>
                <span className="font-bold text-[#9579CA] text-2xl">${calculateTipAmount().toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t-2 border-dashed border-[#00D5A1]">
                <span className="font-bold text-[#9579CA] text-xl">Total:</span>
                <span className="font-bold text-[#9579CA] text-3xl">${calculateTotal().toFixed(2)}</span>
              </div>

              {activeTab === "even" && (
                <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-dashed border-[#00D5A1]">
                  <span className="font-bold text-[#9579CA] text-xl">Each Person ({people.length}):</span>
                  <span className="font-bold text-[#9579CA] text-3xl">${calculateEvenSplit().toFixed(2)}</span>
                </div>
              )}

              {activeTab === "itemized" && (
                <div className="pt-2 mt-2 border-t-2 border-dashed border-[#00D5A1] space-y-2">
                  <div className="font-bold text-[#9579CA] text-xl">Each Person Pays:</div>
                  {people.map((person) => (
                    <div key={person.id} className="flex justify-between items-center">
                      <span className="text-[#9579CA] text-lg">{person.name}:</span>
                      <span className="font-bold text-[#9579CA] text-2xl">
                        ${calculateItemizedSplit(person.id).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
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
        
        .retro-label {
          font-weight: bold;
          color: #9579CA;
          font-size: 1.5rem;
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
          border: 2px solid #9579CA;
          color: #9579CA;
        }
        
        .retro-button-secondary:hover {
          background-color: #FFE192;
          border-color: #9579CA;
        }
        
        .retro-icon-button {
          border: 2px solid #FF9FC2;
          border-radius: 0;
          padding: 0.25rem;
          height: auto;
          width: auto;
          min-width: 2.5rem;
          color: #9579CA;
        }
        
        .retro-icon-button:hover {
          background-color: #FFE192;
        }
        
        .retro-tab-button {
          background-color: white;
          border: 3px solid #00D5A1;
          border-radius: 0;
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
          font-family: 'VT323', monospace;
          font-size: 1.3rem;
          color: #9579CA;
          transition: all 0.1s;
        }
        
        .retro-tab-active {
          background-color: #FF9FC2;
          color: white;
          transform: translateY(2px);
          box-shadow: 1px 1px 0 rgba(0, 0, 0, 0.3);
        }
        
        .retro-result {
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
          border-radius: 0;
        }
      `}</style>
    </div>
  )
}
