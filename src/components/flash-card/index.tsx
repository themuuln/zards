'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface FlashcardProps {
  word: string;
  onNextWord: () => void;
  onPreviousWord: () => void;
}

interface WordData {
  word: string;
  phonetics: Array<{
    text?: string;
    audio?: string;
  }>;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
    }>;
  }>;
}

export function Flashcard({
  word,
  onNextWord,
  onPreviousWord,
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWordData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<WordData[]>(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        );
        setWordData(response.data[0]);
        setError(null);
      } catch (err) {
        setError('Failed to fetch word information');
        setWordData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordData();
  }, [word]);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  const playAudio = () => {
    const audioUrl = wordData?.phonetics.find((p) => p.audio)?.audio;
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  };

  if (isLoading) return <div className='text-center'>Loading...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

  return (
    <div className='relative w-96 h-80 text-black'>
      <div
        className='perspective-1000 w-full h-full cursor-pointer'
        onClick={handleClick}
      >
        <motion.div
          className='w-full h-full relative'
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className='absolute w-full h-full flex flex-col justify-center items-center rounded-lg shadow-md bg-gray-100 p-4'
            style={{ backfaceVisibility: 'hidden' }}
          >
            <h2 className='text-3xl font-bold mb-2'>{wordData?.word}</h2>
            <div className='flex items-center mb-4'>
              <p className='text-xl text-gray-600 mr-2'>
                {wordData?.phonetics.find((p) => p.text)?.text}
              </p>
              {wordData?.phonetics.some((p) => p.audio) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  className='bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                >
                  🔊
                </button>
              )}
            </div>
          </motion.div>
          <motion.div
            className='absolute w-full h-full flex flex-col justify-center items-center rounded-lg shadow-md bg-blue-100 p-4'
            style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
          >
            <h3 className='text-xl font-semibold mb-2'>
              {wordData?.meanings[0]?.partOfSpeech}
            </h3>
            <p className='text-center'>
              {wordData?.meanings[0]?.definitions[0]?.definition ||
                'No definition available'}
            </p>
          </motion.div>
        </motion.div>
      </div>
      <button
        className='absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={(e) => {
          e.stopPropagation();
          onPreviousWord();
        }}
      >
        ←
      </button>
      <button
        className='absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
        onClick={(e) => {
          e.stopPropagation();
          onNextWord();
        }}
      >
        →
      </button>
    </div>
  );
}
