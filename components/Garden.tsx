import React from 'react';
import type { Plant as PlantType } from '../types';
import Plot from './Plot';

interface GardenProps {
  plots: PlantType[];
  onPlotClick: (plotId: number) => void;
  isShovelSelected: boolean;
  isWateringCanSelected: boolean;
  isSizeBonusSelected: boolean;
  isSuperDuperSpeedSelected: boolean;
}

const Garden: React.FC<GardenProps> = ({ plots, onPlotClick, isShovelSelected, isWateringCanSelected, isSizeBonusSelected, isSuperDuperSpeedSelected }) => {
  const numPlots = plots.length;
  let gridColsClass = 'grid-cols-3';
  if (numPlots > 9 && numPlots <= 16) {
    gridColsClass = 'grid-cols-4';
  } else if (numPlots > 16) {
    gridColsClass = 'grid-cols-5';
  }

  return (
    <div className="p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-700 h-full">
       <div className="flex justify-center items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-center text-green-300">Kebun Anda</h2>
      </div>
      <div className={`grid ${gridColsClass} gap-4`}>
        {plots.map((plot) => (
          <Plot 
            key={plot.id} 
            plant={plot} 
            onPlotClick={onPlotClick} 
            isShovelSelected={isShovelSelected}
            isWateringCanSelected={isWateringCanSelected}
            isSizeBonusSelected={isSizeBonusSelected}
            isSuperDuperSpeedSelected={isSuperDuperSpeedSelected}
          />
        ))}
      </div>
    </div>
  );
};

export default Garden;