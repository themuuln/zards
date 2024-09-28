'use client';

import React, { useState, useEffect } from 'react';
import { CalendarIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Flashcard {
  id: number;
  word: string;
  definition: string;
}

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedStreak = localStorage.getItem('streak');
    const storedLastReviewDate = localStorage.getItem('lastReviewDate');
    if (storedStreak) setStreak(parseInt(storedStreak));
    if (storedLastReviewDate) setLastReviewDate(storedLastReviewDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('streak', streak.toString());
    if (lastReviewDate) localStorage.setItem('lastReviewDate', lastReviewDate);
  }, [streak, lastReviewDate]);

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastReviewDate !== today) {
      if (lastReviewDate === new Date(Date.now() - 86400000).toDateString()) {
        setStreak(streak + 1);
      } else {
        setStreak(1);
      }
      setLastReviewDate(today);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const fetchDefinition = async (word: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      if (!response.ok) throw new Error('Word not found');
      const data = await response.json();
      return data[0].meanings[0].definitions[0].definition;
    } catch (error) {
      console.error('Error fetching definition:', error);
      return 'Definition not found';
    }
  };

  const handleAddFlashcards = async () => {
    setIsLoading(true);
    setError(null);
    const words = inputValue
      .split(',')
      .map((word) => word.trim())
      .filter((word) => word !== '');
    const newFlashcards: Flashcard[] = [];

    for (const word of words) {
      const definition = await fetchDefinition(word);
      newFlashcards.push({
        id: Date.now() + newFlashcards.length,
        word,
        definition,
      });
    }

    setFlashcards([...flashcards, ...newFlashcards]);
    setInputValue('');
    setIsLoading(false);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
    if (!showAnswer) updateStreak();
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length,
    );
    setShowAnswer(false);
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md mb-4'>
        <CardContent className='p-6'>
          <div className='flex flex-col mb-4'>
            <label
              htmlFor='words-input'
              className='mb-2 text-sm font-medium text-gray-700'
            >
              Enter words (comma-separated):
            </label>
            <input
              id='words-input'
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              className='w-full px-3 py-2 border text-gray-700 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter words separated by commas'
            />
          </div>
          <Button
            onClick={handleAddFlashcards}
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Flashcards'}
          </Button>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </CardContent>
      </Card>

      {flashcards.length > 0 ? (
        <Card className='w-full max-w-md'>
          <CardContent className='p-6'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-bold'>Flashcards</h2>
              <div className='flex items-center'>
                <CalendarIcon className='w-5 h-5 mr-2' />
                <span className='font-semibold'>{streak} day streak</span>
              </div>
            </div>
            <div
              className='bg-white p-6 rounded-lg shadow-md mb-4 min-h-[200px] flex items-center justify-center cursor-pointer'
              onClick={flipCard}
            >
              <p className='text-center text-lg'>
                {showAnswer
                  ? flashcards[currentCardIndex].definition
                  : flashcards[currentCardIndex].word}
              </p>
            </div>
            <div className='flex justify-between'>
              <Button onClick={prevCard} variant='outline'>
                <ArrowLeftIcon className='w-4 h-4 mr-2' />
                Previous
              </Button>
              <Button onClick={nextCard}>
                Next
                <ArrowRightIcon className='w-4 h-4 ml-2' />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className='text-gray-600'>Please enter some words to start.</p>
      )}
    </div>
  );
}
