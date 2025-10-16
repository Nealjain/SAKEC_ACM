"use client"

import { useState, useEffect } from "react"

const messages = [
  "Innovation Through Code",
  "Future Tech Leaders",
  "Creative Problem Solving",
  "Collaborative Learning Hub",
  "Excellence In Computing",
  "Tomorrow's Technology Today",
]

export default function TypingEffect() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentMessage = messages[currentMessageIndex]

    if (isTyping) {
      if (displayedText.length < currentMessage.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        setIsTyping(true)
      }
    }
  }, [displayedText, isTyping, currentMessageIndex])

  return (
    <p className="text-lg text-gray-300 mb-6 leading-relaxed h-12 flex items-center">
      {displayedText}
      <span className="animate-pulse ml-1">|</span>
    </p>
  )
}
