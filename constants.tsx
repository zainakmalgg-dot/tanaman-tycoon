import React from 'react';
import type { SeedType, Seed, Pet, PetType, GlitchPetType } from './types';

const MangoIcon = () => <span className="text-4xl">🥭</span>;
const CacaoIcon = () => <span className="text-4xl">🌰</span>;
const GrapeIcon = () => <span className="text-4xl">🍇</span>;
const BambooIcon = () => <span className="text-4xl">🎋</span>;
const StrawberryIcon = () => <span className="text-4xl">🍓</span>;
const AppleIcon = () => <span className="text-4xl">🍎</span>;
const BeanstalkIcon = () => <span className="text-4xl">🌱</span>;
const EmberlilyIcon = () => <span className="text-4xl">🏵️</span>;
const JasmineIcon = () => <span className="text-4xl">💮</span>;


const MangoPlantIcon = () => <div className="text-6xl animate-pulse">🌳</div>;
const CacaoPlantIcon = () => <div className="text-6xl animate-pulse">🌿</div>;
const GrapePlantIcon = () => <div className="text-6xl animate-pulse">🍇</div>;
const BambooPlantIcon = () => <div className="text-6xl animate-pulse">🎍</div>;
const StrawberryPlantIcon = () => <div className="text-6xl animate-pulse">🍓</div>;
const ApplePlantIcon = () => <div className="text-6xl animate-pulse">🌳</div>;
const BeanstalkPlantIcon = () => <div className="text-6xl animate-pulse">🌱</div>;
const EmberlilyPlantIcon = () => <div className="text-6xl animate-pulse">🏵️</div>;
const JasminePlantIcon = () => <div className="text-6xl animate-pulse">💮</div>;


export const SEED_DATA: Record<SeedType, Seed> = {
  mango: {
    name: 'Mangga',
    cost: 10,
    plantGrowTime: 20, 
    fruitGrowTime: 120,
    sellPrice: { min: 20, max: 25 },
    icon: <MangoIcon />,
    plantIcon: <MangoPlantIcon />,
  },
  cacao: {
    name: 'Kakao',
    cost: 50,
    plantGrowTime: 60,
    fruitGrowTime: 240,
    sellPrice: { min: 40, max: 43 },
    icon: <CacaoIcon />,
    plantIcon: <CacaoPlantIcon />,
  },
  grape: {
    name: 'Anggur',
    cost: 100,
    plantGrowTime: 120,
    fruitGrowTime: 300,
    sellPrice: { min: 50, max: 80 },
    icon: <GrapeIcon />,
    plantIcon: <GrapePlantIcon />,
  },
  bamboo: {
    name: 'Bambu',
    cost: 200,
    plantGrowTime: 240, // 4 minutes
    fruitGrowTime: 0, // Not applicable
    sellPrice: { min: 90, max: 100 },
    icon: <BambooIcon />,
    plantIcon: <BambooPlantIcon />,
    singleHarvest: true,
  },
  strawberry: {
    name: 'Stroberi',
    cost: 500,
    plantGrowTime: 180, // 3 minutes
    fruitGrowTime: 360, // 6 minutes
    sellPrice: { min: 100, max: 300 },
    icon: <StrawberryIcon />,
    plantIcon: <StrawberryPlantIcon />,
  },
  apple: {
    name: 'Apel',
    cost: 1200,
    plantGrowTime: 200,
    fruitGrowTime: 400,
    sellPrice: { min: 800, max: 865 },
    icon: <AppleIcon />,
    plantIcon: <ApplePlantIcon />,
  },
  beanstalk: {
    name: 'Kacang Ajaib',
    cost: 1500,
    plantGrowTime: 600,
    fruitGrowTime: 0,
    sellPrice: { min: 800, max: 900 },
    icon: <BeanstalkIcon />,
    plantIcon: <BeanstalkPlantIcon />,
    singleHarvest: true,
  },
  emberlily: {
    name: 'Emberlily',
    cost: 2300,
    plantGrowTime: 300,
    fruitGrowTime: 600,
    sellPrice: { min: 1000, max: 2900 },
    icon: <EmberlilyIcon />,
    plantIcon: <EmberlilyPlantIcon />,
    singleHarvest: false,
  },
  jasmine: {
    name: 'Melati',
    cost: 2900,
    plantGrowTime: 400,
    fruitGrowTime: 800,
    sellPrice: { min: 1900, max: 2999 },
    icon: <JasmineIcon />,
    plantIcon: <JasminePlantIcon />,
    singleHarvest: false,
  },
};

