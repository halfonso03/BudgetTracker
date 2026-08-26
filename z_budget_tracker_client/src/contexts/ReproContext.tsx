import { createContext, useState, type ReactNode } from 'react';

export type NewReproState = {
  year: number;
  justification: string;
};

interface ReproContextType {
  reproPreloadLine: ReproPreloadLine | null;
  setPreloadedLine: (param: ReproPreloadLine) => void;
  saveSearchParams: (params: SearchParams) => void;
  getSearchParams: () => SearchParams | null;
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
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  const [reproPreloadLine, setPreloadLine] = useState<ReproPreloadLine | null>(
    null,
  );

  const [newState, setNewState] = useState<NewReproState | null>(null);

  const setPreloadedLine = (param: ReproPreloadLine) => {
    setPreloadLine(param);
  };

  const saveSearchParams = (params: SearchParams) => {
    setSearchParams(params);
  };

  const getSearchParams = () => {
    return searchParams;
  };

  const setNewReproState = (year: number, justification: string) => {
    setNewState({ year, justification });
  };

  const getNewReproState = () => newState;

  // const [userId, setUserId] = useState<number | null>(null);
  // const [token, setToken] = useState<string | null>(() => {
  //   const i = localStorage.getItem('token');
  //   if (i) return i;
  //   return null;
  // });

  // const [user, setUser] = useState<string | null>(() => {
  //   const i = localStorage.getItem('user');
  //   if (i) return i;
  //   return null;
  // });

  // const isLoggedIn = () => {
  //   if (localStorage.getItem('token')) {
  //     const token = localStorage.getItem('token') as string;

  //     const decodedToken = jwtDecode(token);
  //     const currentTime = Date.now() / 1000;

  //     // Check if token is expired
  //     if (decodedToken.exp! < currentTime) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  return (
    <ReproContext.Provider
      value={{
        saveSearchParams,
        getSearchParams,
        reproPreloadLine,
        setPreloadedLine,
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
