'use client';

import { FlashcardDeck } from '@/components/flash-card-deck';
import React, { useState } from 'react';

export default function Home() {
  const [words, setWords] = useState<string[]>(['eat', 'sleep', 'gamble']);
  const [inputValue, setInputValue] = useState('eat, sleep, gamble');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const newWords = e.target.value
      .split(',')
      .map((word) => word.trim())
      .filter((word) => word !== '');
    setWords(newWords);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4'>
      <div className='w-full max-w-md mb-8'>
        <label
          htmlFor='words-input'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          Enter words (comma-separated):
        </label>
        <input
          id='words-input'
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Enter words separated by commas'
        />
      </div>
      {words.length > 0 ? (
        <FlashcardDeck words={words} />
      ) : (
        <p className='text-gray-600'>Please enter some words to start.</p>
      )}
    </div>
  );
}
