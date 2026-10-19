import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowDown, List, X, Moon, Sun } from "@phosphor-icons/react/ssr";

type ArrowDirection = "up-right" | "right" | "left" | "down";
const arrows = { "up-right": ArrowUpRight, right: ArrowRight, left: ArrowLeft, down: ArrowDown };

export function ArrowIcon({ direction = "up-right" }: { direction?: ArrowDirection }) {
  const Icon = arrows[direction];
  return <Icon className="ui-arrow" size={16} weight="regular" aria-hidden="true" focusable="false" />;
}

export function MenuIcon({ kind = "menu" }: { kind?: "menu" | "close" }) {
  const Icon = kind === "close" ? X : List;
  return <Icon className="ui-menu-icon" size={18} weight="regular" aria-hidden="true" focusable="false" />;
}

export function ThemeIcon({ kind }: { kind: "moon" | "sun" }) {
  const Icon = kind === "moon" ? Moon : Sun;
  return <Icon className="ui-theme-icon" size={20} weight="regular" aria-hidden="true" focusable="false" />;
}
