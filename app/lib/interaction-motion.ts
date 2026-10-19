// Shared physical response for the portfolio's native controls.
export const MAGNET_SPRING = { stiffness: 100, damping: 12, mass: .8, restDelta: .05, restSpeed: .5 };
export const CONTROL_SPRING = { type: "spring" as const, stiffness: 320, damping: 30 };
export const SLIDE_EASE: [number, number, number, number] = [.77, 0, .175, 1];
