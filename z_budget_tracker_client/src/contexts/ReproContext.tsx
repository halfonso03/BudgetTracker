import { createContext, useState, type ReactNode } from 'react';

export type NewReproState = {
  year: number;
  justification: string;
};

interface ReproContextType {
  saveSearchParams: (params: ReporSearchParams) => void;
  getSearchParams: () => ReporSearchParams | null;
  setNewReproState: (year: number, justification: string) => void;
  getNewReproState: () => void;
}

interface ReproProps {
  children: ReactNode;
}

const ReproContext = createContext<ReproContextType | null>(null);

export const ReproProvider = ({ children }: ReproProps) => {
  // const [isSearching, setIsSearching] = useState(false);
  // const [resultCount, setResultCount] = useState(0);
  const [searchParams, setSearchParams] = useState<ReporSearchParams | null>(
    null,
  );
  const [newState, setNewState] = useState<NewReproState | null>(null);

  const saveSearchParams = (params: ReporSearchParams) => {
    setSearchParams(params);
  };

  const getSearchParams = () => {
    return searchParams;
  };

  const setNewReproState = (year: number, justification: string) => {
    setNewState({ year, justification });
  };

  const getNewReproState = () => newState;

  return (
    <ReproContext.Provider
      value={{
        saveSearchParams,
        getSearchParams,
        setNewReproState,
        getNewReproState,
      }}
    >
      {children}
    </ReproContext.Provider>
  );
};

export { ReproContext };

export { type ReproContextType };
