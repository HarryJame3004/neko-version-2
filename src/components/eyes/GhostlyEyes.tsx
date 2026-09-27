import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EyeExpression } from '../../types/ghostly';
import { calculateTargetOffset, updateSpring, SpringState } from './eye-physics';
import { playClickSound } from '../../core/audio';

interface GhostlyEyesProps {
  expression?: EyeExpression;
  isHovered?: boolean;
  eyeSize?: number; // default ~22px
  pupilSize?: number; // default ~8px
  spacing?: number; // default ~10px
  soundEnabled?: boolean;
  onClickReaction?: () => void;
  className?: string;
}

export const GhostlyEyes: React.FC<GhostlyEyesProps> = ({
  expression = 'neutral',
  isHovered = false,
  eyeSize = 22,
  pupilSize = 8,
  spacing = 9,
  soundEnabled = true,
  onClickReaction,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  // Spring physics states for left and right pupils
  const leftSpring = useRef<SpringState>({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });

  const rightSpring = useRef<SpringState>({
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });

  // State for rendering offsets
  const [leftOffset, setLeftOffset] = useState({ x: 0, y: 0 });
  const [rightOffset, setRightOffset] = useState({ x: 0, y: 0 });

  // Blinking states
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWinking, setIsWinking] = useState(false);
  const [clickSquish, setClickSquish] = useState(false);

  // Maximum displacement from center of eyeball
  const maxDisplacement = (eyeSize - pupilSize) / 2 - 1.5;

  // Track mouse coordinates globally
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 60FPS animation loop for smooth spring-damped tracking
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (leftEyeRef.current && rightEyeRef.current) {
        const leftRect = leftEyeRef.current.getBoundingClientRect();
        const rightRect = rightEyeRef.current.getBoundingClientRect();

        const leftCenter = {
          x: leftRect.left + leftRect.width / 2,
          y: leftRect.top + leftRect.height / 2,
        };
        const rightCenter = {
          x: rightRect.left + rightRect.width / 2,
          y: rightRect.top + rightRect.height / 2,
        };

        // Calculate target positions with realistic parallax
        leftSpring.current.target = calculateTargetOffset(leftCenter, mousePos.current, maxDisplacement);
        rightSpring.current.target = calculateTargetOffset(rightCenter, mousePos.current, maxDisplacement);

        // Update springs
        updateSpring(leftSpring.current, 0.18, 0.72);
        updateSpring(rightSpring.current, 0.18, 0.72);

        setLeftOffset({
          x: Math.round(leftSpring.current.current.x * 100) / 100,
          y: Math.round(leftSpring.current.current.y * 100) / 100,
        });

        setRightOffset({
          x: Math.round(rightSpring.current.current.x * 100) / 100,
          y: Math.round(rightSpring.current.current.y * 100) / 100,
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [maxDisplacement]);

  // Natural randomized blinking mechanism
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;

    const scheduleNextBlink = () => {
      // Random interval between 2.8s and 6.5s
      const delay = 2800 + Math.random() * 3700;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          // 15% chance of a quick double-blink
          if (Math.random() < 0.15) {
            setTimeout(() => {
              setIsBlinking(true);
              setTimeout(() => {
                setIsBlinking(false);
                scheduleNextBlink();
              }, 100);
            }, 120);
          } else {
            scheduleNextBlink();
          }
        }, 130);
      }, delay);
    };

    scheduleNextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // Click reaction handler
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound(soundEnabled);
      setClickSquish(true);
      setIsWinking(true);

      setTimeout(() => {
        setClickSquish(false);
      }, 160);

      setTimeout(() => {
        setIsWinking(false);
      }, 260);

      onClickReaction?.();
    },
    [soundEnabled, onClickReaction]
  );

  // Expression modifiers
  let eyeScaleY = 1;
  let pupilScale = 1;
  let eyeballRadius = 'rounded-full';

  if (isBlinking) {
    eyeScaleY = 0.08;
  } else if (isWinking) {
    eyeScaleY = 1; // handled individually below
  } else if (expression === 'happy') {
    eyeScaleY = 0.85;
    eyeballRadius = 'rounded-t-full rounded-b-lg';
  } else if (expression === 'alert') {
    eyeScaleY = 1.12;
    pupilScale = 1.15;
  } else if (expression === 'focused') {
    eyeScaleY = 0.82;
  } else if (expression === 'sleepy') {
    eyeScaleY = 0.45;
  } else if (isHovered) {
    pupilScale = 1.08;
  }

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      title="Ghostly Eyes (Click to interact)"
      className={`inline-flex items-center justify-center cursor-pointer select-none transition-transform duration-200 ${
        clickSquish ? 'scale-90' : isHovered ? 'scale-105' : 'scale-100'
      } ${className}`}
      style={{ gap: `${spacing}px` }}
    >
      {/* Left Eyeball */}
      <div
        ref={leftEyeRef}
        className={`relative bg-white shadow-sm flex items-center justify-center overflow-hidden transition-all duration-150 ${eyeballRadius}`}
        style={{
          width: `${eyeSize}px`,
          height: `${eyeSize}px`,
          transform: `scaleY(${isBlinking ? 0.08 : eyeScaleY})`,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.45), inset 0 -1px 2px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Left Pupil */}
        <div
          className="absolute bg-slate-950 rounded-full transition-transform"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            transform: `translate(${leftOffset.x}px, ${leftOffset.y}px) scale(${pupilScale})`,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Subtle light reflection on pupil for lively look */}
          <div
            className="absolute top-0.5 right-0.5 bg-white rounded-full opacity-80"
            style={{
              width: `${Math.max(2, pupilSize * 0.28)}px`,
              height: `${Math.max(2, pupilSize * 0.28)}px`,
            }}
          />
        </div>
      </div>

      {/* Right Eyeball */}
      <div
        ref={rightEyeRef}
        className={`relative bg-white shadow-sm flex items-center justify-center overflow-hidden transition-all duration-150 ${eyeballRadius}`}
        style={{
          width: `${eyeSize}px`,
          height: `${eyeSize}px`,
          transform: `scaleY(${isBlinking || isWinking ? 0.08 : eyeScaleY})`,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.45), inset 0 -1px 2px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Right Pupil */}
        <div
          className="absolute bg-slate-950 rounded-full transition-transform"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            transform: `translate(${rightOffset.x}px, ${rightOffset.y}px) scale(${pupilScale})`,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Subtle light reflection on pupil for lively look */}
          <div
            className="absolute top-0.5 right-0.5 bg-white rounded-full opacity-80"
            style={{
              width: `${Math.max(2, pupilSize * 0.28)}px`,
              height: `${Math.max(2, pupilSize * 0.28)}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
