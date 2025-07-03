"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Volume2, ArrowLeft } from "lucide-react"

const rhymes = [
  {
    id: "twinkle-twinkle",
    title: "Twinkle Twinkle Little Star",
    text: `Twinkle, twinkle, little star,
How I wonder what you are.
Up above the world so high,
Like a diamond in the sky.
Twinkle, twinkle, little star,
How I wonder what you are.`,
  },
  {
    id: "mary-had-lamb",
    title: "Mary Had a Little Lamb",
    text: `Mary had a little lamb,
Its fleece was white as snow.
And everywhere that Mary went,
The lamb was sure to go.
It followed her to school one day,
Which was against the rule.`,
  },
  {
    id: "humpty-dumpty",
    title: "Humpty Dumpty",
    text: `Humpty Dumpty sat on a wall,
Humpty Dumpty had a great fall.
All the king's horses and all the king's men,
Couldn't put Humpty together again.`,
  },
  {
    id: "baa-baa-black-sheep",
    title: "Baa Baa Black Sheep",
    text: `Baa, baa, black sheep,
Have you any wool?
Yes sir, yes sir,
Three bags full.
One for the master,
One for the dame,
And one for the little boy
Who lives down the lane.`,
  },
  {
    id: "old-macdonald",
    title: "Old MacDonald Had a Farm",
    text: `Old MacDonald had a farm,
E-I-E-I-O!
And on his farm he had a cow,
E-I-E-I-O!
With a moo-moo here,
And a moo-moo there,
Here a moo, there a moo,
Everywhere a moo-moo,
Old MacDonald had a farm,
E-I-E-I-O!`,
  },
  {
    id: "row-row-boat",
    title: "Row, Row, Row Your Boat",
    text: `Row, row, row your boat,
Gently down the stream.
Merrily, merrily, merrily, merrily,
Life is but a dream.`,
  },
]

export default function RhymePlayerPage() {
  const params = useParams()
  const rhymeId = params.id as string

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(-1)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [progress, setProgress] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const rhyme = rhymes.find((r) => r.id === rhymeId)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSynthesis(window.speechSynthesis)
    }

    if (rhyme) {
      // Split text into words, preserving punctuation
      const wordArray = rhyme.text
        .split(/(\s+)/)
        .filter((word) => word.trim().length > 0)
        .map((word) => word.trim())
      setWords(wordArray)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (speechSynthesis) {
        speechSynthesis.cancel()
      }
    }
  }, [rhyme, speechSynthesis])

  const startWordHighlighting = useCallback(
    (duration: number) => {
      const wordsPerSecond = words.length / (duration / 1000)
      const intervalTime = 1000 / wordsPerSecond

      startTimeRef.current = Date.now()
      setCurrentWordIndex(0)

      intervalRef.current = setInterval(
        () => {
          const elapsed = Date.now() - startTimeRef.current
          const expectedWordIndex = Math.floor((elapsed / 1000) * wordsPerSecond)

          if (expectedWordIndex < words.length) {
            setCurrentWordIndex(expectedWordIndex)
            setProgress((expectedWordIndex / words.length) * 100)
          } else {
            setCurrentWordIndex(-1)
            setProgress(100)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
          }
        },
        Math.max(intervalTime / 2, 50),
      ) // Update at least every 50ms
    },
    [words],
  )

  const playRhyme = useCallback(() => {
    if (!speechSynthesis || !rhyme) return

    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }

    const newUtterance = new SpeechSynthesisUtterance(rhyme.text)
    newUtterance.rate = 0.7
    newUtterance.pitch = 1.1
    newUtterance.volume = 1

    newUtterance.onstart = () => {
      setIsPlaying(true)
      // Estimate duration and start word highlighting
      const estimatedDuration = rhyme.text.length * 80 // ~80ms per character
      startWordHighlighting(estimatedDuration)
    }

    newUtterance.onend = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      setProgress(100)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    newUtterance.onerror = () => {
      setIsPlaying(false)
      setCurrentWordIndex(-1)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    setUtterance(newUtterance)
    speechSynthesis.speak(newUtterance)
  }, [speechSynthesis, rhyme, startWordHighlighting])

  const pauseRhyme = useCallback(() => {
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [speechSynthesis])

  const resetRhyme = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setCurrentWordIndex(-1)
    setProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [speechSynthesis])

  if (!rhyme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Rhyme not found</h1>
            <Link href="/rhymes">
              <Button>← Back to Rhymes</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/rhymes">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rhymes
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">{rhyme.title}</h1>
          <Button onClick={resetRhyme} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="text-lg md:text-xl leading-relaxed font-medium text-gray-800">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className={`transition-all duration-200 ${
                        index === currentWordIndex
                          ? "bg-yellow-300 text-yellow-900 px-1 rounded shadow-sm scale-110 font-bold"
                          : index < currentWordIndex
                            ? "text-gray-500"
                            : "text-gray-800"
                      }`}
                      style={{
                        display: word.includes("\n") ? "block" : "inline",
                        marginRight: word.includes("\n") ? "0" : "0.25rem",
                      }}
                    >
                      {word.replace(/\n/g, "")}
                      {word.includes("\n") && <br />}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4">
              <Button
                onClick={isPlaying ? pauseRhyme : playRhyme}
                size="lg"
                className={`${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Play Rhyme
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Volume2 className="w-4 h-4 mr-2" />
                  Playback Progress
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{Math.round(progress)}% complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">How it works</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Click "Play Rhyme" to start</li>
                  <li>• Words will highlight as they're spoken</li>
                  <li>• Follow along with the yellow highlighting</li>
                  <li>• Use "Reset" to start over</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Word Count</h3>
                <p className="text-2xl font-bold text-yellow-600">{words.length}</p>
                <p className="text-sm text-gray-600">words in this rhyme</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
