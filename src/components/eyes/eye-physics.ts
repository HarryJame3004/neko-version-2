/**
 * Ghostly Eye Physics and Interpolation Engine
 * 
 * Implements smooth spring-damped interpolation for pupils tracking the mouse cursor.
 * Ensures pupils never snap, jitter, or escape the eyeball boundary.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface SpringState {
  current: Vector2D;
  target: Vector2D;
  velocity: Vector2D;
}

/**
 * Calculates the target pupil offset vector relative to eyeball center.
 * Clamps maximum displacement so pupil strictly stays within the eyeball iris.
 */
export function calculateTargetOffset(
  eyeCenterScreen: Vector2D,
  cursorScreen: Vector2D,
  maxDisplacement: number
): Vector2D {
  const dx = cursorScreen.x - eyeCenterScreen.x;
  const dy = cursorScreen.y - eyeCenterScreen.y;
  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  // Non-linear easing: close movements are sensitive, far movements reach max displacement gracefully
  const displacement = Math.min(maxDisplacement, (distance / (distance + 140)) * maxDisplacement * 1.5);
  const angle = Math.atan2(dy, dx);

  return {
    x: Math.cos(angle) * displacement,
    y: Math.sin(angle) * displacement,
  };
}

/**
 * Updates spring simulation using second-order damped harmonic oscillator.
 * stiffness ~ 0.15 - 0.25 (responsiveness)
 * damping ~ 0.65 - 0.75 (prevents excessive jitter while maintaining life)
 */
export function updateSpring(
  state: SpringState,
  stiffness: number = 0.18,
  damping: number = 0.72
): void {
  // Spring force proportional to displacement from target
  const forceX = (state.target.x - state.current.x) * stiffness;
  const forceY = (state.target.y - state.current.y) * stiffness;

  // Integrate acceleration into velocity
  state.velocity.x = (state.velocity.x + forceX) * damping;
  state.velocity.y = (state.velocity.y + forceY) * damping;

  // Integrate velocity into position
  state.current.x += state.velocity.x;
  state.current.y += state.velocity.y;
}
