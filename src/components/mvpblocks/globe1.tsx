import React from 'react';
import Earth from '../ui/globe';

export default function Globe1() {
  return (
    <div className="relative h-[360px] w-[360px] max-w-full">
      {/* Normalized RGB values i.e (RGB or color / 255) */}
      <Earth baseColor={[1, 0, 0.3]} markerColor={[1, 0, 0.33]} glowColor={[1, 0, 0.3]} />
    </div>
  );
}
