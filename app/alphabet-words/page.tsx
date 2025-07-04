"use client";

import { useState } from "react";
import Image from "next/image";
import SpeechLearningLayout from "@/components/speech-learning-layout";

const alphabetWords = [
  {
    letter: "A",
    word: "Apple",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
  },
  {
    letter: "B",
    word: "Ball",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
  },
  {
    letter: "C",
    word: "Cat",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
  },
  {
    letter: "D",
    word: "Dog",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
  },
  {
    letter: "E",
    word: "Elephant",
    image:
      "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=200&h=200&fit=crop",
  },
  {
    letter: "F",
    word: "Fish",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop",
  },
  {
    letter: "G",
    word: "Giraffe",
    image:
      "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=200&h=200&fit=crop",
  },
  {
    letter: "H",
    word: "House",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop",
  },
  {
    letter: "I",
    word: "Ice cream",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&h=200&fit=crop",
  },
  {
    letter: "J",
    word: "Juice",
    image:
      "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=200&h=200&fit=crop",
  },
  {
    letter: "K",
    word: "Kite",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
  {
    letter: "L",
    word: "Lion",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=200&h=200&fit=crop",
  },
  {
    letter: "M",
    word: "Monkey",
    image:
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=200&h=200&fit=crop",
  },
  {
    letter: "N",
    word: "Nest",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
  },
  {
    letter: "O",
    word: "Orange",
    image:
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
  },
  {
    letter: "P",
    word: "Penguin",
    image:
      "https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=200&h=200&fit=crop",
  },
  {
    letter: "Q",
    word: "Queen",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
  },
  {
    letter: "R",
    word: "Rabbit",
    image:
      "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop",
  },
  {
    letter: "S",
    word: "Sun",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
  },
  {
    letter: "T",
    word: "Tiger",
    image:
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=200&h=200&fit=crop",
  },
  {
    letter: "U",
    word: "Umbrella",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop",
  },
  {
    letter: "V",
    word: "Violin",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    letter: "W",
    word: "Whale",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop",
  },
  {
    letter: "X",
    word: "Xylophone",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
  },
  {
    letter: "Y",
    word: "Yacht",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop",
  },
  {
    letter: "Z",
    word: "Zebra",
    image:
      "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=200&h=200&fit=crop",
  },
];

export default function AlphabetWordsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  const renderAlphabetWord = (item: string, index: number) => {
    const wordData = alphabetWords[index];
    return (
      <div className="text-center">
        <div className="text-6xl font-bold text-green-600 mb-4">
          {wordData.letter}
        </div>
        <Image
          src={wordData.image || "/placeholder.svg"}
          alt={wordData.word}
          width={200}
          height={200}
          className="mx-auto mb-4 rounded-lg shadow-lg"
          crossOrigin="anonymous"
        />
        <div className="text-3xl font-semibold text-gray-800 mb-2">
          {wordData.word}
        </div>
        <p className="text-xl text-gray-600">
          Say "{wordData.letter} for {wordData.word}"
        </p>
      </div>
    );
  };

  const items = alphabetWords.map((item) => `${item.letter} for ${item.word}`);

  return (
    <SpeechLearningLayout
      items={items}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      onRestart={handleRestart}
      title="Alphabet Words"
      renderItem={renderAlphabetWord}
      expectedSpeech={(item) => item}
    />
  );
}
