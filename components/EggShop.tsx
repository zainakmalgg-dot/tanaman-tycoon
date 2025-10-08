import React, { useState } from 'react';
import { PET_DATA, PET_EGG_WEIGHTS, GLITCH_EGG_WEIGHTS } from '../constants';
import type { PetType, GlitchPetType } from '../types';

const EggIcon = () => <span className="text-8xl animate-pulse">🥚</span>;
const GlitchEggIcon = () => <span className="text-8xl animate-pulse">
    <span className="relative inline-block">
      🥚
      <span className="absolute top-0 left-0 text-cyan-400 blur-sm animate-ping">🥚</span>
      <span className="absolute top-0 left-0 text-red-500 blur-sm animate-ping animation-delay-200">🥚</span>
    </span>
</span>;


interface EggShopProps {
    isOpen: boolean;
    onClose: () => void;
    onBuyEgg: () => void;
    onBuyGlitchEgg: () => void;
    money: number;
}

const EGG_COST = 1500;
const GLITCH_EGG_COST = 5000;

const PetChancesModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const totalWeight = Object.values(PET_EGG_WEIGHTS).reduce((sum, w) => sum + w, 0);

    const petChances = (Object.keys(PET_EGG_WEIGHTS) as PetType[])
        .filter(p => PET_EGG_WEIGHTS[p] > 0)
        .map(petType => {
            const weight = PET_EGG_WEIGHTS[petType];
            const percentage = ((weight / totalWeight) * 100).toFixed(2);
            return {
                ...PET_DATA[petType],
                type: petType,
                chance: `${percentage}%`
            };
        }).sort((a, b) => PET_EGG_WEIGHTS[b.type as PetType] - PET_EGG_WEIGHTS[a.type as PetType]);

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="chances-title"
        >
            <div 
                className="bg-gray-800/90 border-2 border-teal-500/70 rounded-lg p-6 w-full max-w-xs relative animate-fade-in shadow-2xl shadow-teal-500/20"
                onClick={(e) => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                    aria-label="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 id="chances-title" className="text-2xl font-bold mb-4 text-center text-teal-300">
                    Peluang Pet
                </h2>
                <div className="space-y-2">
                    {petChances.map(pet => (
                        <div key={pet.type} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center gap-3">
                                {pet.icon}
                                <span className="font-semibold">{pet.name}</span>
                            </div>
                            <span className="font-mono text-teal-400">{pet.chance}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GlitchPetChancesModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const totalWeight = Object.values(GLITCH_EGG_WEIGHTS).reduce((sum, w) => sum + w, 0);

    const petChances = (Object.keys(GLITCH_EGG_WEIGHTS) as GlitchPetType[]).map(petType => {
        const weight = GLITCH_EGG_WEIGHTS[petType];
        const percentage = ((weight / totalWeight) * 100).toFixed(2);
        return {
            ...PET_DATA[petType],
            type: petType,
            chance: `${percentage}%`
        };
    }).sort((a, b) => GLITCH_EGG_WEIGHTS[b.type] - GLITCH_EGG_WEIGHTS[a.type]);

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={onClose}
        >
            <div 
                className="bg-gray-800/90 border-2 border-red-500/70 rounded-lg p-6 w-full max-w-xs relative animate-fade-in shadow-2xl shadow-red-500/20"
                onClick={(e) => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                    aria-label="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-red-300">
                    Peluang Pet Glitch
                </h2>
                <div className="space-y-2">
                    {petChances.map(pet => (
                        <div key={pet.type} className="flex items-center justify-between p-2 bg-gray-700/50 rounded-md">
                            <div className="flex items-center gap-3">
                                {pet.icon}
                                <span className="font-semibold">{pet.name}</span>
                            </div>
                            <span className="font-mono text-red-400">{pet.chance}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const EggShop: React.FC<EggShopProps> = ({ isOpen, onClose, onBuyEgg, onBuyGlitchEgg, money }) => {
    const [showChances, setShowChances] = useState(false);
    const [showGlitchChances, setShowGlitchChances] = useState(false);
    if (!isOpen) return null;
    
    const canAfford = money >= EGG_COST;
    const canAffordGlitch = money >= GLITCH_EGG_COST;

    return (
        <>
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
              onClick={onClose}
              role="dialog"
              aria-modal="true"
              aria-labelledby="egg-shop-title"
            >
              <div 
                className="bg-gray-900/80 border-2 border-purple-500/70 rounded-lg p-6 w-full max-w-xl relative animate-fade-in text-center shadow-2xl shadow-purple-500/20"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                    aria-label="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 id="egg-shop-title" className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Toko Telur
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Regular Egg */}
                    <div className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            Telur Misterius
                            <button 
                                onClick={() => setShowChances(true)} 
                                className="text-lg text-gray-400 hover:text-white transition-colors rounded-full w-6 h-6 flex items-center justify-center bg-gray-700/50 hover:bg-gray-700"
                                aria-label="Lihat peluang"
                            >
                                ⓘ
                            </button>
                        </h3>
                        <EggIcon />
                        <p className="text-gray-400 my-2 text-sm">Dapatkan pet langka untuk membantumu di kebun!</p>
                        <p className="text-lg font-bold text-yellow-400 mb-4">Harga: Rp {EGG_COST.toLocaleString('id-ID')}</p>
                        <button
                            onClick={onBuyEgg}
                            disabled={!canAfford}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-purple-500/40"
                        >
                            Beli Telur
                        </button>
                    </div>

                    {/* Glitch Egg */}
                    <div className="flex flex-col items-center p-4 bg-gray-800/50 border-2 border-dashed border-red-500/50 rounded-lg">
                        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                            Telur Glitch
                            <button 
                                onClick={() => setShowGlitchChances(true)} 
                                className="text-lg text-gray-400 hover:text-white transition-colors rounded-full w-6 h-6 flex items-center justify-center bg-gray-700/50 hover:bg-gray-700"
                                aria-label="Lihat peluang"
                            >
                                ⓘ
                            </button>
                        </h3>
                        <GlitchEggIcon />
                        <p className="text-gray-400 my-2 text-sm">Telur aneh dari dimensi lain. Apa isinya?</p>
                        <p className="text-lg font-bold text-yellow-400 mb-4">Harga: Rp {GLITCH_EGG_COST.toLocaleString('id-ID')}</p>
                        <button
                            onClick={onBuyGlitchEgg}
                            disabled={!canAffordGlitch}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-red-500/40"
                        >
                            Beli Telur Glitch
                        </button>
                    </div>
                </div>

              </div>
            </div>
            {showChances && <PetChancesModal onClose={() => setShowChances(false)} />}
            {showGlitchChances && <GlitchPetChancesModal onClose={() => setShowGlitchChances(false)} />}
        </>
    );
};

export default EggShop;