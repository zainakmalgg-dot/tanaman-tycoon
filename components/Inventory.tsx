import React from 'react';
import type { Inventory as InventoryType, PetType, SeedType } from '../types';
import { SEED_DATA, PET_DATA } from '../constants';

interface InventoryProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryType;
  selectedSeed: SeedType | null;
  isShovelSelected: boolean;
  isWateringCanSelected: boolean;
  isSizeBonusSelected: boolean;
  isSuperDuperSpeedSelected: boolean;
  isPetShardGoldSelected: boolean;
  isPetShardDiamondSelected: boolean;
  isPetShardRainbowSelected: boolean;
  onSelectSeed: (seedType: SeedType) => void;
  onSellFruit: (fruitType: SeedType) => void;
  onSellBoostedFruit: (fruitType: SeedType) => void;
  onSellRacoonInfectedFruit: (fruitType: SeedType) => void;
  onToggleShovel: () => void;
  onToggleWateringCan: () => void;
  onToggleSizeBonus: () => void;
  onToggleSuperDuperSpeed: () => void;
  onTogglePetShardGold: () => void;
  onTogglePetShardDiamond: () => void;
  onTogglePetShardRainbow: () => void;
  onEquipPet: (petType: PetType) => void;
  onApplyShardToPet: (petType: PetType) => void;
  onApplyShardToPetDiamond: (petType: PetType) => void;
  onApplyShardToPetRainbow: (petType: PetType) => void;
}

const ShovelIcon = () => (
    <span className="text-3xl" role="img" aria-label="Sekop">
      🧰
    </span>
);

const WateringCanIcon = () => (
    <span className="text-3xl" role="img" aria-label="Penyiram Tanaman">
      💦
    </span>
);

const SizeBonusIcon = () => (
    <span className="text-3xl" role="img" aria-label="Pupuk Super">
      ✨
    </span>
);

const SuperDuperSpeedIcon = () => (
    <span className="text-3xl" role="img" aria-label="Super Duper Speed">
      🌈
    </span>
);

const PetShardGoldIcon = () => (
    <span className="text-3xl" role="img" aria-label="Pet Shard Gold">
      🌟
    </span>
);

const PetShardDiamondIcon = () => (
    <span className="text-3xl" role="img" aria-label="Pet Shard Diamond">
      💎
    </span>
);

const PetShardRainbowIcon = () => (
    <span className="text-3xl" role="img" aria-label="Pet Shard Rainbow">
      🌈
    </span>
);

