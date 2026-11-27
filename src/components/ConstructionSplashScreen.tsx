import React, { useState, useEffect } from 'react';
import { ConstructionTimeLapse3D } from './ConstructionTimeLapse3D';

interface ConstructionSplashScreenProps {
  onEnter: () => void;
}

export const ConstructionSplashScreen: React.FC<ConstructionSplashScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClickToEnter = () => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 550);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleClickToEnter();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting]);

  return (
    <div
      onClick={handleClickToEnter}
      className={`splash-cinematic fixed inset-0 z-[100] bg-[#000000] overflow-hidden cursor-pointer select-none transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <ConstructionTimeLapse3D />
    </div>
  );
};
