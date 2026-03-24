import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a number with a "+" prefix if positive */
export function formatChange(n: number): string {
  return n > 0 ? `+${n}` : String(n)
}

/** Convert a signal type slug to a display label */
export function slugToLabel(slug: string): string {
  return slug
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

