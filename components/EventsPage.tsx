import React, { useState } from 'react';
import AncientTreeShop from './AncientTreeShop';

interface EventsPageProps {
  onBackToGarden: () => void;
  onBuySuperDuperSpeed: () => void;
  onBuyPetShardGold: () => void;
  onBuyPetShardDiamond: () => void;
  onBuyPetShardRainbow: () => void;
  isGrapeUnlocked: boolean;
  hasGoldenPet: boolean;
}

const EventsPage: React.FC<EventsPageProps> = ({ onBackToGarden, onBuySuperDuperSpeed, onBuyPetShardGold, onBuyPetShardDiamond, onBuyPetShardRainbow, isGrapeUnlocked, hasGoldenPet }) => {
  const [isShopOpen, setIsShopOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-purple-700 h-full flex flex-col items-center justify-center animate-fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center text-purple-300">Halaman Event</h2>
      <p className="text-gray-400 mb-8 text-center">Jelajahi tempat misterius dan temukan item langka!</p>

      <div 
        className="text-center cursor-pointer group"
        onClick={() => setIsShopOpen(true)}
        aria-label="Buka Toko Pohon Tua"
        role="button"
      >
        <span className="text-9xl group-hover:scale-110 transition-transform duration-300 block [filter:drop-shadow(0_5px_15px_rgba(134,239,172,0.4))] group-hover:[filter:drop-shadow(0_5px_15px_rgba(134,239,172,0.6))]">🌳</span>
        <p className="mt-4 text-xl font-semibold text-yellow-200 group-hover:text-yellow-100">Pohon Tua</p>
        <p className="text-sm text-gray-500">(Klik untuk berinteraksi)</p>
      </div>

      <button
        onClick={onBackToGarden}
        className="mt-12 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
      >
        Kembali ke Kebun
      </button>

      <AncientTreeShop 
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        onBuySuperDuperSpeed={onBuySuperDuperSpeed}
        onBuyPetShardGold={onBuyPetShardGold}
        onBuyPetShardDiamond={onBuyPetShardDiamond}
        onBuyPetShardRainbow={onBuyPetShardRainbow}
        isGrapeUnlocked={isGrapeUnlocked}
        hasGoldenPet={hasGoldenPet}
      />
    </div>
  );
};

export default EventsPage;