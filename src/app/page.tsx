// pages/index.tsx

import { FlashcardDeck } from '@/components/flash-card-deck';

const words = [
  'Ameliorate',
  'Amelioration',
  'Proliferate',
  'Proliferation',
  'Exacerbate',
  'Exacerbation',
  'Mitigate',
  'Mitigation',
  'Alleviate',
  'Alleviation',
  'Facilitate',
  'Facilitation',
  'Consolidate',
  'Consolidation',
  'Expedite',
  'Expedition',
  'Obfuscate',
  'Obfuscation',
  'Perpetuate',
  'Perpetuation',
  'Substantiate',
  'Substantiation',
  'Synthesize',
  'Synthesis',
  'Disseminate',
  'Dissemination',
  'Corroborate',
  'Corroboration',
  'Elucidate',
  'Elucidation',
  'Antagonize',
  'Antagonism',
  'Extrapolate',
  'Extrapolation',
  'Obsolete',
  'Obsolescence',
  'Exemplify',
  'Exemplification',
  'Quantify',
  'Quantification',
];
export default function Home() {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-200'>
      <FlashcardDeck words={words} />
    </div>
  );
}
