'use client';

import React, { useState } from 'react';
import { Flashcard } from '../flash-card';

interface FlashcardDeckProps {
  words: string[];
}

export function FlashcardDeck({ words }: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextWord = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
  };

  const handlePreviousWord = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + words.length) % words.length,
    );
  };

  return (
    <div className='flex flex-col items-center'>
      <Flashcard
        word={words[currentIndex]}
        onNextWord={handleNextWord}
        onPreviousWord={handlePreviousWord}
      />
      <p className='mt-4'>
        Card {currentIndex + 1} of {words.length}
      </p>
    </div>
  );
}
