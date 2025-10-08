import React from 'react';

const WateringCanLargeIcon = () => (
    <span className="text-5xl" role="img" aria-label="Penyiram Tanaman">
        💦
    </span>
);

const SizeBonusLargeIcon = () => (
    <span className="text-5xl" role="img" aria-label="Pupuk Super">
        ✨
    </span>
);


interface GearShopProps {
  isOpen: boolean;
  onClose: () => void;
  onBuyWateringCan: () => void;
  onBuySizeBonus: () => void;
  stock: {
    wateringCans: number;
    sizeBonus: number;
  };
}

const GearShop: React.FC<GearShopProps> = ({ isOpen, onClose, onBuyWateringCan, onBuySizeBonus, stock }) => {
  if (!isOpen) return null;

  const items = [
    {
      name: 'Watering Can',
      description: 'Mempercepat 50% waktu tumbuh/berbuah tanaman.',
      cost: 50,
      stock: stock.wateringCans,
      onBuy: onBuyWateringCan,
      icon: <WateringCanLargeIcon />,
    },
    {
        name: 'Pupuk Super',
        description: 'Gandakan harga jual buah saat panen!',
        cost: 200,
        stock: stock.sizeBonus,
        onBuy: onBuySizeBonus,
        icon: <SizeBonusLargeIcon />,
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gear-shop-title"
    >
      <div 
        className="bg-gray-900/80 border-2 border-cyan-500/70 rounded-lg p-6 w-full max-w-md relative animate-fade-in shadow-2xl shadow-cyan-500/20"
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
        <h2 id="gear-shop-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
          Toko Alat
        </h2>
        
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-800/70 rounded-md border border-gray-600/80">
                <div className="flex items-center gap-4">
                  {item.icon}
                  <div>
                    <p className="font-bold text-lg">{item.name}</p>
                    <p className="text-sm text-gray-400">Harga: Rp {item.cost}</p>
                    <p className="text-sm text-cyan-400 font-semibold">Stok: {item.stock}</p>
                  </div>
                </div>
                <button
                  onClick={item.onBuy}
                  disabled={item.stock <= 0}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg hover:shadow-cyan-500/40"
                >
                  Beli
                </button>
              </div>
            ))}
          {stock.wateringCans === 0 && stock.sizeBonus === 0 && <p className="text-center text-gray-500 italic pt-4">Stok habis! Akan diisi ulang otomatis.</p>}
        </div>
      </div>
    </div>
  );
};

export default GearShop;