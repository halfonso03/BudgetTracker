import { createContext } from 'react';

export type SortingContextType = {
  sortByValue: string;
  setSortByValue: (state: string) => void;
};

export const SortingContext = createContext<SortingContextType | null>(null);
