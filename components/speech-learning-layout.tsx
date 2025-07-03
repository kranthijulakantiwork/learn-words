"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Mic,
  MicOff,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import type SpeechRecognition from "speech-recognition";

interface SpeechLearningLayoutProps {
  items: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onRestart: () => void;
  title: string;
  renderItem: (item: string, index: number) => React.ReactNode;
  expectedSpeech?: (item: string) => string;
}

export default function SpeechLearningLayout({
  items,
  currentIndex,
  onIndexChange,
  onRestart,
  title,
  renderItem,
  expectedSpeech,
}: SpeechLearningLayoutProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({
    type: "",
    message: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        setRecognition(recognition);
      }
      setSpeechSynthesis(window.speechSynthesis);
    }

    return () => {
      window.speechSynthesis && window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (speechSynthesis) {
      handleSpeak();

      /*if(autoAdvance) {
          setTimeout(() => nextItem(), 2000)
        } */
    }
  }, [currentIndex, speechSynthesis, autoAdvance]);

  useEffect(() => {
    if (autoAdvance) {
      setTimeout(() => nextItem(), 2000);
    }
  }, [autoAdvance]);

  /*useEffect(() => {
    if(speechSynthesis && !speechSynthesis.speaking) {
      nextItem()
      handleSpeak()
    }
  }, [speechSynthesis]);
  console.log('speechSynthesis.speaking', speechSynthesis ? speechSynthesis.speaking: speechSynthesis);*/

  const speakText = useCallback(
    (text: string) => {
      if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.5;
        utterance.pitch = 0.5;
        speechSynthesis.speak(utterance);
        utterance.onend = function (event) {
          if (autoAdvance) setTimeout(() => nextItem(), 500);
          console.log("ended");
        };
      }
    },
    [speechSynthesis, currentIndex]
  );

  const startListening = useCallback(() => {
    if (!recognition) {
      setFeedback({
        type: "error",
        message: "Speech recognition not supported in this browser",
      });
      return;
    }

    setIsListening(true);
    setTranscript("");
    setFeedback({ type: "", message: "" });
    console.log("yo");

    recognition.onresult = (event) => {
      try {
        const result = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(result);

        const currentItem = items[currentIndex];
        const expected = expectedSpeech
          ? expectedSpeech(currentItem).toLowerCase()
          : currentItem.toLowerCase();

        console.log("result", result, "expected", expected);

        if (result === expected || result.includes(expected)) {
          setFeedback({ type: "success", message: "Correct! Well done!" });
          if (autoAdvance && currentIndex < items.length - 1) {
            setTimeout(() => {
              onIndexChange(currentIndex + 1);
              setTranscript("");
              setFeedback({ type: "", message: "" });
            }, 1500);
          }
        } else {
          setFeedback({
            type: "error",
            message: `Try again! Say "${expected}"`,
          });
        }
      } catch (error) {
        console.error("Error processing speech recognition result:", error);
        setFeedback({
          type: "error",
          message: "Error processing your speech. Please try again.",
        });
      }
    };

    recognition.onerror = (event) => {
      setFeedback({
        type: "error",
        message: "Speech recognition error. Please try again.",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [
    recognition,
    currentIndex,
    items,
    expectedSpeech,
    autoAdvance,
    onIndexChange,
  ]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  }, [recognition]);

  const nextItem = () => {
    if (currentIndex < items.length - 1) {
      onIndexChange(currentIndex + 1);
      setTranscript("");
      setFeedback({ type: "", message: "" });
    }
  };

  const prevItem = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      setTranscript("");
      setFeedback({ type: "", message: "" });
    }
  };

  const handleRestart = () => {
    onRestart();
    setTranscript("");
    setFeedback({ type: "", message: "" });
  };

  const handleSpeak = () => {
    const currentItem = items[currentIndex];
    const textToSpeak = expectedSpeech
      ? expectedSpeech(currentItem)
      : currentItem;
    speakText(textToSpeak.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="outline">← Back to Home</Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                {renderItem(items[currentIndex], currentIndex)}
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                onClick={prevItem}
                disabled={currentIndex === 0}
                variant="outline"
                size="lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <span className="text-lg font-medium px-4">
                {currentIndex + 1} of {items.length}
              </span>

              <Button
                onClick={nextItem}
                disabled={currentIndex === items.length - 1}
                variant="outline"
                size="lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="auto-advance"
                    checked={autoAdvance}
                    onCheckedChange={setAutoAdvance}
                  />
                  <Label htmlFor="auto-advance">Auto advance</Label>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleSpeak}
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Hear Pronunciation
                  </Button>

                  <Button
                    onClick={isListening ? stopListening : startListening}
                    className={`w-full ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    disabled={!recognition}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Listening
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Speaking
                      </>
                    )}
                  </Button>
                </div>

                {transcript && (
                  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">You said:</p>
                    <p className="font-medium">"{transcript}"</p>
                  </div>
                )}

                {feedback.message && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      feedback.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <p className="font-medium">{feedback.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Progress</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentIndex + 1) / items.length) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {currentIndex + 1} of {items.length} completed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
