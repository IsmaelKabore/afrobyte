import type { LucideIcon } from "lucide-react";

/**
 * Wrapper d'icônes unique (DRY).
 * Impose une taille et une épaisseur de trait cohérentes (traits fins,
 * dans l'esprit premium du site). On n'utilise QUE des icônes, jamais d'emoji.
 */
export function Icon({
  icon: IconComponent,
  size = 18,
  strokeWidth = 1.75,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <IconComponent size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
  );
}
