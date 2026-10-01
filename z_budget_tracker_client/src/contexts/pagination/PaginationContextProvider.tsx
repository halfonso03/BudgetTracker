import { useState, type ReactNode } from 'react';
import { PaginationContext } from './PaginationContext';

export interface PaginationContextType {
  pageNumber: number;
  itemStatusFilter: string;
  searchTerm: string;
  setPageNumber: (pageNumber: number) => void;
  setItemStatusFilter: (itemStatus: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}

interface PaginationContextProviderProps {
  children: ReactNode;
}

export const PaginationContextProvider = ({
  children,
}: PaginationContextProviderProps) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [itemStatusFilter, setItemStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const contextValue: PaginationContextType = {
    pageNumber,
    setPageNumber,
    itemStatusFilter,
    searchTerm,
    setItemStatusFilter,
    setSearchTerm,
  };

  return (
    <PaginationContext.Provider value={contextValue}>
      {children}
    </PaginationContext.Provider>
  );
};
