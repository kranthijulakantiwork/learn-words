import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, Mic, Hash, Music, SpellCheckIcon as Spellcheck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">Speech Learning App</h1>
          <p className="text-lg text-gray-600 mb-8">
            Learn alphabets, numbers, rhymes and spelling with interactive speech recognition
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Volume2 className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-lg">Learn Alphabets</CardTitle>
              <CardDescription className="text-sm">
                Practice pronouncing letters A-Z with speech recognition
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/alphabets">
                <Button className="w-full bg-red-500 hover:bg-red-600">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">Alphabet Words</CardTitle>
              <CardDescription className="text-sm">
                Learn words like "A for Apple" with images and speech
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/alphabet-words">
                <Button className="w-full bg-green-500 hover:bg-green-600">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Hash className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Learn Numbers</CardTitle>
              <CardDescription className="text-sm">
                Practice counting and number recognition with speech
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/numbers">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Music className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">Learn Rhymes</CardTitle>
              <CardDescription className="text-sm">
                Listen to nursery rhymes with word-by-word highlighting
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/rhymes">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Spellcheck className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Spelling Words</CardTitle>
              <CardDescription className="text-sm">
                Learn to spell words letter by letter with audio guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/spelling">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">Make sure to allow microphone access for speech recognition to work</p>
        </div>
      </div>
    </div>
  )
}
