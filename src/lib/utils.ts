import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Return avatar src if available. Avoid placeholder images in AvatarImage src so AvatarFallback is used.
 */
export function getAvatarSrc(avatar?: string | null): string | undefined {
  if (!avatar) return undefined;
  // If the path contains placeholder we return undefined to force fallback
  if (avatar.includes('placeholder')) return undefined;
  return avatar;
}

export function formatCurrency(amount: number, currency: string | undefined) {
  try {
    if (!currency) return amount.toFixed(2);
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
  } catch (e) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}
