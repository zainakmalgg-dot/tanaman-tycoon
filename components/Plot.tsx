import React, { useState, useEffect } from 'react';
import type { Plant, MutationType } from '../types';
import { SEED_DATA } from '../constants';

interface PlotProps {
  plant: Plant;
  onPlotClick: (plotId: number) => void;
  isShovelSelected: boolean;
  isWateringCanSelected: boolean;
  isSizeBonusSelected: boolean;
  isSuperDuperSpeedSelected: boolean;
}

const Plot: React.FC<PlotProps> = ({ plant, onPlotClick, isShovelSelected, isWateringCanSelected, isSizeBonusSelected, isSuperDuperSpeedSelected }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if ((plant.status === 'growing' || plant.status === 'fruiting') && plant.nextPhaseAt && plant.type) {
      const updateTimer = () => {
        const remaining = Math.max(0, plant.nextPhaseAt! - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
      };

      updateTimer(); // Initial call
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [plant.status, plant.nextPhaseAt, plant.type]);

  const getVariantClasses = () => {
    switch (plant.variant) {
      case 'gold':
        return 'text-yellow-400';
      case 'rainbow':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-pulse';
      case 'gold_rainbow':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 animate-pulse';
      default:
        return 'text-green-400';
    }
  };

  const getPrimaryMutation = () => {
    if (!plant.mutations || plant.mutations.length === 0) return null;
    const priority: MutationType[] = ['glitch_infected', 'diamond', 'ascended', 'gatal', 'glitch', 'gold', 'windy'];
    return priority.find(p => plant.mutations.includes(p)) || plant.mutations[0];
  }
  
  const getMutationClasses = () => {
    const primaryMutation = getPrimaryMutation();
    switch (primaryMutation) {
        case 'windy':
            return 'text-cyan-300 animate-pulse';
        case 'ascended':
            return 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 animate-pulse font-extrabold';
        case 'gold':
            return 'text-yellow-400 animate-pulse font-bold';
        case 'gatal':
            return 'text-red-400 animate-pulse font-bold';
        case 'diamond':
            return 'text-blue-300 animate-pulse font-extrabold';
        case 'glitch':
            return 'text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-purple-500 animate-pulse font-extrabold [text-shadow:0_0_5px_#fff]';
        case 'glitch_infected':
            return 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-gray-700 to-black animate-pulse font-black [text-shadow:0_0_8px_#f00]';
        default:
            return '';
    }
  }

  const renderContent = () => {
    switch (plant.status) {
      case 'empty':
        return (
          <div className="text-center">
            <p className="text-5xl text-gray-600">+</p>
            <p className="text-gray-500 mt-2">Tanah Kosong</p>
          </div>
        );
      case 'growing':
        if (!plant.type) return null;
        return (
          <div className="text-center">
            {SEED_DATA[plant.type].plantIcon}
            <p className="font-bold mt-2">Tumbuh...</p>
            <p className="text-lg font-mono text-yellow-300">{timeLeft}s</p>
          </div>
        );
      case 'fruiting':
        if (!plant.type) return null;
        // Plant icon without pulse for mature plant
        const MaturePlantIcon = () => <div className="text-6xl">🌳</div>;
        return (
          <div className="text-center">
            {plant.type === 'mango' ? <MaturePlantIcon/> : SEED_DATA[plant.type].plantIcon}
            <p className="font-bold mt-2">Berbuah...</p>
            <p className="text-lg font-mono text-cyan-300">{timeLeft}s</p>
          </div>
        );
      case 'ready':
        if (!plant.type) return null;
        
        let readyText = 'Siap Panen!';
        if (plant.mutations.length > 0) {
            const mutationNames: Record<string, string> = { 
                windy: 'Windy', ascended: 'Ascended', gold: 'Emas', gatal: 'Gatal', diamond: 'Diamond', glitch: 'Glitch', glitch_infected: 'Terkorupsi'
            };
            const displayNames = plant.mutations.map(m => mutationNames[m] || m.charAt(0).toUpperCase() + m.slice(1));
            readyText = `Panen ${displayNames.join(' & ')}!`;
        } else if (plant.boosted) {
             readyText = 'Panen Super!';
        } else if (plant.variant !== 'normal') {
            readyText = `Panen ${plant.variant.replace('_', ' ')}!`;
        }
        
        return (
          <div className="text-center cursor-pointer">
            <div className={`transition-transform duration-300 ${plant.boosted || plant.mutations.length > 0 ? 'scale-125' : 'animate-bounce'}`}>
                {SEED_DATA[plant.type].icon}
            </div>
            <p className={`font-bold text-lg mt-2 ${plant.mutations.length > 0 ? getMutationClasses() : (plant.boosted ? 'text-yellow-300' : getVariantClasses())}`}>
                {readyText}
            </p>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getCursorClass = () => {
    if (isSuperDuperSpeedSelected && (plant.status === 'growing' || plant.status === 'fruiting')) return 'cursor-pointer';
    if (isShovelSelected && plant.status !== 'empty') return 'cursor-pointer';
    if (isWateringCanSelected && (plant.status === 'growing' || plant.status === 'fruiting')) return 'cursor-pointer';
    if (isSizeBonusSelected && plant.status === 'ready' && !plant.boosted) return 'cursor-pointer';
    if (!isShovelSelected && !isWateringCanSelected && !isSizeBonusSelected && !isSuperDuperSpeedSelected && (plant.status === 'empty' || plant.status === 'ready')) return 'cursor-pointer';
    return 'cursor-not-allowed';
  };
  
  const baseClasses = "aspect-square w-full rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg";
  const stateClasses = {
      empty: "bg-amber-900/50 border-2 border-dashed border-amber-700/60 hover:bg-amber-900/70 hover:border-amber-600",
      growing: "bg-blue-900/50 border-2 border-blue-700/80",
      fruiting: "bg-purple-900/50 border-2 border-purple-700/80",
      ready: "bg-green-800/60 border-2 border-green-500 hover:bg-green-800/80",
  };
  
  const getPlotClass = () => {
      if (plant.status === 'ready') {
          const primaryMutation = getPrimaryMutation();
          if (primaryMutation) {
            switch(primaryMutation) {
                case 'glitch_infected': return "bg-gradient-to-br from-black via-red-900 to-black border-2 border-red-600 animate-pulse ring-4 ring-red-500/50";
                case 'glitch': return "bg-gradient-to-br from-gray-900 via-purple-900 to-green-900 border-2 border-purple-500 animate-pulse";
                case 'diamond': return "bg-gradient-to-br from-sky-900 to-blue-800 border-2 border-cyan-400 ring-4 ring-cyan-300/50 ring-offset-2 ring-offset-black animate-pulse";
                case 'gatal': return "bg-gradient-to-br from-red-900 to-rose-800 border-2 border-red-500 ring-4 ring-red-400/50 ring-offset-2 ring-offset-black animate-pulse";
                case 'ascended': return "border-2 border-transparent bg-gradient-to-br from-purple-600 via-pink-600 to-white animate-pulse ring-4 ring-purple-400/50 ring-offset-2 ring-offset-black";
                case 'windy': return "bg-gradient-to-br from-cyan-900 to-teal-800 border-2 border-cyan-500 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-black animate-pulse";
                case 'gold': return "bg-gradient-to-br from-yellow-900 to-amber-800 border-2 border-yellow-500 ring-4 ring-yellow-400/50 ring-offset-2 ring-offset-black animate-pulse";
            }
          }
          if (plant.boosted) return "bg-gradient-to-br from-yellow-800 to-orange-700 border-2 border-yellow-500 ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-black animate-pulse";
          switch (plant.variant) {
              case 'gold': return "bg-yellow-900/70 border-2 border-yellow-500 ring-2 ring-yellow-400 ring-offset-2 ring-offset-black animate-pulse";
              case 'rainbow': return "border-2 border-transparent bg-clip-border bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 animate-pulse";
              case 'gold_rainbow': return "border-2 border-transparent bg-clip-border bg-gradient-to-br from-yellow-400 via-pink-500 to-red-500 animate-pulse";
              default: return stateClasses.ready;
          }
      }
      return stateClasses[plant.status];
  }

  return (
    <div
      onClick={() => onPlotClick(plant.id)}
      className={`${baseClasses} ${getPlotClass()} ${getCursorClass()} ${plant.isNew ? 'animate-grow-in' : ''}`}
    >
      {renderContent()}
    </div>
  );
};

export default Plot;