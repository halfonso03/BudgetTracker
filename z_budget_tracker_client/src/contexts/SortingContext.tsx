import { createContext } from 'react';

export type SortingContextType = {
  sortByValue: string;
  setSortByValue: (state: string) => void;
  sortById: string;
  setSortById: (state: string) => void;
  getSortByValue: () => string;
};

export const SortingContext = createContext<SortingContextType | null>(null);
