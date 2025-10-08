import React from 'react';
import { SEED_DATA } from '../constants';
import type { SeedType } from '../types';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  onBuySeed: (seedType: SeedType) => void;
  stock: Record<SeedType, number>;
}

const Shop: React.FC<ShopProps> = ({ isOpen, onClose, onBuySeed, stock }) => {
  if (!isOpen) {
    return null;
  }

  const allSeeds = Object.keys(SEED_DATA) as SeedType[];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-title"
    >
      <div 
        className="bg-gray-900/80 border-2 border-green-500/70 rounded-lg p-6 w-full max-w-md relative animate-fade-in shadow-2xl shadow-green-500/20"
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
        <h2 id="shop-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
          Toko Benih
        </h2>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {allSeeds.length > 0 ? (
            allSeeds.map((type) => {
              const seed = SEED_DATA[type];
              const isOutOfStock = (stock[type] || 0) === 0;
              return (
                <div
                  key={type}
                  className={`flex items-center justify-between p-3 bg-gray-800/70 rounded-md border border-gray-600/80 ${isOutOfStock ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {seed.icon}
                    <div>
                      <p className="font-bold text-lg">{seed.name}</p>
                      <p className="text-sm text-gray-400">Harga: Rp {seed.cost}</p>
                      {isOutOfStock ? (
                        <p className="text-sm text-red-400 font-semibold">Stok Habis</p>
                      ) : (
                        <p className="text-sm text-teal-400 font-semibold">Stok: {stock[type]}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onBuySeed(type)}
                    disabled={isOutOfStock}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg hover:shadow-green-500/40"
                  >
                    Beli
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic py-8">Toko kosong! Stok akan diisi ulang otomatis.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;