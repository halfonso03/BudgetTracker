import { createContext, useState, type ReactNode } from 'react';

interface ReproContextType {
  saveSearchParams: (params: SearchParams) => void;
  getSearchParams: () => SearchParams | null;
}

interface ReproProps {
  children: ReactNode;
}

const ReproContext = createContext<ReproContextType | null>(null);

export const ReproProvider = ({ children }: ReproProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [searchParams, setSarchParams] = useState<SearchParams | null>(null);

  const saveSearchParams = (params: SearchParams) => {
    setSarchParams(params);
  };

  const getSearchParams = () => {
    return searchParams;
  }

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
    <ReproContext.Provider value={{ saveSearchParams, getSearchParams }}>
      {children}
    </ReproContext.Provider>
  );
};

export { ReproContext };

export { type ReproContextType };
