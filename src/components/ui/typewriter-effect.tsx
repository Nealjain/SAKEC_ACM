import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetweenTexts?: number;
}

export const TypewriterEffect = ({
  texts,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenTexts = 10000, // 10 seconds
}: TypewriterEffectProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const targetText = texts[currentTextIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, delayBetweenTexts);
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting && currentText === targetText) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        if (isDeleting) {
          setCurrentText(targetText.substring(0, currentText.length - 1));
        } else {
          setCurrentText(targetText.substring(0, currentText.length + 1));
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentTextIndex,
    isDeleting,
    isPaused,
    texts,
    typingSpeed,
    deletingSpeed,
    delayBetweenTexts,
  ]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};


// TypewriterEffectSmooth component for word-by-word animation
interface Word {
  text: string;
  className?: string;
}

interface TypewriterEffectSmoothProps {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}

export const TypewriterEffectSmooth = ({
  words,
  className = "",
  cursorClassName = "",
}: TypewriterEffectSmoothProps) => {
  const wordsArray = words.map((word) => word.text);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentWordIndex >= words.length) {
      setIsComplete(true);
      return;
    }

    const targetWord = wordsArray[currentWordIndex];
    
    if (currentText.length < targetWord.length) {
      const timeout = setTimeout(() => {
        setCurrentText(targetWord.substring(0, currentText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
        setCurrentText("");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentText, currentWordIndex, wordsArray, words.length]);

  return (
    <div className={`flex space-x-1 my-6 ${className}`}>
      {words.map((word, idx) => {
        if (idx < currentWordIndex) {
          return (
            <div key={idx} className={`text-2xl md:text-4xl lg:text-5xl font-bold ${word.className || "text-gray-900"}`}>
              {word.text}
            </div>
          );
        } else if (idx === currentWordIndex) {
          return (
            <div key={idx} className={`text-2xl md:text-4xl lg:text-5xl font-bold ${word.className || "text-gray-900"}`}>
              {currentText}
              {!isComplete && <span className={`inline-block w-0.5 h-8 md:h-12 bg-gray-900 animate-pulse ml-1 ${cursorClassName}`} />}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
