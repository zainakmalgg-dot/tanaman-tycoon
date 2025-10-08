import React from 'react';

interface AncientTreeShopProps {
    isOpen: boolean;
    onClose: () => void;
    onBuySuperDuperSpeed: () => void;
    onBuyPetShardGold: () => void;
    onBuyPetShardDiamond: () => void;
    onBuyPetShardRainbow: () => void;
    isGrapeUnlocked: boolean;
    hasGoldenPet: boolean;
}

const SuperDuperSpeedIcon = () => (
    <span className="text-5xl" role="img" aria-label="Super Duper Speed">
        🌈✨
    </span>
);

const PetShardGoldIcon = () => (
    <span className="text-5xl" role="img" aria-label="Pet Shard Gold">
        🌟
    </span>
);

const PetShardDiamondIcon = () => (
    <span className="text-5xl" role="img" aria-label="Pet Shard Diamond">
        💎
    </span>
);

const PetShardRainbowIcon = () => (
    <span className="text-5xl" role="img" aria-label="Pet Shard Rainbow">
        🌈
    </span>
);

const AncientTreeShop: React.FC<AncientTreeShopProps> = ({ isOpen, onClose, onBuySuperDuperSpeed, onBuyPetShardGold, onBuyPetShardDiamond, onBuyPetShardRainbow, isGrapeUnlocked, hasGoldenPet }) => {
    if (!isOpen) return null;

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tree-shop-title"
        >
          <div 
            className="bg-gray-900/80 border-2 border-yellow-600/70 rounded-lg p-6 w-full max-w-md relative animate-fade-in shadow-2xl shadow-yellow-500/20"
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
            <h2 id="tree-shop-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">
              Toko Pohon Tua
            </h2>
            
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                <div className="flex flex-col items-center justify-center p-4 bg-gray-800/70 rounded-md border border-gray-600/80 text-center">
                    <PetShardRainbowIcon />
                    <p className="font-bold text-lg mt-2">Pet Shard Rainbow</p>
                    <p className="text-sm text-gray-400 my-1">Mutasi pet menjadi versi Pelangi. Pasif: mempercepat cooldown pet & pertumbuhan tanaman, serta berpeluang memberi mutasi Gold & Panen Super.</p>
                    <p className="text-lg font-semibold text-yellow-400">Harga: Rp 2000</p>
                    <button
                        onClick={onBuyPetShardRainbow}
                        className="w-full mt-4 bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg hover:shadow-pink-500/40"
                    >
                        Beli
                    </button>
                </div>
                <div className={`flex flex-col items-center justify-center p-4 bg-gray-800/70 rounded-md border border-gray-600/80 text-center transition-opacity ${!isGrapeUnlocked ? 'opacity-60' : ''}`}>
                    <SuperDuperSpeedIcon />
                    <p className="font-bold text-lg mt-2">Super Duper Speed</p>
                    <p className="text-sm text-gray-400 my-1">Tumbuhkan tanaman instan menjadi varian 🌈 RAINBOW 🌈!</p>
                    <p className="text-lg font-semibold text-yellow-400">Harga: Rp 100</p>
                    <div className="relative w-full mt-4">
                      <button
                        onClick={onBuySuperDuperSpeed}
                        disabled={!isGrapeUnlocked}
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-yellow-500/40"
                      >
                        Beli
                      </button>
                      {!isGrapeUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Buka benih Anggur dahulu</p>
                        </div>
                      )}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-gray-800/70 rounded-md border border-gray-600/80 text-center">
                    <PetShardGoldIcon />
                    <p className="font-bold text-lg mt-2">Pet Shard Gold</p>
                    <p className="text-sm text-gray-400 my-1">Mutasi pet menjadi versi Emas, memberikan pasif baru!</p>
                    <p className="text-lg font-semibold text-yellow-400">Harga: Rp 800</p>
                    <button
                        onClick={onBuyPetShardGold}
                        className="w-full mt-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg hover:shadow-yellow-500/40"
                    >
                        Beli
                    </button>
                </div>
                <div className={`flex flex-col items-center justify-center p-4 bg-gray-800/70 rounded-md border border-gray-600/80 text-center transition-opacity ${!hasGoldenPet ? 'opacity-60' : ''}`}>
                    <PetShardDiamondIcon />
                    <p className="font-bold text-lg mt-2">Pet Shard Diamond</p>
                    <p className="text-sm text-gray-400 my-1">Mutasi pet menjadi versi Diamond. Pasif: setiap 1 menit, memberikan mutasi Diamond pada tanaman.</p>
                    <p className="text-lg font-semibold text-cyan-400">Harga: Rp 1500</p>
                    <div className="relative w-full mt-4">
                      <button
                        onClick={onBuyPetShardDiamond}
                        disabled={!hasGoldenPet}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:shadow-cyan-500/40"
                      >
                        Beli
                      </button>
                      {!hasGoldenPet && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xs text-white bg-black/50 px-2 py-1 rounded">Miliki Pet Emas dahulu</p>
                        </div>
                      )}
                    </div>
                </div>
            </div>
          </div>
        </div>
    );
};

export default AncientTreeShop;