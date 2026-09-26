type ArrowDirection = "up-right" | "right" | "left" | "down";

const arrowPaths: Record<ArrowDirection, string> = {
  "up-right": "M5 19 19 5 M8 5h11v11",
  right: "M4 12h16 M14 6l6 6-6 6",
  left: "M20 12H4 M10 6l-6 6 6 6",
  down: "M12 4v16 M6 14l6 6 6-6",
};

export function ArrowIcon({ direction = "up-right" }: { direction?: ArrowDirection }) {
  return <svg className="ui-arrow" viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={arrowPaths[direction]} vectorEffect="non-scaling-stroke" /></svg>;
}

export function MenuIcon({ kind = "menu" }: { kind?: "menu" | "close" }) {
  return <svg className="ui-menu-icon" viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true" focusable="false"><path d={kind === "close" ? "M6 6l12 12 M18 6 6 18" : "M4 8h16 M4 16h16"} vectorEffect="non-scaling-stroke" /></svg>;
}
