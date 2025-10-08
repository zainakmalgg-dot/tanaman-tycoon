// FIX: Import `ReactNode` to make React types available in this file.
import type { ReactNode } from 'react';

export type SeedType = 'mango' | 'cacao' | 'grape' | 'bamboo' | 'strawberry' | 'apple' | 'beanstalk' | 'emberlily' | 'jasmine';

export type PlantVariant = 'normal' | 'gold' | 'rainbow' | 'gold_rainbow';

export type WeatherType = 'sunny' | 'rainy' | 'cloudy';

export type PetType = 'racoon' | 'griffin' | 'chicken' | 'fox' | 'ulat' | 'glitch' | 'glitchFox' | 'golemGlitch';
export type GlitchPetType = 'glitch' | 'glitchFox' | 'golemGlitch';

export type MutationType = 'windy' | 'ascended' | 'gold' | 'gatal' | 'diamond' | 'glitch' | 'glitch_infected';


export interface Pet {
  name: string;
  icon: ReactNode;
  description: string;
}

export interface Seed {
  name:string;
  cost: number;
  plantGrowTime: number; // in seconds, time to become a mature plant
  fruitGrowTime: number; // in seconds, time for a mature plant to bear fruit
  sellPrice: {
    min: number;
    max: number;
  };
  // FIX: Use `ReactNode` instead of `JSX.Element` to avoid namespace errors in a .ts file.
  icon: ReactNode;
  plantIcon: ReactNode;
  singleHarvest?: boolean;
}

export interface Plant {
  id: number;
  type: SeedType | null;
  plantedAt: number | null;
  nextPhaseAt: number | null;
  status: 'empty' | 'growing' | 'fruiting' | 'ready';
  boosted?: boolean;
  variant: PlantVariant;
  isNew?: boolean;
  mutations: MutationType[];
}

export interface Inventory {
  seeds: Record<SeedType, number>;
  fruits: Record<SeedType, number>;
  boostedFruits: Record<SeedType, number>;
  racoonInfectedFruits: Record<SeedType, number>;
  wateringCans: number;
  sizeBonus: number;
  superDuperSpeed: number;
  pets: Record<PetType, number>;
  equippedPets: (PetType | null)[];
  petShardGold: number;
  petShardDiamond: number;
  petShardRainbow: number;
  goldenPets: PetType[];
  diamondPets: PetType[];
  rainbowPets: PetType[];
  petAges: Record<PetType, number>;
}

export interface NotificationMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

// FIX: Define and export the missing `MutationState` type, which is used in `PetMutationMachine.tsx`.
export interface MutationState {
  isMutating: boolean;
  petType: PetType | null;
  endTime: number | null;
}