const Inventory: React.FC<InventoryProps> = ({ 
    isOpen,
    onClose,
    inventory, 
    selectedSeed, 
    isShovelSelected, 
    isWateringCanSelected, 
    isSizeBonusSelected,
    isSuperDuperSpeedSelected,
    isPetShardGoldSelected,
    isPetShardDiamondSelected,
    isPetShardRainbowSelected,
    onSelectSeed, 
    onSellFruit,
    onSellBoostedFruit,
    onSellRacoonInfectedFruit,
    onToggleShovel, 
    onToggleWateringCan,
    onToggleSizeBonus,
    onToggleSuperDuperSpeed,
    onTogglePetShardGold,
    onTogglePetShardDiamond,
    onTogglePetShardRainbow,
    onEquipPet,
    onApplyShardToPet,
    onApplyShardToPetDiamond,
    onApplyShardToPetRainbow,
}) => {
  if (!isOpen) {
    return null;
  }

  const allOwnedPets = (Object.keys(inventory.pets || {}) as PetType[]).filter(p => inventory.pets![p] > 0);
  const allRacoonFruits = (Object.keys(inventory.racoonInfectedFruits || {}) as SeedType[]).filter(type => inventory.racoonInfectedFruits![type] > 0);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-title"
    >
      <div 
        className="bg-gray-900/80 border-2 border-yellow-500/70 rounded-lg p-6 w-full max-w-sm relative animate-fade-in shadow-2xl shadow-yellow-500/20"
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
        <h2 id="inventory-title" className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
          Inventaris
        </h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Benih</h3>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(inventory.seeds) as SeedType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => onSelectSeed(type)}
                    className={`p-2 rounded-lg text-center transition-all ${
                      selectedSeed === type
                        ? 'bg-teal-500 ring-2 ring-teal-300'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    disabled={inventory.seeds[type] === 0}
                  >
                    {SEED_DATA[type].icon}
                    <span className="block text-xs font-bold mt-1">
                      {inventory.seeds[type]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Alat</h3>
              <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={onToggleShovel}
                    className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                      isShovelSelected
                        ? 'bg-red-500 ring-2 ring-red-300'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label="Pilih Sekop"
                  >
                    <ShovelIcon />
                    <span className="block text-xs font-bold mt-1">Sekop</span>
                  </button>
                  <button
                      onClick={onToggleWateringCan}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isWateringCanSelected
                          ? 'bg-cyan-500 ring-2 ring-cyan-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Watering Can"
                      disabled={inventory.wateringCans === 0}
                    >
                      <WateringCanIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.wateringCans}
                      </span>
                  </button>
                  <button
                      onClick={onToggleSizeBonus}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isSizeBonusSelected
                          ? 'bg-yellow-500 ring-2 ring-yellow-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Pupuk Super"
                      disabled={inventory.sizeBonus === 0}
                    >
                      <SizeBonusIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.sizeBonus}
                      </span>
                  </button>
                   <button
                      onClick={onToggleSuperDuperSpeed}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isSuperDuperSpeedSelected
                          ? 'bg-indigo-500 ring-2 ring-indigo-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Super Duper Speed"
                      disabled={!inventory.superDuperSpeed || inventory.superDuperSpeed === 0}
                    >
                      <SuperDuperSpeedIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.superDuperSpeed || 0}
                      </span>
                  </button>
                   <button
                      onClick={onTogglePetShardGold}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isPetShardGoldSelected
                          ? 'bg-yellow-500 ring-2 ring-yellow-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Pet Shard Gold"
                      disabled={inventory.petShardGold === 0}
                    >
                      <PetShardGoldIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.petShardGold || 0}
                      </span>
                  </button>
                  <button
                      onClick={onTogglePetShardDiamond}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isPetShardDiamondSelected
                          ? 'bg-cyan-500 ring-2 ring-cyan-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Pet Shard Diamond"
                      disabled={(inventory.petShardDiamond || 0) === 0}
                    >
                      <PetShardDiamondIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.petShardDiamond || 0}
                      </span>
                  </button>
                  <button
                      onClick={onTogglePetShardRainbow}
                      className={`p-2 rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center ${
                        isPetShardRainbowSelected
                          ? 'bg-gradient-to-br from-pink-500 to-yellow-500 ring-2 ring-pink-300'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label="Pilih Pet Shard Rainbow"
                      disabled={(inventory.petShardRainbow || 0) === 0}
                    >
                      <PetShardRainbowIcon />
                      <span className="block text-xs font-bold mt-1">
                        {inventory.petShardRainbow || 0}
                      </span>
                  </button>
              </div>
            </div>

            {allOwnedPets.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-300">Pets</h3>
                <div className="grid grid-cols-4 gap-2">
                  {allOwnedPets.map(type => {
                    const count = inventory.pets[type];
                    const isGolden = inventory.goldenPets?.includes(type);
                    const isDiamond = inventory.diamondPets?.includes(type);
                    const isRainbow = inventory.rainbowPets?.includes(type);
                    const age = inventory.petAges?.[type] || 0;
                    
                    let petName = PET_DATA[type].name;
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

                    const equippedCount = inventory.equippedPets.filter(p => p === type).length;
                    
                    let description = PET_DATA[type].description;
                    if (isRainbow) {
                      description = `[Pelangi: Mempercepat cooldown pet & pertumbuhan tanaman. Peluang memberi mutasi Gold & Panen Super.]\n` + description;
                    } else {
                        if (isDiamond) {
                          description += `\n[Diamond: Setiap 1 menit, 98% kesempatan memberi mutasi Diamond ke tanaman.]`;
                        }
                        if (isGolden) {
                          description += `\n[Emas: Setiap 1 menit, 98% kesempatan memberi mutasi Gold ke tanaman.]`;
                        }
                    }
                    description += `\nJumlah: ${count}`;
                    description += `\nTerpasang: ${equippedCount}`;
                    description += `\nUsia: ${age}`;

                    const isShardSelected = isPetShardGoldSelected || isPetShardDiamondSelected || isPetShardRainbowSelected;
                    
                    const borderClass = isRainbow 
                      ? 'p-0.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500' 
                      : (isDiamond && isGolden) ? 'p-0.5 bg-gradient-to-br from-cyan-400 via-yellow-400 to-amber-500'
                      : isDiamond ? 'p-0.5 bg-gradient-to-br from-cyan-400 to-sky-500'
                      : isGolden ? 'p-0.5 bg-gradient-to-br from-yellow-400 to-amber-500' : '';

                    return (
                      <button
                        key={type}
                        onClick={() => isPetShardGoldSelected ? onApplyShardToPet(type) : isPetShardDiamondSelected ? onApplyShardToPetDiamond(type) : isPetShardRainbowSelected ? onApplyShardToPetRainbow(type) : onEquipPet(type)}
                        className={`rounded-lg text-center transition-all w-full h-[76px] flex flex-col justify-center items-center relative group ${borderClass}`}
                        title={petName}
                      >
                        <div className={`w-full h-full rounded-[6px] flex flex-col justify-center items-center ${
                          isRainbow || isDiamond || isGolden ? 'bg-gray-900/80' : ''
                        } ${
                          equippedCount > 0
                            ? 'bg-green-800'
                            : (isShardSelected ? (isPetShardRainbowSelected ? 'bg-gray-800 hover:bg-gray-700' : isPetShardDiamondSelected ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-yellow-700 hover:bg-yellow-600') : 'bg-gray-700 hover:bg-gray-600')
                        }`}>
                          {PET_DATA[type].icon}
                          <span className={`block text-xs font-bold mt-1 ${isRainbow ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400' : (isDiamond && isGolden) ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-yellow-300' : isDiamond ? 'text-cyan-300' : isGolden ? 'text-yellow-300' : ''}`}>{petName}</span>
                          {count > 1 && (
                            <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-sky-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-gray-800">
                              {count}
                            </div>
                          )}
                          <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-left text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-pre-line">
                            {description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            
            {allRacoonFruits.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">Buah Terinfeksi</h3>
                <div className="space-y-2">
                  {allRacoonFruits.map((type) => (
                    <div key={type} className="flex items-center justify-between p-2 bg-red-900/50 border border-red-600 rounded-md">
                        <div className="flex items-center gap-2">
                            <span className="scale-110">{SEED_DATA[type].icon}</span>
                            <span className="font-semibold text-red-300">{SEED_DATA[type].name}</span>
                            <span className="text-gray-400">x{inventory.racoonInfectedFruits![type]}</span>
                        </div>
                        <button
                            onClick={() => onSellRacoonInfectedFruit(type)}
                            className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-3 text-sm rounded-md transition-transform transform hover:scale-105"
                        >
                            Jual 1
                        </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Buah Bonus</h3>
              <div className="space-y-2">
                {(Object.keys(inventory.boostedFruits) as SeedType[]).filter(type => inventory.boostedFruits[type] > 0).map((type) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-yellow-900/50 border border-yellow-600 rounded-md">
                      <div className="flex items-center gap-2">
                          <span className="scale-110">{SEED_DATA[type].icon}</span>
                          <span className="font-semibold text-yellow-300">{SEED_DATA[type].name}</span>
                          <span className="text-gray-400">x{inventory.boostedFruits[type]}</span>
                      </div>
                      <button
                          onClick={() => onSellBoostedFruit(type)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-1 px-3 text-sm rounded-md transition-transform transform hover:scale-105"
                      >
                          Jual 1
                      </button>
                  </div>
                ))}
                {Object.values(inventory.boostedFruits).every(count => count === 0) && (
                   <p className="text-gray-500 text-sm italic">Tidak ada buah bonus.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-300">Buah</h3>
              <div className="space-y-2">
                {(Object.keys(inventory.fruits) as SeedType[]).filter(type => inventory.fruits[type] > 0).map((type) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                      <div className="flex items-center gap-2">
                          {SEED_DATA[type].icon}
                          <span className="font-semibold">{SEED_DATA[type].name}</span>
                          <span className="text-gray-400">x{inventory.fruits[type]}</span>
                      </div>
                      <button
                          onClick={() => onSellFruit(type)}
                          className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-1 px-3 text-sm rounded-md transition-transform transform hover:scale-105"
                      >
                          Jual 1
                      </button>
                  </div>
                ))}
                {Object.values(inventory.fruits).every(count => count === 0) && (
                   <p className="text-gray-500 text-sm italic">Tidak ada buah untuk dijual.</p>
                )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;