const RacoonIcon = () => <span className="text-3xl">🦝</span>;
const GriffinIcon = () => <span className="text-3xl">🦅</span>;
const ChickenIcon = () => <span className="text-3xl">🐔</span>;
const FoxIcon = () => <span className="text-3xl">🦊</span>;
const UlatIcon = () => <span className="text-3xl">🐛</span>;
const GlitchIcon = () => <span className="text-3xl">👾</span>;
const GlitchFoxIcon = () => <span className="text-3xl">🦊</span>;
const GolemGlitchIcon = () => <span className="text-3xl">🗿</span>;


export const PET_DATA: Record<PetType, Pet> = {
  racoon: {
    name: 'Racoon',
    icon: <RacoonIcon />,
    description: 'Setiap 4 menit, memberikan buah acak dengan mutasi "Racoon Infected" (harga jual x80).',
  },
  griffin: {
    name: 'Griffin',
    icon: <GriffinIcon />,
    description: 'Setiap 2 menit, dapat memberikan mutasi "Windy" (panen x11) atau "Ascended" (panen x54) ke tanaman yang siap panen.',
  },
  chicken: {
    name: 'Chicken',
    icon: <ChickenIcon />,
    description: 'Mempercepat semua pertumbuhan tanaman sebanyak 30%. Efek ini dapat ditumpuk.',
  },
  fox: {
    name: 'Fox',
    icon: <FoxIcon />,
    description: 'Setiap 4 menit, memberikan 1 bibit acak (peluang berdasarkan kelangkaan bibit). 1% kemungkinan bibit menjadi pelangi.',
  },
  ulat: {
    name: 'Ulat',
    icon: <UlatIcon />,
    description: 'Setiap 2 menit, memberikan mutasi "Gatal" (panen x100) pada tanaman. Pet lain menua 1 menit lebih cepat per Ulat yang dipasang.',
  },
  glitch: {
    name: 'Glitch Pet',
    icon: <GlitchIcon />,
    description: 'Setiap 2 menit, menjilat tanaman acak. 19% peluang memberi mutasi "Glitch" (panen x19).',
  },
  glitchFox: {
    name: 'Glitch Fox',
    icon: <GlitchFoxIcon />,
    description: 'Setiap 7 menit, berteriak dan memberikan 1 alat acak (peluang berdasarkan kelangkaan alat).',
  },
  golemGlitch: {
    name: 'Golem Glitch',
    icon: <GolemGlitchIcon />,
    description: 'Setiap 2 menit, merusak tanaman acak, memberikan mutasi "Terkorupsi" (Glitch x19 + Infected x6).',
  },
};

export const PET_EGG_WEIGHTS: Record<PetType, number> = {
  racoon: 10,     // 1%
  griffin: 158,   // ~15.8%
  chicken: 302,   // ~30.2%
  fox: 525,       // ~52.5%
  ulat: 5,        // 0.5%
  glitch: 0,
  glitchFox: 0,
  golemGlitch: 0,
};

export const GLITCH_EGG_WEIGHTS: Record<GlitchPetType, number> = {
  glitch: 43,
  glitchFox: 56.57,
  golemGlitch: 0.43,
};


export const INITIAL_MONEY = 10;
export const INITIAL_PLOTS = 6;