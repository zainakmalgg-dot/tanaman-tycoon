import React, { useState, useEffect } from 'react';
import type { Inventory as InventoryType, PetType, MutationState } from '../types';
import { PET_DATA } from '../constants';

interface PetMutationMachineProps {
    isOpen: boolean;
    onClose: () => void;
    inventory: InventoryType;
    onMutatePet: (petType: PetType) => void;
    mutationState: MutationState;
}

const PetMutationMachine: React.FC<PetMutationMachineProps> = ({ isOpen, onClose, inventory, onMutatePet, mutationState }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!isOpen || !mutationState.isMutating || !mutationState.endTime) {
            setTimeLeft('');
            return;
        }

        const intervalId = setInterval(() => {
            const remaining = Math.max(0, mutationState.endTime! - Date.now());
            if (remaining === 0) {
                setTimeLeft('00:00');
                clearInterval(intervalId);
                return;
            }
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        // Set initial time immediately
        const initialRemaining = Math.max(0, mutationState.endTime! - Date.now());
        const initialMinutes = Math.floor(initialRemaining / 60000);
        const initialSeconds = Math.floor((initialRemaining % 60000) / 1000);
        setTimeLeft(`${initialMinutes.toString().padStart(2, '0')}:${initialSeconds.toString().padStart(2, '0')}`);


        return () => clearInterval(intervalId);
    }, [isOpen, mutationState.isMutating, mutationState.endTime]);


    if (!isOpen) return null;

    const ownedPets = (Object.keys(inventory.pets) as PetType[])
        .filter(p => inventory.pets[p] > 0 && !['genesis', 'cyclops', 'rainbow'].includes(p));

    const renderContent = () => {
        if (mutationState.isMutating && mutationState.petType) {
            return (
                <>
                    <p className="text-sm text-gray-400 mb-4">Mutasi sedang berlangsung... Harap tunggu.</p>
                    <div className="my-8 text-center animate-pulse">
                        <div className="text-6xl">{PET_DATA[mutationState.petType].icon}</div>
                        <p className="font-bold text-xl mt-2">{PET_DATA[mutationState.petType].name}</p>
                    </div>
                    <div className="text-4xl font-mono font-bold text-teal-300 my-4">
                        {timeLeft}
                    </div>
                    <p className="text-xs text-gray-500">Hasilnya akan muncul secara otomatis setelah selesai.</p>
                </>
            );
        }

        return (
            <>
                <p className="text-sm text-gray-400 mb-4">Pilih pet dengan usia 20+ untuk memulai mutasi. Ada 40% risiko kegagalan!</p>
                
                <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 text-left">
                    {ownedPets.length > 0 ? (
                        ownedPets.map(type => {
                            const age = inventory.petAges?.[type] || 0;
                            const canMutate = age >= 20;
                            return (
                                <div key={type} className={`flex items-center justify-between p-3 bg-gray-800 rounded-md border border-gray-600 ${!canMutate ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        {PET_DATA[type].icon}
                                        <div>
                                            <p className="font-bold text-lg">{PET_DATA[type].name}</p>
                                            <p className={`text-sm font-semibold ${canMutate ? 'text-green-400' : 'text-yellow-400'}`}>
                                                Usia: {age} / 20
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onMutatePet(type)}
                                        disabled={!canMutate}
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed"
                                    >
                                        Mutasi
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 italic py-8">Kamu tidak punya pet yang memenuhi syarat untuk dimutasi.</p>
                    )}
                </div>
            </>
        );
    };

    return (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mutation-machine-title"
        >
          <div 
            className="bg-gray-900/80 border-2 border-purple-500/70 rounded-lg p-6 w-full max-w-md relative animate-fade-in text-center shadow-2xl shadow-purple-500/20"
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
            <h2 id="mutation-machine-title" className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
                Pet Mutation Machine
            </h2>
            <img src="https://i.ibb.co/3cH0NC7/pet-mutation-machine.png" alt="Pet Mutation Machine" className="w-full max-w-xs mx-auto my-4 rounded-lg shadow-lg shadow-purple-500/20" />
            {renderContent()}
          </div>
        </div>
    );
};

export default PetMutationMachine;