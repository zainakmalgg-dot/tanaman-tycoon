
import React from 'react';
import type { WeatherType } from '../types';

interface HeaderProps {
  money: number;
  onTitleClick: () => void;
  weather: WeatherType;
}

const Header: React.FC<HeaderProps> = ({ money, onTitleClick, weather }) => {
  const weatherInfo = {
    sunny: { icon: '☀️', text: 'Cerah' },
    rainy: { icon: '🌧️', text: 'Hujan' },
    cloudy: { icon: '☁️', text: 'Berawan' },
  };

  return (
    <header className="p-4 bg-gray-900/60 backdrop-blur-md border-b-2 border-green-500/50 flex justify-between items-center sticky top-4 z-40 rounded-xl">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">
        Tanaman T
        <span 
          onClick={onTitleClick} 
          className="cursor-pointer hover:text-yellow-300 transition-colors"
          title="Rahasia?"
        >
          y
        </span>
        coon
      </h1>
      <div className="flex items-center gap-6">
        <div className="text-xl text-center" title={`Cuaca saat ini: ${weatherInfo[weather].text}`}>
          <span>{weatherInfo[weather].icon}</span>
          <p className="text-sm font-semibold text-gray-300">{weatherInfo[weather].text}</p>
        </div>
        <div className="bg-gray-800/80 border border-yellow-500/70 rounded-lg px-4 py-2 shadow-lg shadow-yellow-500/10">
          <span className="text-2xl font-semibold text-yellow-300">
            Rp {money.toLocaleString('id-ID')}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;