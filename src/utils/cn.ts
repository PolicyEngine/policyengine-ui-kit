import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'text-color': [
        { text: ['pe-primary', 'pe-gray', 'pe-blue', 'pe-text', 'pe-success', 'pe-error', 'pe-warning', 'pe-info', 'pe-border', 'pe-bg', 'primary-foreground'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
