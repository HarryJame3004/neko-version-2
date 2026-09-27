import React from 'react';
import { GhostlyEyes } from '../eyes/GhostlyEyes';
import { EyeExpression } from '../../types/ghostly';

interface LevelCompactProps {
  expression: EyeExpression;
  isHovered: boolean;
  soundEnabled: boolean;
  onClickReaction: () => void;
  onExpand: () => void;
  eyeSize?: number;
  pupilSize?: number;
}

export const LevelCompact: React.FC<LevelCompactProps> = ({
  expression,
  isHovered,
  soundEnabled,
  onClickReaction,
  onExpand,
  eyeSize = 22,
  pupilSize = 8,
}) => {
  return (
    <div
      onClick={onExpand}
      className="flex items-center justify-center px-4 py-2 cursor-pointer group"
      title="Ghostly (Click to expand)"
    >
      <GhostlyEyes
        expression={expression}
        isHovered={isHovered}
        eyeSize={eyeSize}
        pupilSize={pupilSize}
        soundEnabled={soundEnabled}
        onClickReaction={onClickReaction}
      />
    </div>
  );
};
