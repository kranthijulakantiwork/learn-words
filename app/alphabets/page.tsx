"use client";

import { useState } from "react";
import SpeechLearningLayout from "@/components/speech-learning-layout";

const alphabets = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export default function AlphabetsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  const renderAlphabet = (letter: string) => (
    <div className="text-center">
      <div className="text-8xl md:text-9xl font-bold text-blue-600 mb-4">
        {letter}
      </div>
      <p className="text-2xl text-gray-600">
        Say the letter &ldquo;{letter}&rdquo;
      </p>
    </div>
  );

  return (
    <SpeechLearningLayout
      items={alphabets}
      currentIndex={currentIndex}
      onIndexChange={setCurrentIndex}
      onRestart={handleRestart}
      title="Learn Alphabets"
      renderItem={renderAlphabet}
      expectedSpeech={(letter) => letter}
    />
  );
}
