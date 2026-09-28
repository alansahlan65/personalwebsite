// Shared menu and page motion, matching the linked Sliding Stairs Menu reference.
export const STAIRS_MOTION = {
  count: 5,
  enter: 500,
  exit: 300,
  stagger: 50,
  backdrop: 500,
  backdropOpacity: 0.5,
  ease: [0.33, 1, 0.68, 1] as const,
  hidden: "translateY(-100%)",
  visible: "translateY(0%)",
} as const;
