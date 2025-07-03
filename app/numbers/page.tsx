"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SpeechLearningLayout from "@/components/speech-learning-layout"

export default function NumbersPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [maxNumber, setMaxNumber] = useState(10)
  const [isConfiguring, setIsConfiguring] = useState(false)

  const numbers = Array.from({ length: maxNumber }, (_, i) => (i + 1).toString())

  const handleRestart = () => {
    setCurrentIndex(0)
  }

  const handleConfigSave = () => {
    setCurrentIndex(0)
    setIsConfiguring(false)
  }

  const renderNumber = (number: string) => (
    <div className="text-center">
      <div className="text-8xl md:text-9xl font-bold text-purple-600 mb-4">{number}</div>
      <p className="text-2xl text-gray-600">Say the number "{number}"</p>
    </div>
  )

  if (isConfiguring) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="container mx-auto max-w-md">
          <Card className="mt-20">
            <CardHeader>
              <CardTitle className="text-center">Configure Numbers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="max-number">Maximum Number</Label>
                <Input
                  id="max-number"
                  type="number"
                  min="1"
                  max="100"
                  value={maxNumber}
                  onChange={(e) => setMaxNumber(Number.parseInt(e.target.value) || 1)}
                />
                <p className="text-sm text-gray-500 mt-1">Numbers will go from 1 to {maxNumber}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleConfigSave} className="flex-1">
                  Start Learning
                </Button>
                <Button onClick={() => setIsConfiguring(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button onClick={() => setIsConfiguring(true)} variant="outline">
          Configure Range
        </Button>
      </div>
      <SpeechLearningLayout
        items={numbers}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        onRestart={handleRestart}
        title={`Learn Numbers (1-${maxNumber})`}
        renderItem={renderNumber}
        expectedSpeech={(number) => number}
      />
    </div>
  )
}
