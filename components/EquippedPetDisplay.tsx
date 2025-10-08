import React from 'react';
import type { PetType } from '../types';
import { PET_DATA } from '../constants';

interface EquippedPetDisplayProps {
  petType: PetType | null;
  age: number;
  cooldown: number | undefined;
  isShardSelected: boolean;
  onDisplayClick: () => void;
  isGolden: boolean;
  isDiamond: boolean;
  isRainbow: boolean;
  isPetShardDiamondSelected: boolean;
  onApplyShardToPetDiamond: () => void;
  isPetShardRainbowSelected: boolean;
  onApplyShardToPetRainbow: () => void;
  onUnequip: () => void;
}

const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

const EquippedPetDisplay: React.FC<EquippedPetDisplayProps> = ({ petType, age, cooldown, isShardSelected, onDisplayClick, isGolden, isDiamond, isRainbow, isPetShardDiamondSelected, onApplyShardToPetDiamond, isPetShardRainbowSelected, onApplyShardToPetRainbow, onUnequip }) => {
    if (!petType) {
        return (
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg border border-dashed border-gray-700 p-3 flex items-center justify-center min-h-[80px]">
                <p className="text-gray-500 text-sm">Slot Pet Kosong</p>
            </div>
        );
    }
    
    const petData = PET_DATA[petType];
    const isPassive = ['chicken'].includes(petType);
    
    let petName = petData.name;
    if (isRainbow) {
        petName = 'Pelangi ' + petName;
    } else {
        const mutations = [];
        if (isDiamond) mutations.push('Diamond');
        if (isGolden) mutations.push('Emas');
        if (mutations.length > 0) {
            petName += ` [${mutations.join('/')}]`;
        }
    }

    const isAnyShardSelected = isShardSelected || isPetShardDiamondSelected || isPetShardRainbowSelected;

    const handleClick = () => {
        if (isShardSelected) {
            onDisplayClick();
        } else if (isPetShardDiamondSelected) {
            onApplyShardToPetDiamond();
        } else if (isPetShardRainbowSelected) {
            onApplyShardToPetRainbow();
        } else {
            onUnequip();
        }
    };

    const cursorClass = isAnyShardSelected || petType ? 'cursor-pointer' : '';
    const highlightClass = isShardSelected 
        ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black animate-pulse' 
        : isPetShardDiamondSelected 
        ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black animate-pulse' 
        : isPetShardRainbowSelected 
        ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-black animate-pulse'
        : '';
        
    const titleText = isShardSelected ? `Gunakan Pet Shard Gold pada ${petData.name}` 
        : isPetShardDiamondSelected ? `Gunakan Pet Shard Diamond pada ${petData.name}` 
        : isPetShardRainbowSelected ? `Gunakan Pet Shard Rainbow pada ${petData.name}`
        : `Klik untuk melepas ${petData.name}`;
    
    const borderClass = isRainbow ? 'p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500' 
        : (isDiamond && isGolden) ? 'p-0.5 bg-gradient-to-br from-cyan-400 via-yellow-400 to-amber-500'
        : isDiamond ? 'p-0.5 bg-gradient-to-br from-cyan-400 to-sky-500'
        : isGolden ? 'p-0.5 bg-gradient-to-br from-yellow-400 to-amber-500' 
        : 'border border-gray-700';

    const renderCooldown = () => {
        if (isPassive) {
            return <span className="text-cyan-300 font-semibold">Pasif Aktif</span>;
        }
        if (cooldown === undefined || cooldown <= 0) {
            return <span className="text-green-400 font-bold animate-pulse">SIAP</span>
        }
        return <span className="font-mono text-yellow-300">{formatTime(cooldown)}</span>
    }

    return (
        <div 
            className={`bg-gray-900/50 backdrop-blur-sm rounded-lg animate-fade-in transition-all ${cursorClass} ${highlightClass} ${borderClass}`}
            onClick={handleClick}
            title={titleText}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        >
            <div className={`p-3 w-full h-full rounded-[7px] flex items-center min-h-[80px] ${isRainbow || isDiamond || isGolden ? 'bg-gray-900/80' : ''}`}>
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0">{petData.icon}</div>
                    <div className="flex-grow">
                        <p className={`font-bold text-white text-base ${isRainbow ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400' : (isDiamond && isGolden) ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-yellow-300' : ''}`}>{petName}</p>
                        <p className="text-xs text-gray-400">Umur: <span className="font-semibold text-gray-200">{age}</span></p>
                    </div>
                    <div className="text-base text-center bg-gray-800/50 px-2 py-1 rounded-md border border-gray-600">
                        {renderCooldown()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquippedPetDisplay;