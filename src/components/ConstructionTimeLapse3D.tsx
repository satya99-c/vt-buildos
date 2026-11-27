import React, { useEffect, useState } from 'react';

interface ConstructionTimeLapse3DProps {
  onStageChange?: (stage: {
    phase: string;
    floor: number;
    progressPct: number;
  }) => void;
}

interface StageConfig {
  id: number;
  src: string;
  phase: string;
  floor: number;
  startSec: number;
  endSec: number;
  fromScale: number;
  toScale: number;
  fromY: number;
  toY: number;
}

const STAGES: StageConfig[] = [
  {
    id: 1,
    src: '/intro-stage-1.jpg',
    phase: 'BLUEPRINT CAD & FOOTINGS',
    floor: 0,
    startSec: 0,
    endSec: 2.8,
    fromScale: 1.14,
    toScale: 1.04,
    fromY: 2,
    toY: 0,
  },
  {
    id: 2,
    src: '/intro-stage-2.jpg',
    phase: '5-STORY RCC SUPERSTRUCTURE',
    floor: 3,
    startSec: 2.2,
    endSec: 5.6,
    fromScale: 1.12,
    toScale: 1.02,
    fromY: 3,
    toY: 0,
  },
  {
    id: 3,
    src: '/intro-stage-3.jpg',
    phase: 'CURTAIN WALL & FACADE',
    floor: 5,
    startSec: 4.9,
    endSec: 8.3,
    fromScale: 1.1,
    toScale: 1.01,
    fromY: 2,
    toY: 0,
  },
  {
    id: 4,
    src: '/intro-stage-4.jpg',
    phase: '5-STORY PROJECT COMPLETE',
    floor: 5,
    startSec: 7.5,
    endSec: 12.0,
    fromScale: 1.12,
    toScale: 1.0,
    fromY: 1,
    toY: 0,
  },
];

const CYCLE_DURATION = 12.0;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;

export const ConstructionTimeLapse3D: React.FC<ConstructionTimeLapse3DProps> = ({
  onStageChange,
}) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const sec = ((now - start) / 1000) % CYCLE_DURATION;
      setElapsed(sec);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Notify HUD of active stage
  useEffect(() => {
    if (!onStageChange) return;
    let active = STAGES[0];
    if (elapsed >= 7.8) active = STAGES[3];
    else if (elapsed >= 5.1) active = STAGES[2];
    else if (elapsed >= 2.4) active = STAGES[1];

    onStageChange({
      phase: active.phase,
      floor: active.floor,
      progressPct: Math.min(100, Math.round((elapsed / 10.2) * 100)),
    });
  }, [elapsed, onStageChange]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#050811]">
      {STAGES.map((stage, idx) => {
        const duration = stage.endSec - stage.startSec;
        const localT = clamp01((elapsed - stage.startSec) / duration);
        const eased = easeInOutSine(localT);

        // Smooth cross-dissolve opacity
        const fadeInDuration = idx === 0 ? 0.4 : 0.9;
        const fadeOutDuration = idx === STAGES.length - 1 ? 0.6 : 0.8;

        let opacity = 0;
        if (elapsed >= stage.startSec && elapsed <= stage.endSec) {
          const inAlpha = clamp01((elapsed - stage.startSec) / fadeInDuration);
          const outAlpha =
            idx === STAGES.length - 1 && elapsed > CYCLE_DURATION - 0.7
              ? clamp01((CYCLE_DURATION - elapsed) / 0.7)
              : clamp01((stage.endSec - elapsed) / fadeOutDuration);
          opacity = Math.min(inAlpha, outAlpha);
        }

        // Loop wrap-around blend: keep Stage 1 fading in smoothly at end of cycle
        if (idx === 0 && elapsed > CYCLE_DURATION - 0.6) {
          opacity = clamp01((elapsed - (CYCLE_DURATION - 0.6)) / 0.6);
        }

        const scale = stage.fromScale + (stage.toScale - stage.fromScale) * eased;
        const translateY = stage.fromY + (stage.toY - stage.fromY) * eased;

        return (
          <img
            key={stage.id}
            src={stage.src}
            alt={stage.phase}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform select-none pointer-events-none"
            style={{
              opacity,
              transform: `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(2)}%)`,
              zIndex: idx + 1,
            }}
          />
        );
      })}
    </div>
  );
};
