"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, ArrowLeft, SkipForward } from "lucide-react"

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

export default function SpellingPlayerPage() {
  const params = useParams()
  const wordId = params.id as string

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1)
  const [isSpellingComplete, setIsSpellingComplete] = useState(false)
  const [isSayingWord, setIsSayingWord] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [progress, setProgress] = useState(0)
  const [allWords, setAllWords] = useState(defaultWords)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSynthesis(window.speechSynthesis)

      // Load custom words from localStorage
      const savedWords = localStorage.getItem("customSpellingWords")
      if (savedWords) {
        const customWords = JSON.parse(savedWords)
        setAllWords([...defaultWords, ...customWords])
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (speechSynthesis) {
        speechSynthesis.cancel()
      }
    }
  }, [speechSynthesis])

  const wordData = allWords.find((w) => w.id === wordId)

  const speakLetter = useCallback(
    (letter: string, callback?: () => void) => {
      if (!speechSynthesis) return

      const utterance = new SpeechSynthesisUtterance(letter)
      utterance.rate = 0.6
      utterance.pitch = 1.2
      utterance.volume = 1

      utterance.onend = () => {
        if (callback) {
          timeoutRef.current = setTimeout(callback, 800) // Pause between letters
        }
      }

      speechSynthesis.speak(utterance)
    },
    [speechSynthesis],
  )

  const speakWord = useCallback(
    (word: string, callback?: () => void) => {
      if (!speechSynthesis) return

      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.7
      utterance.pitch = 1.0
      utterance.volume = 1

      utterance.onend = () => {
        if (callback) {
          timeoutRef.current = setTimeout(callback, 500)
        }
      }

      speechSynthesis.speak(utterance)
    },
    [speechSynthesis],
  )

  const startSpelling = useCallback(() => {
    if (!wordData || !speechSynthesis) return

    setIsPlaying(true)
    setCurrentLetterIndex(0)
    setIsSpellingComplete(false)
    setIsSayingWord(false)
    setProgress(0)

    const letters = wordData.word.split("")
    let currentIndex = 0

    const spellNextLetter = () => {
      if (currentIndex < letters.length) {
        setCurrentLetterIndex(currentIndex)
        setProgress(((currentIndex + 1) / (letters.length + 1)) * 100)
  
        speakLetter(letters[currentIndex].toLowerCase(), () => {
          currentIndex++
          if (currentIndex < letters.length) {
            spellNextLetter()
          } else {
            // Finished spelling individual letters
            setIsSpellingComplete(true)
            setIsSayingWord(true)
            setCurrentLetterIndex(-1)

            // Pause before saying the complete word
            timeoutRef.current = setTimeout(() => {
              speakWord(wordData.word, () => {
                setIsPlaying(false)
                setIsSayingWord(false)
                setProgress(100)
              })
            }, 1000)
          }
        })
      }
    }

    spellNextLetter()
  }, [wordData, speechSynthesis, speakLetter, speakWord])

  const stopSpelling = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPlaying(false)
    setIsSayingWord(false)
  }, [speechSynthesis])

  const resetSpelling = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsPlaying(false)
    setCurrentLetterIndex(-1)
    setIsSpellingComplete(false)
    setIsSayingWord(false)
    setProgress(0)
  }, [speechSynthesis])

  const skipToWord = useCallback(() => {
    if (!wordData) return

    stopSpelling()
    setIsSpellingComplete(true)
    setIsSayingWord(true)
    setCurrentLetterIndex(-1)
    setProgress(90)

    timeoutRef.current = setTimeout(() => {
      speakWord(wordData.word, () => {
        setIsPlaying(false)
        setIsSayingWord(false)
        setProgress(100)
      })
    }, 500)
  }, [wordData, stopSpelling, speakWord])

  if (!wordData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Word not found</h1>
            <Link href="/spelling">
              <Button>← Back to Spelling Words</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/spelling">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Words
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">Spell: {wordData.word}</h1>
          <Button onClick={resetSpelling} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex justify-center gap-2 mb-6">
                    {wordData.word.split("").map((letter, index) => (
                      <div
                        key={index}
                        className={`w-16 h-16 md:w-20 md:h-20 border-4 rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-300 ${
                          index === currentLetterIndex
                            ? "bg-purple-300 border-purple-500 text-purple-900 scale-110 shadow-lg"
                            : index < currentLetterIndex || isSpellingComplete
                              ? "bg-green-100 border-green-400 text-green-800"
                              : "bg-gray-100 border-gray-300 text-gray-600"
                        }`}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>

                  {isSayingWord && (
                    <div className="mb-4">
                      <div className="text-4xl md:text-5xl font-bold text-purple-600 animate-pulse">
                        {wordData.word}
                      </div>
                      <p className="text-lg text-gray-600 mt-2">Now saying the complete word!</p>
                    </div>
                  )}

                  {!isPlaying && !isSayingWord && currentLetterIndex === -1 && (
                    <p className="text-xl text-gray-600">Click "Start Spelling" to begin!</p>
                  )}

                  {isPlaying && !isSayingWord && (
                    <p className="text-lg text-gray-600">
                      Spelling letter by letter: {currentLetterIndex >= 0 ? wordData.word[currentLetterIndex] : ""}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={isPlaying ? stopSpelling : startSpelling}
                size="lg"
                className={`${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Spelling
                  </>
                )}
              </Button>

              {isPlaying && !isSayingWord && (
                <Button onClick={skipToWord} size="lg" variant="outline">
                  <SkipForward className="w-5 h-5 mr-2" />
                  Skip to Word
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Spelling Progress
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Word Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Letters:</span>
                    <span className="font-medium">{wordData.word.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{wordData.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{wordData.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How it works</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Click "Start Spelling" to begin</li>
                  <li>• Each letter will be highlighted and spoken</li>
                  <li>• After all letters, the complete word is said</li>
                  <li>• Use "Reset" to start over</li>
                  <li>• Use "Skip to Word" to hear the full word</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
