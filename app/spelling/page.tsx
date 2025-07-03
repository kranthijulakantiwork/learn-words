"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SpellCheckIcon as Spellcheck, Plus, Trash2, BookOpen } from "lucide-react"

const defaultWords = [
  { id: "apple", word: "APPLE", difficulty: "Easy", category: "Fruits" },
  { id: "ball", word: "BALL", difficulty: "Easy", category: "Toys" },
  { id: "cat", word: "CAT", difficulty: "Easy", category: "Animals" },
  { id: "dog", word: "DOG", difficulty: "Easy", category: "Animals" },
  { id: "elephant", word: "ELEPHANT", difficulty: "Hard", category: "Animals" },
  { id: "fish", word: "FISH", difficulty: "Easy", category: "Animals" },
  { id: "house", word: "HOUSE", difficulty: "Medium", category: "Places" },
  { id: "ice", word: "ICE", difficulty: "Easy", category: "Nature" },
  { id: "jump", word: "JUMP", difficulty: "Easy", category: "Actions" },
  { id: "kite", word: "KITE", difficulty: "Easy", category: "Toys" },
  { id: "lion", word: "LION", difficulty: "Easy", category: "Animals" },
  { id: "moon", word: "MOON", difficulty: "Easy", category: "Nature" },
  { id: "nest", word: "NEST", difficulty: "Easy", category: "Nature" },
  { id: "orange", word: "ORANGE", difficulty: "Medium", category: "Fruits" },
  { id: "penguin", word: "PENGUIN", difficulty: "Medium", category: "Animals" },
  { id: "queen", word: "QUEEN", difficulty: "Medium", category: "People" },
  { id: "rabbit", word: "RABBIT", difficulty: "Medium", category: "Animals" },
  { id: "sun", word: "SUN", difficulty: "Easy", category: "Nature" },
  { id: "tree", word: "TREE", difficulty: "Easy", category: "Nature" },
  { id: "umbrella", word: "UMBRELLA", difficulty: "Hard", category: "Objects" },
]

export default function SpellingListPage() {
  const [words, setWords] = useState(defaultWords)
  const [newWord, setNewWord] = useState("")
  const [isAddingWord, setIsAddingWord] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    // Load custom words from localStorage
    const savedWords = localStorage.getItem("customSpellingWords")
    if (savedWords) {
      const customWords = JSON.parse(savedWords)
      setWords([...defaultWords, ...customWords])
    }
  }, [])

  const saveCustomWords = (updatedWords: typeof words) => {
    const customWords = updatedWords.filter((word) => !defaultWords.find((dw) => dw.id === word.id))
    localStorage.setItem("customSpellingWords", JSON.stringify(customWords))
  }

  const addCustomWord = () => {
    if (newWord.trim() && newWord.length >= 2) {
      const customWord = {
        id: `custom-${Date.now()}`,
        word: newWord.toUpperCase().trim(),
        difficulty: newWord.length <= 4 ? "Easy" : newWord.length <= 7 ? "Medium" : "Hard",
        category: "Custom",
      }

      const updatedWords = [...words, customWord]
      setWords(updatedWords)
      saveCustomWords(updatedWords)
      setNewWord("")
      setIsAddingWord(false)
    }
  }

  const removeCustomWord = (wordId: string) => {
    const updatedWords = words.filter((word) => word.id !== wordId)
    setWords(updatedWords)
    saveCustomWords(updatedWords)
  }

  const categories = ["All", ...Array.from(new Set(words.map((word) => word.category)))]
  const filteredWords = selectedCategory === "All" ? words : words.filter((word) => word.category === selectedCategory)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Choose a Word to Spell</h1>
          <Button onClick={() => setIsAddingWord(true)} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Word
          </Button>
        </div>

        {/* Add Word Modal */}
        {isAddingWord && (
          <Card className="mb-6 border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Add Custom Word</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="new-word">Word to Spell</Label>
                  <Input
                    id="new-word"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter a word (e.g., BUTTERFLY)"
                    className="uppercase"
                    maxLength={15}
                  />
                </div>
                <Button onClick={addCustomWord} disabled={!newWord.trim() || newWord.length < 2}>
                  Add Word
                </Button>
                <Button onClick={() => setIsAddingWord(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={selectedCategory === category ? "bg-purple-500 hover:bg-purple-600" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWords.map((wordData) => (
            <Card key={wordData.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Spellcheck className="w-6 h-6 text-purple-600" />
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(wordData.difficulty)}`}
                    >
                      {wordData.difficulty}
                    </span>
                    {wordData.category === "Custom" && (
                      <Button
                        onClick={() => removeCustomWord(wordData.id)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center text-purple-700">{wordData.word}</CardTitle>
                <CardDescription className="text-center">
                  {wordData.word.length} letters • {wordData.category}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="flex justify-center gap-1 mb-2">
                    {wordData.word.split("").map((letter, index) => (
                      <span
                        key={index}
                        className="w-8 h-8 border-2 border-purple-200 rounded flex items-center justify-center text-sm font-bold"
                      >
                        {letter}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/spelling/${wordData.id}`}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Spell This Word
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-500">No words found in this category.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">Click on any word to learn how to spell it letter by letter</p>
        </div>
      </div>
    </div>
  )
}
