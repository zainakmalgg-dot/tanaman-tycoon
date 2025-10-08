
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Shop from './components/Shop';
import GearShop from './components/GearShop';
import Inventory from './components/Inventory';
import Garden from './components/Garden';
import Notification from './components/Notification';
import AdminConsole from './components/AdminConsole';
import AdminMessage from './components/AdminMessage';
import EventsPage from './components/EventsPage';
import EggShop from './components/EggShop';
import EquippedPetDisplay from './components/EquippedPetDisplay';
import type { SeedType, Plant, Inventory as InventoryType, NotificationMessage, PlantVariant, WeatherType, PetType, GlitchPetType, MutationType } from './types';
import { SEED_DATA, INITIAL_MONEY, INITIAL_PLOTS, PET_DATA, PET_EGG_WEIGHTS, GLITCH_EGG_WEIGHTS } from './constants';

const GAME_STATE_KEY = 'tanamanTycoonState';

const App: React.FC = () => {
  const [money, setMoney] = useState<number>(INITIAL_MONEY);
  const [inventory, setInventory] = useState<InventoryType>({
    seeds: { mango: 1, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
    fruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
    boostedFruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
    racoonInfectedFruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
    wateringCans: 0,
    sizeBonus: 0,
    superDuperSpeed: 0,
    pets: { racoon: 0, griffin: 0, chicken: 0, fox: 0, ulat: 0, glitch: 0, glitchFox: 0, golemGlitch: 0 },
    equippedPets: [null, null, null],
    petShardGold: 0,
    petShardDiamond: 0,
    petShardRainbow: 0,
    goldenPets: [],
    diamondPets: [],
    rainbowPets: [],
    petAges: { racoon: 0, griffin: 0, chicken: 0, fox: 0, ulat: 0, glitch: 0, glitchFox: 0, golemGlitch: 0 },
  });
  const [plots, setPlots] = useState<Plant[]>(
    Array.from({ length: INITIAL_PLOTS }, (_, i) => ({
      id: i,
      type: null,
      plantedAt: null,
      nextPhaseAt: null,
      status: 'empty',
      boosted: false,
      variant: 'normal',
      mutations: [],
    }))
  );
  const [selectedSeed, setSelectedSeed] = useState<SeedType | null>(null);
  const [isShovelSelected, setIsShovelSelected] = useState<boolean>(false);
  const [isWateringCanSelected, setIsWateringCanSelected] = useState<boolean>(false);
  const [isSizeBonusSelected, setIsSizeBonusSelected] = useState<boolean>(false);
  const [isSuperDuperSpeedSelected, setIsSuperDuperSpeedSelected] = useState<boolean>(false);
  const [isPetShardGoldSelected, setIsPetShardGoldSelected] = useState<boolean>(false);
  const [isPetShardDiamondSelected, setIsPetShardDiamondSelected] = useState<boolean>(false);
  const [isPetShardRainbowSelected, setIsPetShardRainbowSelected] = useState<boolean>(false);
  
  const [notification, setNotification] = useState<NotificationMessage | null>(null);
  
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [isGearShopOpen, setIsGearShopOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isEggShopOpen, setIsEggShopOpen] = useState<boolean>(false);
  
  const [shopStock, setShopStock] = useState<Record<SeedType, number>>({
    mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0,
  });
  const [gearShopStock, setGearShopStock] = useState({ wateringCans: 3, sizeBonus: 0 });
  
  const [upgradeCost, setUpgradeCost] = useState<number>(10);
  const [weather, setWeather] = useState<WeatherType>('cloudy');
  const [unlockedSeeds, setUnlockedSeeds] = useState<SeedType[]>(['mango']);

  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const adminMessageTimeoutRef = useRef<number | null>(null);

  const [musicStarted, setMusicStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentPage, setCurrentPage] = useState<'garden' | 'events'>('garden');

  const [abilityCooldowns, setAbilityCooldowns] = useState<(number | null)[]>([null, null, null]);
  const [passiveAbilityCooldowns, setPassiveAbilityCooldowns] = useState({ gold: 60, diamond: 60, rainbow: 60 });

  const showNotification = useCallback((message: NotificationMessage) => {
    setNotification(message);
  }, []);
  
  useEffect(() => {
    audioRef.current = document.getElementById('bg-music') as HTMLAudioElement;
    if (audioRef.current) {
        audioRef.current.volume = 0.3;
    }
  }, []);

  const playMusicIfNeeded = useCallback(() => {
    if (!musicStarted && audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Gagal memutar musik:", e));
        setMusicStarted(true);
    }
  }, [musicStarted]);

  useEffect(() => {
    const changeWeather = (isInitial: boolean = false) => {
      const weatherOptions: WeatherType[] = ['sunny', 'rainy', 'cloudy', 'cloudy', 'cloudy']; // Make cloudy more common
      const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
      setWeather(newWeather);
      
      if (isInitial) return;
      
      if (newWeather === 'rainy') {
        setInventory(prev => ({ ...prev, wateringCans: prev.wateringCans + 1 }));
        showNotification({ text: 'Hujan! Anda dapat 1 penyiram tanaman gratis.', type: 'info' });
      } else if (newWeather === 'sunny') {
        showNotification({ text: 'Cuaca cerah! Pertumbuhan tanaman sedikit lebih cepat.', type: 'info' });
      } else {
         showNotification({ text: 'Cuaca berawan.', type: 'info' });
      }
    };

    changeWeather(true); // Set initial weather without notification
    const weatherInterval = setInterval(() => changeWeather(false), 120000); // Change every 2 mins
    return () => clearInterval(weatherInterval);
  }, [showNotification]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            if (isAdminConsoleOpen) setIsAdminConsoleOpen(false);
            if (isShopOpen) setIsShopOpen(false);
            if (isGearShopOpen) setIsGearShopOpen(false);
            if (isInventoryOpen) setIsInventoryOpen(false);
            if (isEggShopOpen) setIsEggShopOpen(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAdminConsoleOpen, isShopOpen, isGearShopOpen, isInventoryOpen, isEggShopOpen]);

  const handleTitleClick = () => {
    setIsAdminConsoleOpen(prev => !prev);
  };

  const applyMutation = (plots: Plant[], targetPlotId: number, mutation: MutationType): Plant[] => {
    return plots.map(p => {
        if (p.id === targetPlotId) {
            if (!p.mutations.includes(mutation)) {
                return { ...p, mutations: [...p.mutations, mutation] };
            }
        }
        return p;
    });
  };

  useEffect(() => {
    const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      
      const baseInventory: InventoryType = {
        seeds: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
        fruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
        boostedFruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
        racoonInfectedFruits: { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 },
        wateringCans: 0,
        sizeBonus: 0,
        superDuperSpeed: 0,
        pets: { racoon: 0, griffin: 0, chicken: 0, fox: 0, ulat: 0, glitch: 0, glitchFox: 0, golemGlitch: 0 },
        equippedPets: [null, null, null],
        petShardGold: 0,
        petShardDiamond: 0,
        petShardRainbow: 0,
        goldenPets: [],
        diamondPets: [],
        rainbowPets: [],
        petAges: { racoon: 0, griffin: 0, chicken: 0, fox: 0, ulat: 0, glitch: 0, glitchFox: 0, golemGlitch: 0 },
      };
      
      const loadedEquippedPets = savedState.inventory.equippedPets || [];
      const equippedPets = Array.isArray(loadedEquippedPets)
        ? [...loadedEquippedPets, null, null, null].slice(0, 3)
        : [null, null, null];


      const mergedInventory = {
        ...baseInventory,
        ...savedState.inventory,
        seeds: { ...baseInventory.seeds, ...savedState.inventory?.seeds },
        fruits: { ...baseInventory.fruits, ...savedState.inventory?.fruits },
        boostedFruits: { ...baseInventory.boostedFruits, ...savedState.inventory?.boostedFruits },
        racoonInfectedFruits: { ...baseInventory.racoonInfectedFruits, ...savedState.inventory?.racoonInfectedFruits },
        pets: { ...baseInventory.pets, ...savedState.inventory?.pets },
        goldenPets: savedState.inventory?.goldenPets || [],
        diamondPets: savedState.inventory?.diamondPets || [],
        rainbowPets: savedState.inventory?.rainbowPets || [],
        petAges: { ...baseInventory.petAges, ...savedState.inventory?.petAges },
        equippedPets,
      };

      const timeNow = Date.now();
      const lastSave = savedState.lastSaveTimestamp || timeNow;
      const offlineDuration = timeNow - lastSave;
      
      let finalPlots: Plant[] = JSON.parse(JSON.stringify(savedState.plots)).map((p: any) => ({
        ...p,
        mutations: Array.isArray(p.mutations) ? p.mutations : (p.mutation ? [p.mutation] : [])
      }));
      let finalInventory = mergedInventory;

      // OFFLINE PROGRESS SIMULATION
      if (offlineDuration > 10000) { // More than 10 seconds
          const offlineSeconds = Math.floor(offlineDuration / 1000);
          const offlineNotifications: string[] = [];

          // 1. Plant Growth Simulation (ONLY)
          const chickenCount = finalInventory.equippedPets.filter(p => p === 'chicken').length;
          const rainbowPetCount = finalInventory.equippedPets.filter(p => p !== null && finalInventory.rainbowPets.includes(p)).length;
          const chickenMultiplier = Math.pow(0.7, chickenCount);
          const rainbowMultiplier = Math.pow(0.5, rainbowPetCount);
          const growthMultiplier = chickenMultiplier * rainbowMultiplier;
          
          let plantsGrew = false;
          finalPlots = finalPlots.map((plot: Plant) => {
              let currentPlot = { ...plot, variant: plot.variant || 'normal', boosted: plot.boosted || false, mutations: plot.mutations || [] };
              if (!currentPlot.type || !currentPlot.nextPhaseAt) return currentPlot;
              
              let madeChange = false;
              while (currentPlot.nextPhaseAt && timeNow >= currentPlot.nextPhaseAt && (currentPlot.status === 'growing' || currentPlot.status === 'fruiting')) {
                  madeChange = true;
                  const seed = SEED_DATA[currentPlot.type];
                  if (currentPlot.status === 'growing') {
                      if (seed.singleHarvest) {
                          currentPlot.status = 'ready';
                          currentPlot.nextPhaseAt = null;
                      } else {
                          currentPlot.status = 'fruiting';
                          currentPlot.nextPhaseAt += (seed.fruitGrowTime * growthMultiplier) * 1000;
                      }
                  } else if (currentPlot.status === 'fruiting') {
                      currentPlot.status = 'ready';
                      currentPlot.nextPhaseAt = null;
                  }
              }
              if(madeChange) plantsGrew = true;
              return currentPlot;
          });
          if(plantsGrew) offlineNotifications.push("Tanaman Anda tumbuh.");
          
          setMoney(savedState.money);
          setInventory(finalInventory);
          setPlots(finalPlots);
          setUpgradeCost(savedState.upgradeCost || 10);
          setUnlockedSeeds(savedState.unlockedSeeds || ['mango']);

          if (offlineNotifications.length > 0) {
              const offlineMinutes = Math.floor(offlineSeconds / 60);
              const summary = `Selamat datang kembali! Saat Anda pergi ~${offlineMinutes} menit: ${offlineNotifications.join(' ')}`;
              setTimeout(() => showNotification({ text: summary, type: 'info' }), 1500);
          }
          
      } else {
          // Normal load for short offline times, but with more robust growth check
          const chickenCount = mergedInventory.equippedPets.filter(p => p === 'chicken').length;
          const rainbowPetCount = mergedInventory.equippedPets.filter(p => p !== null && mergedInventory.rainbowPets.includes(p)).length;
          const chickenMultiplier = Math.pow(0.7, chickenCount);
          const rainbowMultiplier = Math.pow(0.5, rainbowPetCount);
          const growthMultiplier = chickenMultiplier * rainbowMultiplier;

          const updatedPlots = finalPlots.map((plot: Plant) => {
            let currentPlot = { ...plot, variant: plot.variant || 'normal', boosted: plot.boosted || false, mutations: plot.mutations || [] };
            if (!currentPlot.type || !currentPlot.nextPhaseAt) return currentPlot;
             while (currentPlot.nextPhaseAt && timeNow >= currentPlot.nextPhaseAt && (currentPlot.status === 'growing' || currentPlot.status === 'fruiting')) {
                  const seed = SEED_DATA[currentPlot.type];
                  if (currentPlot.status === 'growing') {
                      if (seed.singleHarvest) {
                          currentPlot.status = 'ready';
                          currentPlot.nextPhaseAt = null;
                      } else {
                          currentPlot.status = 'fruiting';
                          currentPlot.nextPhaseAt += (seed.fruitGrowTime * growthMultiplier) * 1000;
                      }
                  } else if (currentPlot.status === 'fruiting') {
                      currentPlot.status = 'ready';
                      currentPlot.nextPhaseAt = null;
                  }
              }
            return currentPlot;
          });
          setMoney(savedState.money);
          setInventory(mergedInventory);
          setPlots(updatedPlots);
          setUpgradeCost(savedState.upgradeCost || 10);
          setUnlockedSeeds(savedState.unlockedSeeds || ['mango']);
      }
    }
  }, [showNotification]);

  const appStateRef = useRef({ money, inventory, plots, upgradeCost, unlockedSeeds });
  appStateRef.current = { money, inventory, plots, upgradeCost, unlockedSeeds };

  useEffect(() => {
    const saveGameState = () => {
      const stateToSave = { ...appStateRef.current, lastSaveTimestamp: Date.now() };
      localStorage.setItem(GAME_STATE_KEY, JSON.stringify(stateToSave));
    };
    
    const saveInterval = setInterval(saveGameState, 5000);
    window.addEventListener('beforeunload', saveGameState);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', saveGameState);
    };
  }, []);


  const restockShop = useCallback(() => {
    const newStock: Record<SeedType, number> = { mango: 0, cacao: 0, grape: 0, bamboo: 0, strawberry: 0, apple: 0, beanstalk: 0, emberlily: 0, jasmine: 0 };
    newStock.mango = Math.random() < 0.9 ? 5 : 2;
    if (Math.random() < 0.9) newStock.cacao = Math.random() < 0.78 ? 2 : 1;
    if (Math.random() < 0.8) newStock.grape = Math.random() < 0.01 ? 2 : 1;
    let bambooStock = 0;
    if (Math.random() < 0.78) bambooStock += 1;
    if (Math.random() < 0.75) bambooStock += 4;
    newStock.bamboo = bambooStock;
    if (Math.random() < 0.45) newStock.strawberry = Math.floor(Math.random() * 3) + 1;
    if (Math.random() < 0.20) newStock.apple = 1;
    if (Math.random() < 0.12) newStock.beanstalk = 1;
    if (Math.random() < 0.10) newStock.emberlily = 1;
    if (Math.random() < 0.08) newStock.jasmine = 1;


    setShopStock(newStock);
    
    let sizeBonusStock = 0;
    const rand = Math.random();
    if (rand < 0.01) {
        sizeBonusStock = 4;
    } else if (rand < 0.8) {
        sizeBonusStock = 1;
    }

    setGearShopStock({ wateringCans: 3, sizeBonus: sizeBonusStock });
  }, []);

  useEffect(() => {
    restockShop();
    const intervalId = setInterval(() => {
        restockShop();
        showNotification({ text: 'Stok toko telah diperbarui!', type: 'info' });
    }, 120000);
    return () => clearInterval(intervalId);
  }, [restockShop, showNotification]);

  const handleBuySeed = (seedType: SeedType) => {
    playMusicIfNeeded();
    const seed = SEED_DATA[seedType];
    const finalCost = seed.cost;

    if (shopStock[seedType] <= 0) {
        showNotification({ text: `Benih ${seed.name} sudah habis!`, type: 'error' });
        return;
    }
    if (money >= finalCost) {
      setMoney((prev) => prev - finalCost);
      setInventory((prev) => ({
        ...prev,
        seeds: { ...prev.seeds, [seedType]: prev.seeds[seedType] + 1 },
      }));
      setShopStock(prev => ({ ...prev, [seedType]: prev[seedType] - 1 }));
      showNotification({ text: `Benih ${seed.name} dibeli!`, type: 'success' });
      if (!unlockedSeeds.includes(seedType)) {
        setUnlockedSeeds(prev => [...prev, seedType]);
      }
    } else {
      showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };
  
  const handleBuyWateringCan = () => {
    playMusicIfNeeded();
    const cost = 50;
    const finalCost = cost;

    if (gearShopStock.wateringCans <= 0) {
        showNotification({ text: 'Watering can sudah habis!', type: 'error' });
        return;
    }
     if (money >= finalCost) {
      setMoney((prev) => prev - finalCost);
      setInventory((prev) => ({ ...prev, wateringCans: prev.wateringCans + 1 }));
      setGearShopStock(prev => ({ ...prev, wateringCans: prev.wateringCans - 1 }));
      showNotification({ text: `Watering can dibeli!`, type: 'success' });
    } else {
      showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };
  
  const handleBuySizeBonus = () => {
    playMusicIfNeeded();
    const cost = 200;
    const finalCost = cost;

    if (gearShopStock.sizeBonus <= 0) {
        showNotification({ text: 'Pupuk Super sudah habis!', type: 'error' });
        return;
    }
     if (money >= finalCost) {
      setMoney((prev) => prev - finalCost);
      setInventory((prev) => ({ ...prev, sizeBonus: prev.sizeBonus + 1 }));
      setGearShopStock(prev => ({ ...prev, sizeBonus: prev.sizeBonus - 1 }));
      showNotification({ text: `Pupuk Super dibeli!`, type: 'success' });
    } else {
      showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };

  const handleBuySuperDuperSpeed = () => {
    playMusicIfNeeded();
    const cost = 100;
    const finalCost = cost;
    if (money >= finalCost) {
        setMoney(prev => prev - finalCost);
        setInventory(prev => ({ ...prev, superDuperSpeed: (prev.superDuperSpeed || 0) + 1 }));
        showNotification({ text: `Super Duper Speed dibeli!`, type: 'success' });
    } else {
        showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };

  const handleBuyPetShardGold = () => {
    playMusicIfNeeded();
    const cost = 800;
    const finalCost = cost;
    if (money >= finalCost) {
        setMoney(prev => prev - finalCost);
        setInventory(prev => ({ ...prev, petShardGold: (prev.petShardGold || 0) + 1 }));
        showNotification({ text: `Pet Shard Gold dibeli!`, type: 'success' });
    } else {
        showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };

  const handleBuyPetShardDiamond = () => {
    playMusicIfNeeded();
    const cost = 1500;
    if (money >= cost) {
        setMoney(prev => prev - cost);
        setInventory(prev => ({ ...prev, petShardDiamond: (prev.petShardDiamond || 0) + 1 }));
        showNotification({ text: `Pet Shard Diamond dibeli!`, type: 'success' });
    } else {
        showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };

  const handleBuyPetShardRainbow = () => {
    playMusicIfNeeded();
    const cost = 2000;
    if (money >= cost) {
        setMoney(prev => prev - cost);
        setInventory(prev => ({ ...prev, petShardRainbow: (prev.petShardRainbow || 0) + 1 }));
        showNotification({ text: `Pet Shard Rainbow dibeli!`, type: 'success' });
    } else {
        showNotification({ text: 'Uang tidak cukup!', type: 'error' });
    }
  };

  const handleSelectSeed = (seedType: SeedType) => {
    if (inventory.seeds[seedType] > 0) {
      setSelectedSeed((prev) => (prev === seedType ? null : seedType));
      setIsShovelSelected(false);
      setIsWateringCanSelected(false);
      setIsSizeBonusSelected(false);
      setIsSuperDuperSpeedSelected(false);
      setIsPetShardGoldSelected(false);
      setIsPetShardDiamondSelected(false);
      setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Benih habis!', type: 'info' });
    }
  };
  
  const handleToggleShovel = () => {
    setIsShovelSelected(prev => !prev);
    setSelectedSeed(null);
    setIsWateringCanSelected(false);
    setIsSizeBonusSelected(false);
    setIsSuperDuperSpeedSelected(false);
    setIsPetShardGoldSelected(false);
    setIsPetShardDiamondSelected(false);
    setIsPetShardRainbowSelected(false);
  };
  
  const handleToggleWateringCan = () => {
    if (inventory.wateringCans > 0) {
        setIsWateringCanSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsSizeBonusSelected(false);
        setIsSuperDuperSpeedSelected(false);
        setIsPetShardGoldSelected(false);
        setIsPetShardDiamondSelected(false);
        setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Watering can habis!', type: 'info' });
    }
  };
  
  const handleToggleSizeBonus = () => {
    if (inventory.sizeBonus > 0) {
        setIsSizeBonusSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsWateringCanSelected(false);
        setIsSuperDuperSpeedSelected(false);
        setIsPetShardGoldSelected(false);
        setIsPetShardDiamondSelected(false);
        setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Pupuk Super habis!', type: 'info' });
    }
  }
  
  const handleToggleSuperDuperSpeed = () => {
    if (inventory.superDuperSpeed > 0) {
        setIsSuperDuperSpeedSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsWateringCanSelected(false);
        setIsSizeBonusSelected(false);
        setIsPetShardGoldSelected(false);
        setIsPetShardDiamondSelected(false);
        setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Super Duper Speed habis!', type: 'info' });
    }
  };
  
  const handleTogglePetShardGold = () => {
    if (inventory.petShardGold > 0) {
        setIsPetShardGoldSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsWateringCanSelected(false);
        setIsSizeBonusSelected(false);
        setIsSuperDuperSpeedSelected(false);
        setIsPetShardDiamondSelected(false);
        setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Pet Shard Gold habis!', type: 'info' });
    }
  };

  const handleTogglePetShardDiamond = () => {
    if (inventory.petShardDiamond > 0) {
        setIsPetShardDiamondSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsWateringCanSelected(false);
        setIsSizeBonusSelected(false);
        setIsSuperDuperSpeedSelected(false);
        setIsPetShardGoldSelected(false);
        setIsPetShardRainbowSelected(false);
    } else {
        showNotification({ text: 'Pet Shard Diamond habis!', type: 'info' });
    }
  };

  const handleTogglePetShardRainbow = () => {
    if (inventory.petShardRainbow > 0) {
        setIsPetShardRainbowSelected(prev => !prev);
        setSelectedSeed(null);
        setIsShovelSelected(false);
        setIsWateringCanSelected(false);
        setIsSizeBonusSelected(false);
        setIsSuperDuperSpeedSelected(false);
        setIsPetShardGoldSelected(false);
        setIsPetShardDiamondSelected(false);
    } else {
        showNotification({ text: 'Pet Shard Rainbow habis!', type: 'info' });
    }
  };

  const handlePlotClick = (plotId: number) => {
    playMusicIfNeeded();
    const plot = plots.find(p => p.id === plotId);
    if (!plot) return;

    if (isSuperDuperSpeedSelected) {
        if ((plot.status === 'growing' || plot.status === 'fruiting') && inventory.superDuperSpeed > 0) {
            setInventory(prev => ({ ...prev, superDuperSpeed: prev.superDuperSpeed - 1 }));
            setPlots(prev => prev.map(p => p.id === plotId ? { ...p, status: 'ready', variant: 'rainbow', nextPhaseAt: null, boosted: false } : p));
            showNotification({ text: 'Tanaman tumbuh instan menjadi rainbow!', type: 'success' });
            setIsSuperDuperSpeedSelected(false);
        }
        return;
    }

    if (isShovelSelected) {
      if (plot.status !== 'empty') {
        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, type: null, plantedAt: null, nextPhaseAt: null, status: 'empty', boosted: false, variant: 'normal', mutations: [] } : p));
        showNotification({ text: 'Tanaman telah dicabut!', type: 'info' });
        setIsShovelSelected(false);
      }
      return;
    }
    
    if (isWateringCanSelected) {
        if (plot.status === 'growing' || plot.status === 'fruiting') {
            if (inventory.wateringCans > 0) {
                setInventory(prev => ({ ...prev, wateringCans: prev.wateringCans - 1 }));
                setPlots(prev => prev.map(p => {
                    if (p.id === plotId && p.nextPhaseAt) {
                        const remainingTime = p.nextPhaseAt - Date.now();
                        const newNextPhaseAt = Date.now() + remainingTime * 0.5;
                        return { ...p, nextPhaseAt: newNextPhaseAt };
                    }
                    return p;
                }));
                showNotification({ text: 'Pertumbuhan tanaman dipercepat!', type: 'success' });
                setIsWateringCanSelected(false);
            }
        }
        return;
    }
    
    if (isSizeBonusSelected) {
        if (plot.status === 'ready' && !plot.boosted) {
            if(inventory.sizeBonus > 0) {
                setInventory(prev => ({...prev, sizeBonus: prev.sizeBonus - 1}));
                setPlots(prev => prev.map(p => p.id === plotId ? {...p, boosted: true} : p));
                showNotification({ text: 'Tanaman ditingkatkan!', type: 'success' });
                setIsSizeBonusSelected(false);
            }
        }
        return;
    }
    
    if (plot.status === 'empty' && selectedSeed) {
      if (inventory.seeds[selectedSeed] > 0) {
        const seed = SEED_DATA[selectedSeed];
        
        const rand = Math.random();
        let variant: PlantVariant = 'normal';
        if (rand < 0.002) { // 0.2% for rainbow
            variant = 'rainbow';
        } else if (rand < 0.202) { // 20% for gold
            variant = 'gold';
        }

        const chickenCount = inventory.equippedPets.filter(p => p === 'chicken').length;
        const rainbowPetCount = inventory.equippedPets.filter(p => p !== null && inventory.rainbowPets.includes(p)).length;
        const chickenMultiplier = Math.pow(0.7, chickenCount);
        const rainbowMultiplier = Math.pow(0.5, rainbowPetCount);
        const growthMultiplier = chickenMultiplier * rainbowMultiplier;
        
        let plantGrowTime = seed.plantGrowTime * growthMultiplier;

        if (weather === 'sunny') {
            plantGrowTime *= 0.8; // 20% faster
        }

        setInventory(prev => ({ ...prev, seeds: { ...prev.seeds, [selectedSeed]: prev.seeds[selectedSeed] - 1 }}));
        setPlots(prev => prev.map(p =>
            p.id === plotId ? { ...p, type: selectedSeed, plantedAt: Date.now(), status: 'growing', nextPhaseAt: Date.now() + plantGrowTime * 1000, variant: variant, mutations: [] } : p
        ));
        showNotification({ text: `Benih ${seed.name} ditanam!`, type: 'info' });
        setSelectedSeed(null);
      }
    } else if (plot.status === 'ready' && plot.type) {
      const fruitType = plot.type;
      const seed = SEED_DATA[fruitType];
      
      const { min, max } = seed.sellPrice;
      const basePrice = Math.floor(Math.random() * (max - min + 1)) + min;

      if (plot.mutations.length > 0) {
          const multipliers: Record<MutationType, number> = { 
            windy: 11, ascended: 54, gold: 8, gatal: 100, diamond: 250, glitch: 19, glitch_infected: 114 
          };
          const mutationNames: Record<MutationType, string> = { 
            windy: 'Windy', ascended: 'Ascended', gold: 'Emas', gatal: 'Gatal', diamond: 'Diamond', glitch: 'Glitch', glitch_infected: 'Terkorupsi'
          };
          
          let totalMultiplier = 1;
          plot.mutations.forEach(m => {
              totalMultiplier *= (multipliers[m] || 1);
          });

          const finalPrice = basePrice * totalMultiplier;
          const displayNames = plot.mutations.map(m => mutationNames[m] || m).join(' & ');
          setMoney(prev => prev + finalPrice);
          showNotification({ text: `Panen ${displayNames}! Dapat Rp ${finalPrice.toLocaleString('id-ID')}`, type: 'success' });
      } else if(plot.boosted) {
          setInventory(prev => ({...prev, boostedFruits: {...prev.boostedFruits, [fruitType]: prev.boostedFruits[fruitType] + 2}}));
          showNotification({ text: `Panen Super! 2 Buah Bonus ${seed.name} didapat!`, type: 'success' });
      } else if (plot.variant !== 'normal') {
          setInventory(prev => ({ ...prev, boostedFruits: { ...prev.boostedFruits, [fruitType]: prev.boostedFruits[fruitType] + 1 } }));
          showNotification({ text: `Panen Spesial! 1 Buah Bonus ${seed.name} didapat!`, type: 'success' });
      } else {
          setInventory(prev => ({ ...prev, fruits: { ...prev.fruits, [fruitType]: prev.fruits[fruitType] + 1 } }));
          showNotification({ text: `Buah ${seed.name} dipanen!`, type: 'success' });
      }

      setPlots(prev => prev.map(p => {
        if (p.id === plotId) {
            if (seed.singleHarvest) {
                return { ...p, status: 'empty', type: null, plantedAt: null, nextPhaseAt: null, boosted: false, variant: 'normal', mutations: [] };
            } else {
                const chickenCount = inventory.equippedPets.filter(p => p === 'chicken').length;
                const rainbowPetCount = inventory.equippedPets.filter(p => p !== null && inventory.rainbowPets.includes(p)).length;
                const chickenMultiplier = Math.pow(0.7, chickenCount);
                const rainbowMultiplier = Math.pow(0.5, rainbowPetCount);
                const growthMultiplier = chickenMultiplier * rainbowMultiplier;

                let fruitGrowTime = seed.fruitGrowTime * growthMultiplier;
                return { ...p, status: 'fruiting', nextPhaseAt: Date.now() + fruitGrowTime * 1000, boosted: false, variant: 'normal', mutations: [] };
            }
        }
        return p;
      }));
    }
  };
  
  const handleSellFruit = (fruitType: SeedType) => {
    playMusicIfNeeded();
    if (inventory.fruits[fruitType] > 0) {
      const { min, max } = SEED_DATA[fruitType].sellPrice;
      const price = Math.floor(Math.random() * (max - min + 1)) + min;
      setMoney(prev => prev + price);
      setInventory(prev => ({ ...prev, fruits: { ...prev.fruits, [fruitType]: prev.fruits[fruitType] - 1 } }));
      showNotification({ text: `Menjual 1 ${SEED_DATA[fruitType].name} seharga Rp ${price}`, type: 'success' });
    }
  };
  
  const handleSellBoostedFruit = (fruitType: SeedType) => {
    playMusicIfNeeded();
    if (inventory.boostedFruits[fruitType] > 0) {
      const { min, max } = SEED_DATA[fruitType].sellPrice;
      const price = (Math.floor(Math.random() * (max - min + 1)) + min) * 5;
      setMoney(prev => prev + price);
      setInventory(prev => ({ ...prev, boostedFruits: { ...prev.boostedFruits, [fruitType]: prev.boostedFruits[fruitType] - 1 } }));
      showNotification({ text: `Menjual 1 Buah Bonus ${SEED_DATA[fruitType].name} seharga Rp ${price}!`, type: 'success' });
    }
  };

  const handleSellRacoonInfectedFruit = (fruitType: SeedType) => {
    playMusicIfNeeded();
    if (inventory.racoonInfectedFruits[fruitType] > 0) {
        const { min, max } = SEED_DATA[fruitType].sellPrice;
        const price = (Math.floor(Math.random() * (max - min + 1)) + min) * 80;
        setMoney(prev => prev + price);
        setInventory(prev => ({ ...prev, racoonInfectedFruits: { ...prev.racoonInfectedFruits, [fruitType]: prev.racoonInfectedFruits[fruitType] - 1 } }));
        showNotification({ text: `Menjual 1 Buah Terinfeksi ${SEED_DATA[fruitType].name} seharga Rp ${price}!`, type: 'success' });
    }
  }

  const handleUpgradeGarden = () => {
    playMusicIfNeeded();
    if (money >= upgradeCost) {
        setMoney(prev => prev - upgradeCost);
        const newPlotId = plots.length;
        setPlots(prev => [ ...prev, { id: newPlotId, type: null, plantedAt: null, nextPhaseAt: null, status: 'empty', boosted: false, variant: 'normal', isNew: true, mutations: [] }]);
        setUpgradeCost(prev => prev + 20);
        showNotification({ text: `Kebun berhasil di-upgrade! Anda sekarang punya ${plots.length + 1} petak.`, type: 'success' });

        setTimeout(() => {
            setPlots(prevPlots => prevPlots.map(p => p.id === newPlotId ? { ...p, isNew: false } : p));
        }, 500);
    } else {
        showNotification({ text: `Uang tidak cukup! Butuh Rp ${upgradeCost.toLocaleString('id-ID')}.`, type: 'error' });
    }
  }

  const handleBuyEgg = () => {
    playMusicIfNeeded();
    const cost = 1500;
    const finalCost = cost;

    if (money < finalCost) {
      showNotification({ text: 'Uang tidak cukup untuk membeli telur!', type: 'error' });
      return;
    }
    setMoney(prev => prev - finalCost);

    const weights = PET_EGG_WEIGHTS;
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const rand = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let chosenPet: PetType | null = null;
    for (const pet of (Object.keys(weights) as PetType[])) {
        if (weights[pet] === 0) continue;
        cumulativeWeight += weights[pet];
        if (rand < cumulativeWeight) {
            chosenPet = pet;
            break;
        }
    }
    
    if (chosenPet) {
        setInventory(prev => ({
            ...prev,
            pets: { ...prev.pets, [chosenPet!]: (prev.pets[chosenPet!] || 0) + 1 }
        }));
        showNotification({ text: `Telur menetas menjadi seekor ${PET_DATA[chosenPet].name}!`, type: 'success' });
    } else {
        showNotification({ text: 'Telur ternyata kosong...', type: 'info' });
    }
    setIsEggShopOpen(false);
  };

  const handleBuyGlitchEgg = () => {
    playMusicIfNeeded();
    const cost = 5000;

    if (money < cost) {
      showNotification({ text: 'Uang tidak cukup untuk membeli Telur Glitch!', type: 'error' });
      return;
    }
    setMoney(prev => prev - cost);

    const weights = GLITCH_EGG_WEIGHTS;
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const rand = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let chosenPet: GlitchPetType | null = null;
    for (const pet of (Object.keys(weights) as GlitchPetType[])) {
        cumulativeWeight += weights[pet];
        if (rand < cumulativeWeight) {
            chosenPet = pet;
            break;
        }
    }
    
    if (chosenPet) {
        setInventory(prev => ({
            ...prev,
            pets: { ...prev.pets, [chosenPet!]: (prev.pets[chosenPet!] || 0) + 1 }
        }));
        showNotification({ text: `Telur Glitch menetas menjadi seekor ${PET_DATA[chosenPet].name}!`, type: 'success' });
    } else {
        showNotification({ text: 'Telur Glitch ternyata kosong...', type: 'info' });
    }
    setIsEggShopOpen(false);
  };

  const handleEquipPet = (petType: PetType) => {
    playMusicIfNeeded();
    const ownedCount = inventory.pets[petType] || 0;
    const equippedCount = inventory.equippedPets.filter(p => p === petType).length;

    if (equippedCount >= ownedCount) {
        showNotification({ text: `Tidak ada ${PET_DATA[petType].name} lagi yang bisa dipasang.`, type: 'info' });
        return;
    }

    const emptySlotIndex = inventory.equippedPets.findIndex(p => p === null);
    if (emptySlotIndex === -1) {
        showNotification({ text: 'Slot pet sudah penuh!', type: 'error' });
        return;
    }

    const newEquippedPets = [...inventory.equippedPets];
    newEquippedPets[emptySlotIndex] = petType;
    setInventory(prev => ({ ...prev, equippedPets: newEquippedPets }));

    const petData = PET_DATA[petType];
    const cooldowns: Record<PetType, number> = {
        fox: 240, racoon: 240, griffin: 120, ulat: 120, chicken: 0,
        glitch: 120, golemGlitch: 120, glitchFox: 420
    };
    const newAbilityCooldowns = [...abilityCooldowns];
    const rainbowPetCount = newEquippedPets.filter(p => p !== null && inventory.rainbowPets.includes(p)).length;
    const cooldownMultiplier = Math.pow(0.75, rainbowPetCount);
    
    newAbilityCooldowns[emptySlotIndex] = petData.name === 'Chicken' ? null : cooldowns[petType] * cooldownMultiplier;
    setAbilityCooldowns(newAbilityCooldowns);

    showNotification({ text: `Memasang ${petData.name}.`, type: 'info' });
  };
  
  const handleUnequipPet = (index: number) => {
    playMusicIfNeeded();
    const petType = inventory.equippedPets[index];
    if (!petType) return;

    const newEquippedPets = [...inventory.equippedPets];
    newEquippedPets[index] = null;
    
    const newCooldowns = [...abilityCooldowns];
    newCooldowns[index] = null;
    
    setInventory(prev => ({ ...prev, equippedPets: newEquippedPets }));
    setAbilityCooldowns(newCooldowns);

    showNotification({ text: `Melepas ${PET_DATA[petType].name}.`, type: 'info' });
  };

  const handleApplyShardToPet = (petType: PetType) => {
      if (!isPetShardGoldSelected) return;

      if (inventory.petShardGold > 0 && inventory.pets[petType] > 0) {
          setInventory(prev => {
              const isGolden = prev.goldenPets.includes(petType);
              const isDiamond = prev.diamondPets.includes(petType);
              const isRainbow = prev.rainbowPets.includes(petType);
              const mutationCount = (isGolden ? 1 : 0) + (isDiamond ? 1 : 0);

              if (isGolden) {
                  showNotification({ text: `Pet ${PET_DATA[petType].name} sudah Emas!`, type: 'info' });
                  return prev;
              }
              if (isRainbow) {
                  showNotification({ text: `Tidak dapat menerapkan pada pet Pelangi!`, type: 'error' });
                  return prev;
              }
              if (mutationCount >= 2) {
                  showNotification({ text: `Pet ${PET_DATA[petType].name} sudah memiliki 2 mutasi!`, type: 'error' });
                  return prev;
              }

              showNotification({ text: `Pet ${PET_DATA[petType].name} bermutasi menjadi Emas!`, type: 'success' });
              
              // This state needs to be updated outside of the inventory update
              // to avoid stale closures if the notification is shown before state is set
              setTimeout(() => setIsPetShardGoldSelected(false), 0);

              return {
                  ...prev,
                  petShardGold: prev.petShardGold - 1,
                  goldenPets: [...prev.goldenPets, petType],
              };
          });
      }
  };

  const handleApplyShardToPetDiamond = (petType: PetType) => {
      if (!isPetShardDiamondSelected) return;

      if (inventory.petShardDiamond > 0 && inventory.pets[petType] > 0) {
          setInventory(prev => {
              const isGolden = prev.goldenPets.includes(petType);
              const isDiamond = prev.diamondPets.includes(petType);
              const isRainbow = prev.rainbowPets.includes(petType);
              const mutationCount = (isGolden ? 1 : 0) + (isDiamond ? 1 : 0);

              if (isDiamond) {
                  showNotification({ text: `Pet ${PET_DATA[petType].name} sudah Diamond!`, type: 'info' });
                  return prev;
              }
              if (isRainbow) {
                  showNotification({ text: `Tidak dapat menerapkan pada pet Pelangi!`, type: 'error' });
                  return prev;
              }
              if (mutationCount >= 2) {
                  showNotification({ text: `Pet ${PET_DATA[petType].name} sudah memiliki 2 mutasi!`, type: 'error' });
                  return prev;
              }

              showNotification({ text: `Pet ${PET_DATA[petType].name} bermutasi menjadi Diamond!`, type: 'success' });
              setTimeout(() => setIsPetShardDiamondSelected(false), 0);
              
              return {
                  ...prev,
                  petShardDiamond: prev.petShardDiamond - 1,
                  diamondPets: [...prev.diamondPets, petType],
              };
          });
      }
  };
  
  const handleApplyShardToPetRainbow = (petType: PetType) => {
      if (!isPetShardRainbowSelected) return;

      if (inventory.petShardRainbow > 0 && inventory.pets[petType] > 0) {
          setInventory(prev => {
              if (prev.rainbowPets.includes(petType)) {
                  showNotification({ text: `Pet ${PET_DATA[petType].name} sudah Pelangi!`, type: 'info' });
                  return prev;
              }
              showNotification({ text: `Pet ${PET_DATA[petType].name} bermutasi menjadi Pelangi!`, type: 'success' });
              setTimeout(() => setIsPetShardRainbowSelected(false), 0);

              return {
                  ...prev,
                  petShardRainbow: prev.petShardRainbow - 1,
                  rainbowPets: [...prev.rainbowPets, petType],
                  goldenPets: prev.goldenPets.filter(p => p !== petType),
                  diamondPets: prev.diamondPets.filter(p => p !== petType),
              };
          });
      }
  };
  
  const getRandomSeedByRarity = () => {
      const rarityWeights: { type: SeedType, weight: number }[] = [
          { type: 'mango', weight: 90 },
          { type: 'cacao', weight: 70 },
          { type: 'grape', weight: 80 },
          { type: 'bamboo', weight: 60 },
          { type: 'strawberry', weight: 45 },
          { type: 'apple', weight: 20 },
          { type: 'beanstalk', weight: 12 },
          { type: 'emberlily', weight: 10 },
          { type: 'jasmine', weight: 8 },
      ];

      const totalWeight = rarityWeights.reduce((sum, seed) => sum + seed.weight, 0);
      const rand = Math.random() * totalWeight;

      let cumulativeWeight = 0;
      for (const seed of rarityWeights) {
          cumulativeWeight += seed.weight;
          if (rand < cumulativeWeight) {
              return seed.type;
          }
      }
      return 'mango'; // Fallback
  };
  
  // UNIFIED GAME TICK
  useEffect(() => {
      let ageCounter = 0;
      const chickenCount = inventory.equippedPets.filter(p => p === 'chicken').length;
      const rainbowPetCount = inventory.equippedPets.filter(p => p !== null && inventory.rainbowPets.includes(p)).length;
      const chickenMultiplier = Math.pow(0.7, chickenCount);
      const rainbowMultiplier = Math.pow(0.5, rainbowPetCount);
      const growthMultiplier = chickenMultiplier * rainbowMultiplier;
      const cooldownMultiplier = Math.pow(0.75, rainbowPetCount);

      const gameTick = setInterval(() => {
          // 1. Update Plant Status
          setPlots(currentPlots =>
            currentPlots.map(plot => {
              if (!plot.type || !plot.nextPhaseAt || Date.now() < plot.nextPhaseAt) return plot;
              
              const seed = SEED_DATA[plot.type];
              if (plot.status === 'growing') {
                if (seed.singleHarvest) {
                    return { ...plot, status: 'ready', nextPhaseAt: null };
                }
                
                let fruitGrowTime = seed.fruitGrowTime * growthMultiplier;
                if (weather === 'sunny') {
                    fruitGrowTime *= 0.8;
                }
                return { ...plot, status: 'fruiting', nextPhaseAt: plot.nextPhaseAt + fruitGrowTime * 1000 };
              }
              if (plot.status === 'fruiting') {
                return { ...plot, status: 'ready', nextPhaseAt: null };
              }
              return plot;
            })
          );
  
          // 2. Update Equipped Pet Cooldowns and Trigger Abilities
          setAbilityCooldowns(prevCooldowns => {
            const newCooldowns = [...prevCooldowns];
            
            inventory.equippedPets.forEach((petType, index) => {
                if (petType && newCooldowns[index] !== null) {
                    newCooldowns[index] = newCooldowns[index]! - 1;

                    if (newCooldowns[index]! <= 0) {
                        switch(petType) {
                            case 'fox':
                                const randomSeed = getRandomSeedByRarity();
                                if (Math.random() < 0.01) {
                                    setInventory(prev => ({...prev, superDuperSpeed: (prev.superDuperSpeed || 0) + 1 }));
                                    showNotification({ text: `Fox menemukan Super Duper Speed!`, type: 'info' });
                                } else {
                                    setInventory(prev => ({...prev, seeds: {...prev.seeds, [randomSeed]: prev.seeds[randomSeed] + 1 }}));
                                    showNotification({ text: `Fox menemukan benih ${SEED_DATA[randomSeed].name}!`, type: 'info' });
                                }
                                newCooldowns[index] = 240 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'racoon':
                                const allFruitTypes = (Object.keys(SEED_DATA) as SeedType[]).filter(s => !SEED_DATA[s].singleHarvest);
                                if (allFruitTypes.length > 0) {
                                    const randomFruit = allFruitTypes[Math.floor(Math.random() * allFruitTypes.length)];
                                    setInventory(prev => ({...prev, racoonInfectedFruits: {...prev.racoonInfectedFruits, [randomFruit]: (prev.racoonInfectedFruits[randomFruit] || 0) + 1}}));
                                    showNotification({ text: `Racoon membawa buah ${SEED_DATA[randomFruit].name} terinfeksi!`, type: 'info' });
                                }
                                newCooldowns[index] = 240 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'griffin':
                                setPlots(currentPlots => {
                                    const readyPlots = currentPlots.filter(p => p.status === 'ready');
                                    if (readyPlots.length > 0) {
                                        const targetPlot = readyPlots[Math.floor(Math.random() * readyPlots.length)];
                                        const mutation: MutationType = Math.random() < 0.04 ? 'ascended' : 'windy';
                                        if (!targetPlot.mutations.includes(mutation)) {
                                            showNotification({ text: `Griffin memberkati tanaman dengan mutasi ${mutation}!`, type: 'info' });
                                            return applyMutation(currentPlots, targetPlot.id, mutation);
                                        }
                                    }
                                    return currentPlots;
                                });
                                newCooldowns[index] = 120 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'ulat':
                                setPlots(currentPlots => {
                                    const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('gatal'));
                                    if (eligiblePlots.length > 0) {
                                        const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                                        showNotification({ text: `Ulat memberikan mutasi Gatal pada tanaman!`, type: 'info' });
                                        return applyMutation(currentPlots, targetPlot.id, 'gatal');
                                    }
                                    return currentPlots;
                                });
                                newCooldowns[index] = 120 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'glitch':
                                setPlots(currentPlots => {
                                    if (Math.random() < 0.19) {
                                        const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('glitch'));
                                        if (eligiblePlots.length > 0) {
                                            const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                                            showNotification({ text: `Glitch Pet menjilat tanaman!`, type: 'info' });
                                            return applyMutation(currentPlots, targetPlot.id, 'glitch');
                                        }
                                    }
                                    return currentPlots;
                                });
                                newCooldowns[index] = 120 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'golemGlitch':
                                setPlots(currentPlots => {
                                    const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('glitch_infected'));
                                    if (eligiblePlots.length > 0) {
                                        const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                                        showNotification({ text: `Golem Glitch merusak tanaman!`, type: 'info' });
                                        return applyMutation(currentPlots, targetPlot.id, 'glitch_infected');
                                    }
                                    return currentPlots;
                                });
                                newCooldowns[index] = 120 * cooldownMultiplier; // Reset cooldown
                                break;
                            case 'glitchFox':
                                const toolRand = Math.random();
                                if (toolRand < 0.8) { // 80% chance for watering can
                                    setInventory(prev => ({...prev, wateringCans: prev.wateringCans + 1}));
                                    showNotification({ text: `Teriakan Glitch Fox memberimu Penyiram Tanaman!`, type: 'info' });
                                } else { // 20% chance for size bonus
                                    setInventory(prev => ({...prev, sizeBonus: prev.sizeBonus + 1}));
                                    showNotification({ text: `Teriakan Glitch Fox memberimu Pupuk Super!`, type: 'info' });
                                }
                                newCooldowns[index] = 420 * cooldownMultiplier; // Reset cooldown
                                break;
                        }
                    }
                }
            });
            return newCooldowns;
          });
          
          // 3. Update Passive Pet Cooldowns and Trigger Abilities
          setPassiveAbilityCooldowns(prev => {
              const newPassives = { ...prev };
              const equippedGoldenPets = inventory.equippedPets.some(p => p && inventory.goldenPets.includes(p));
              const equippedDiamondPets = inventory.equippedPets.some(p => p && inventory.diamondPets.includes(p));
              const equippedRainbowPetsCount = inventory.equippedPets.filter(p => p !== null && inventory.rainbowPets.includes(p)).length;

              if (equippedGoldenPets) {
                  newPassives.gold -= 1;
                  if (newPassives.gold <= 0) {
                      newPassives.gold = 60; // Reset
                      setPlots(currentPlots => {
                          const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('gold'));
                          if (eligiblePlots.length > 0 && Math.random() < 0.98) {
                              const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                              showNotification({ text: `Pet Emas memberkati tanaman dengan mutasi Emas!`, type: 'info' });
                              return applyMutation(currentPlots, targetPlot.id, 'gold');
                          }
                          return currentPlots;
                      });
                  }
              }

              if (equippedDiamondPets) {
                  newPassives.diamond -= 1;
                  if (newPassives.diamond <= 0) {
                      newPassives.diamond = 60; // Reset
                       setPlots(currentPlots => {
                          const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('diamond'));
                          if (eligiblePlots.length > 0 && Math.random() < 0.98) {
                              const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                              showNotification({ text: `Pet Diamond memberkati tanaman dengan mutasi Diamond!`, type: 'info' });
                              return applyMutation(currentPlots, targetPlot.id, 'diamond');
                          }
                          return currentPlots;
                      });
                  }
              }
            
              if (equippedRainbowPetsCount > 0) {
                  newPassives.rainbow -= 1;
                  if (newPassives.rainbow <= 0) {
                      newPassives.rainbow = 60; // Reset
                      for (let i = 0; i < equippedRainbowPetsCount; i++) {
                          if (Math.random() < 0.01) {
                              setPlots(currentPlots => {
                                  const eligiblePlots = currentPlots.filter(p => p.status !== 'empty' && !p.mutations.includes('gold'));
                                  if (eligiblePlots.length > 0) {
                                      const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                                      showNotification({ text: `Pet Pelangi memberkati tanaman dengan mutasi Emas!`, type: 'info' });
                                      return applyMutation(currentPlots, targetPlot.id, 'gold');
                                  }
                                  return currentPlots;
                              });
                          }
                          if (Math.random() < 0.01) {
                              setPlots(currentPlots => {
                                  const eligiblePlots = currentPlots.filter(p => p.status === 'ready' && !p.boosted);
                                  if (eligiblePlots.length > 0) {
                                      const targetPlot = eligiblePlots[Math.floor(Math.random() * eligiblePlots.length)];
                                      showNotification({ text: `Pet Pelangi memberkati tanaman dengan Panen Super!`, type: 'info' });
                                      return currentPlots.map(p => p.id === targetPlot.id ? {...p, boosted: true} : p);
                                  }
                                  return currentPlots;
                              });
                          }
                      }
                  }
              }
              return newPassives;
          });

          ageCounter++;
          if (ageCounter >= 60) {
              ageCounter = 0;
              const ulatCount = inventory.equippedPets.filter(p => p === 'ulat').length;
              setInventory(prev => {
                  const ownedPetTypes = (Object.keys(prev.pets) as PetType[]).filter(p => prev.pets[p] > 0);
                  if (ownedPetTypes.length === 0) return prev;

                  const newAges = { ...prev.petAges };
                  ownedPetTypes.forEach(pType => {
                      let ageIncrease = 1 + (pType !== 'ulat' ? ulatCount : 0);
                      newAges[pType] = (newAges[pType] || 0) + ageIncrease;
                  });
                  return { ...prev, petAges: newAges };
              });
          }
      }, 1000);
  
      return () => clearInterval(gameTick);
  }, [inventory, weather, showNotification]);

  const handleConsoleCommand = (command: string) => {
    setIsAdminConsoleOpen(false);
    
    const parts = command.trim().split(' ').filter(p => p);
    if (parts.length === 0) return;

    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (cmd) {
        case '/help': {
            const helpText = 'Bantuan: /yaping [pesan], /give [item] [jumlah?], /giveserver [item] [jumlah?], /givepet [nama_pet] [usia]';
            showNotification({ text: helpText, type: 'info' });
            break;
        }
        case '/yaping': {
            if (args.length === 0) {
                 showNotification({ text: 'Format salah. Gunakan: /yaping [pesan]', type: 'error' });
                 return;
            }
            const message = args.join(' ');
            if (adminMessageTimeoutRef.current) {
                clearTimeout(adminMessageTimeoutRef.current);
            }
            setAdminMessage(message);
            showNotification({ text: `Pesan global dikirim ke server: "${message}"`, type: 'info' });
            adminMessageTimeoutRef.current = window.setTimeout(() => {
                setAdminMessage(null);
            }, 5000);
            break;
        }
        case '/give': { // Give item to player
            if (args.length < 1) {
                showNotification({ text: 'Format: /give [item] [jumlah?]', type: 'error' });
                return;
            }

            let amount = 1;
            let itemNameParts = [...args];
            const lastArg = args[args.length - 1];
            const parsedAmount = parseInt(lastArg, 10);

            if (!isNaN(parsedAmount) && String(parsedAmount) === lastArg) {
                if (parsedAmount <= 0) {
                    showNotification({ text: 'Jumlah tidak valid.', type: 'error' });
                    return;
                }
                amount = parsedAmount;
                itemNameParts.pop();
            }

            if (itemNameParts.length === 0) {
                showNotification({ text: 'Nama item tidak boleh kosong.', type: 'error' });
                return;
            }

            const item = itemNameParts.join('').toLowerCase();
            
            if (item === 'money') {
                setMoney(prev => prev + amount);
                showNotification({ text: `Diberikan Rp ${amount.toLocaleString('id-ID')}`, type: 'success' });
                return;
            }

            const seedKey = (Object.keys(SEED_DATA) as SeedType[]).find(key => SEED_DATA[key].name.toLowerCase().replace(/\s/g, '') === item || key.toLowerCase() === item);
            if (seedKey) {
                 setInventory(prev => ({...prev, seeds: {...prev.seeds, [seedKey]: prev.seeds[seedKey] + amount}}));
                 showNotification({ text: `Diberikan ${amount} benih ${SEED_DATA[seedKey].name}`, type: 'success' });
                 return;
            }
            
            const petKey = (Object.keys(PET_DATA) as PetType[]).find(key => PET_DATA[key].name.toLowerCase().replace(/\s/g, '') === item || key.toLowerCase() === item);
            if(petKey) {
                setInventory(prev => ({...prev, pets: {...prev.pets, [petKey]: (prev.pets[petKey] || 0) + amount}}));
                showNotification({ text: `Diberikan ${amount} pet ${PET_DATA[petKey].name}`, type: 'success' });
                return;
            }

            const tools: Record<string, keyof InventoryType> = {
                'wateringcan': 'wateringCans',
                'penyiramtanaman': 'wateringCans',
                'sizebonus': 'sizeBonus',
                'pupuksuper': 'sizeBonus',
                'superduperspeed': 'superDuperSpeed',
                'petshardgold': 'petShardGold',
                'petsharddiamond': 'petShardDiamond',
                'petshardrainbow': 'petShardRainbow',
            };

            if (tools[item]) {
                 const toolKey = tools[item];
                 setInventory(prev => ({...prev, [toolKey]: (prev[toolKey] as number || 0) + amount}));
                 showNotification({ text: `Diberikan ${amount} ${itemNameParts.join(' ')}`, type: 'success' });
                 return;
            }

            showNotification({ text: `Item tidak ditemukan: ${itemNameParts.join(' ')}`, type: 'error' });
            break;
        }
        case '/givepet': {
            if (args.length < 2) {
                showNotification({ text: 'Format: /givepet [nama_pet] [usia]', type: 'error' });
                return;
            }

            const ageStr = args[args.length - 1];
            const age = parseInt(ageStr, 10);

            if (isNaN(age) || age < 0) {
                showNotification({ text: 'Usia tidak valid.', type: 'error' });
                return;
            }

            const petNameParts = args.slice(0, -1);
            const petName = petNameParts.join('').toLowerCase();

            const petKey = (Object.keys(PET_DATA) as PetType[]).find(key => 
                PET_DATA[key].name.toLowerCase().replace(/\s/g, '') === petName || 
                key.toLowerCase() === petName
            );

            if (petKey) {
                setInventory(prev => {
                    const newPets = { ...prev.pets, [petKey]: (prev.pets[petKey] || 0) + 1 };
                    const newAges = { ...prev.petAges, [petKey]: age };
                    return { ...prev, pets: newPets, petAges: newAges };
                });
                showNotification({ text: `Diberikan 1 pet ${PET_DATA[petKey].name} dengan usia ${age}`, type: 'success' });
            } else {
                showNotification({ text: `Pet tidak ditemukan: ${petNameParts.join(' ')}`, type: 'error' });
            }
            break;
        }
        case '/giveserver': { // Restock shop
            if (args.length < 1) {
                showNotification({ text: 'Format: /giveserver [item] [jumlah?]', type: 'error' });
                return;
            }

            let amount = 5;
            let itemNameParts = [...args];
            const lastArg = args[args.length - 1];
            const parsedAmount = parseInt(lastArg, 10);
            
            if (!isNaN(parsedAmount) && String(parsedAmount) === lastArg) {
                if (parsedAmount <= 0) {
                    showNotification({ text: 'Jumlah tidak valid.', type: 'error' });
                    return;
                }
                amount = parsedAmount;
                itemNameParts.pop();
            }

            if (itemNameParts.length === 0) {
                showNotification({ text: 'Nama item tidak boleh kosong.', type: 'error' });
                return;
            }
            
            const item = itemNameParts.join('').toLowerCase();

            const seedKey = (Object.keys(SEED_DATA) as SeedType[]).find(key => SEED_DATA[key].name.toLowerCase().replace(/\s/g, '') === item || key.toLowerCase() === item);
            if (seedKey) {
                setShopStock(prev => ({...prev, [seedKey]: (prev[seedKey] || 0) + amount }));
                showNotification({ text: `[ADMIN ABUSE] Menambahkan ${amount} ${SEED_DATA[seedKey].name} ke semua toko di server.`, type: 'success' });
                return;
            }
            
            const gearTools: Record<string, keyof typeof gearShopStock> = {
                'wateringcan': 'wateringCans',
                'penyiramtanaman': 'wateringCans',
                'sizebonus': 'sizeBonus',
                'pupuksuper': 'sizeBonus',
            };

            if (gearTools[item]) {
                const toolKey = gearTools[item];
                setGearShopStock(prev => ({...prev, [toolKey]: (prev[toolKey] || 0) + amount }));
                showNotification({ text: `[ADMIN ABUSE] Menambahkan ${amount} ${itemNameParts.join(' ')} ke semua toko di server.`, type: 'success' });
                return;
            }
            
            showNotification({ text: `Item toko tidak ditemukan: ${itemNameParts.join(' ')}`, type: 'error' });
            break;
        }
        default: {
            showNotification({ text: 'Perintah tidak dikenal. Ketik /help untuk bantuan.', type: 'error' });
            break;
        }
    }
  };

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-gray-900 via-black to-gray-900 font-sans p-4">
      <div className="max-w-7xl mx-auto">
        <Header 
            money={money} 
            onTitleClick={handleTitleClick} 
            weather={weather}
        />
        <main className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 flex flex-col gap-6 lg:sticky lg:top-28">
            <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700">
               <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    onClick={() => { setIsInventoryOpen(true); playMusicIfNeeded(); }}
                    className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                    aria-haspopup="dialog"
                    aria-expanded={isInventoryOpen}
                  >
                    Inventaris 👜
                  </button>
                  <button
                    onClick={() => { setIsShopOpen(true); playMusicIfNeeded(); }}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                    aria-haspopup="dialog"
                    aria-expanded={isShopOpen}
                  >
                    Toko Benih
                  </button>
                   <button
                    onClick={() => { setIsGearShopOpen(true); playMusicIfNeeded(); }}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                    aria-haspopup="dialog"
                    aria-expanded={isGearShopOpen}
                  >
                    Toko Alat
                  </button>
                  <button
                    onClick={() => { setCurrentPage('events'); playMusicIfNeeded(); }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                  >
                    Events 🌳
                  </button>
                  <button
                    onClick={() => { setIsEggShopOpen(true); playMusicIfNeeded(); }}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                  >
                    Toko Telur 🥚
                  </button>
                   <button
                    onClick={handleUpgradeGarden}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-3 rounded-lg transition-transform transform hover:scale-105 text-sm"
                  >
                    Upgrade Kebun
                  </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">Biaya Upgrade: Rp {upgradeCost.toLocaleString('id-ID')}</p>
            </div>
            {Array.from({ length: 3 }).map((_, index) => {
              const petType = inventory.equippedPets[index];
              return (
                 <EquippedPetDisplay
                    key={index}
                    petType={petType}
                    age={petType ? inventory.petAges[petType] || 0 : 0}
                    cooldown={abilityCooldowns[index] ?? undefined}
                    isShardSelected={isPetShardGoldSelected}
                    onDisplayClick={() => petType && handleApplyShardToPet(petType)}
                    isGolden={petType ? inventory.goldenPets.includes(petType) : false}
                    isDiamond={petType ? inventory.diamondPets.includes(petType) : false}
                    isRainbow={petType ? inventory.rainbowPets.includes(petType) : false}
                    isPetShardDiamondSelected={isPetShardDiamondSelected}
                    onApplyShardToPetDiamond={() => petType && handleApplyShardToPetDiamond(petType)}
                    isPetShardRainbowSelected={isPetShardRainbowSelected}
                    onApplyShardToPetRainbow={() => petType && handleApplyShardToPetRainbow(petType)}
                    onUnequip={() => handleUnequipPet(index)}
                />
              );
            })}
          </div>
          <div className="lg:col-span-2">
             {currentPage === 'garden' ? (
                <Garden 
                  plots={plots} 
                  onPlotClick={handlePlotClick}
                  isShovelSelected={isShovelSelected}
                  isWateringCanSelected={isWateringCanSelected}
                  isSizeBonusSelected={isSizeBonusSelected}
                  isSuperDuperSpeedSelected={isSuperDuperSpeedSelected}
                />
            ) : (
                <EventsPage 
                  onBackToGarden={() => setCurrentPage('garden')} 
                  onBuySuperDuperSpeed={handleBuySuperDuperSpeed} 
                  onBuyPetShardGold={handleBuyPetShardGold} 
                  onBuyPetShardDiamond={handleBuyPetShardDiamond} 
                  onBuyPetShardRainbow={handleBuyPetShardRainbow}
                  isGrapeUnlocked={unlockedSeeds.includes('grape')} 
                  hasGoldenPet={(inventory.goldenPets?.length || 0) > 0} 
                />
            )}
          </div>
        </main>
        <Shop
          isOpen={isShopOpen}
          onClose={() => setIsShopOpen(false)}
          onBuySeed={handleBuySeed}
          stock={shopStock}
        />
        <GearShop
            isOpen={isGearShopOpen}
            onClose={() => setIsGearShopOpen(false)}
            onBuyWateringCan={handleBuyWateringCan}
            onBuySizeBonus={handleBuySizeBonus}
            stock={gearShopStock}
        />
        <EggShop
            isOpen={isEggShopOpen}
            onClose={() => setIsEggShopOpen(false)}
            onBuyEgg={handleBuyEgg}
            onBuyGlitchEgg={handleBuyGlitchEgg}
            money={money}
        />
        <Inventory 
            isOpen={isInventoryOpen}
            onClose={() => setIsInventoryOpen(false)}
            inventory={inventory}
            selectedSeed={selectedSeed}
            isShovelSelected={isShovelSelected}
            isWateringCanSelected={isWateringCanSelected}
            isSizeBonusSelected={isSizeBonusSelected}
            isSuperDuperSpeedSelected={isSuperDuperSpeedSelected}
            isPetShardGoldSelected={isPetShardGoldSelected}
            isPetShardDiamondSelected={isPetShardDiamondSelected}
            isPetShardRainbowSelected={isPetShardRainbowSelected}
            onSelectSeed={handleSelectSeed}
            onSellFruit={handleSellFruit}
            onSellBoostedFruit={handleSellBoostedFruit}
            onSellRacoonInfectedFruit={handleSellRacoonInfectedFruit}
            onToggleShovel={handleToggleShovel}
            onToggleWateringCan={handleToggleWateringCan}
            onToggleSizeBonus={handleToggleSizeBonus}
            onToggleSuperDuperSpeed={handleToggleSuperDuperSpeed}
            onTogglePetShardGold={handleTogglePetShardGold}
            onTogglePetShardDiamond={handleTogglePetShardDiamond}
            onTogglePetShardRainbow={handleTogglePetShardRainbow}
            onEquipPet={handleEquipPet}
            onApplyShardToPet={handleApplyShardToPet}
            onApplyShardToPetDiamond={handleApplyShardToPetDiamond}
            onApplyShardToPetRainbow={handleApplyShardToPetRainbow}
        />
        <Notification message={notification} />
        <AdminMessage message={adminMessage} />
        <AdminConsole
          isOpen={isAdminConsoleOpen}
          onCommand={handleConsoleCommand}
        />
      </div>
    </div>
  );
};

export default App;