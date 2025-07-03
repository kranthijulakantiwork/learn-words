"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, Clock, Star } from "lucide-react"

const rhymes = [
  {
    id: "twinkle-twinkle",
    title: "Twinkle Twinkle Little Star",
    description: "A classic nursery rhyme about a shining star",
    duration: "30 seconds",
    difficulty: "Easy",
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
    description: "The story of Mary and her faithful lamb",
    duration: "25 seconds",
    difficulty: "Easy",
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
    description: "The tale of Humpty Dumpty's great fall",
    duration: "20 seconds",
    difficulty: "Easy",
    text: `Humpty Dumpty sat on a wall,
Humpty Dumpty had a great fall.
All the king's horses and all the king's men,
Couldn't put Humpty together again.`,
  },
  {
    id: "baa-baa-black-sheep",
    title: "Baa Baa Black Sheep",
    description: "A sheep sharing its wool with everyone",
    duration: "25 seconds",
    difficulty: "Easy",
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
    description: "A farmer and all his animal friends",
    duration: "45 seconds",
    difficulty: "Medium",
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
    description: "A gentle boat ride down the stream",
    duration: "20 seconds",
    difficulty: "Easy",
    text: `Row, row, row your boat,
Gently down the stream.
Merrily, merrily, merrily, merrily,
Life is but a dream.`,
  },
]

export default function RhymesListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Choose a Rhyme</h1>
          <div></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rhymes.map((rhyme) => (
            <Card key={rhyme.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Music className="w-6 h-6 text-yellow-600" />
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rhyme.difficulty === "Easy" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {rhyme.difficulty}
                  </span>
                </div>
                <CardTitle className="text-xl">{rhyme.title}</CardTitle>
                <CardDescription>{rhyme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {rhyme.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Popular
                  </div>
                </div>
                <Link href={`/rhymes/${rhyme.id}`}>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Listen to Rhyme</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">Click on any rhyme to listen and follow along with highlighted words</p>
        </div>
      </div>
    </div>
  )
}
