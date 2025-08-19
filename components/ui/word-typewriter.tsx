"use client";

import { useEffect, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WordTypewriterProps {
  words: ReactNode[];
  duration?: number;
  typingSpeed?: number;
  className?: string;
}

function WordTypewriter({
  words,
  duration = 3000,
  typingSpeed = 50,
  className,
}: WordTypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    // Extract text content from ReactNode for typing effect
    const getTextFromNode = (node: ReactNode): string => {
      if (typeof node === 'string') return node;
      if (typeof node === 'number') return node.toString();
      if (!node) return '';
      
      // For components with children (like our wordComponent spans)
      if (typeof node === 'object' && 'props' in node && node.props.children) {
        const children = node.props.children;
        if (Array.isArray(children)) {
          return children
            .filter(child => typeof child === 'string')
            .join('');
        }
        if (typeof children === 'string') return children;
      }
      
      return '';
    };

    const fullText = getTextFromNode(currentWord);
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < fullText.length) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? typingSpeed / 2 : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, currentWordIndex, isDeleting, words, typingSpeed]);

  // Cursor blink effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorTimer);
  }, []);

  // Get the original ReactNode with icons
  const currentWord = words[currentWordIndex];
  
  // Check if the current word has an icon
  const hasIcon = typeof currentWord === 'object' && 
    'props' in currentWord && 
    currentWord.props.children && 
    Array.isArray(currentWord.props.children) &&
    currentWord.props.children.length > 1;

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {hasIcon && typeof currentWord === 'object' && 'props' in currentWord ? (
        <>
          {/* Show icon immediately - already wrapped in consistent container */}
          {currentWord.props.children[0]}
          {/* Type out the text */}
          <span>
            {currentText}
            <span 
              className={cn(
                "inline-block w-[2px] h-[1.2em] bg-current ml-[1px] align-text-bottom",
                showCursor ? "opacity-100" : "opacity-0"
              )}
            />
          </span>
        </>
      ) : (
        <span>
          {currentText}
          <span 
            className={cn(
              "inline-block w-[2px] h-[1.2em] bg-current ml-[1px] align-text-bottom",
              showCursor ? "opacity-100" : "opacity-0"
            )}
          />
        </span>
      )}
    </span>
  );
}

export default WordTypewriter;
