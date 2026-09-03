import { useState } from 'react';
import { SortingContext } from './SortingContext';

const SortingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sortByValue, setSortByValue] = useState('ID');

  return (
    <SortingContext.Provider value={{ sortByValue, setSortByValue }}>
      {children}
    </SortingContext.Provider>
  );
};

export default SortingProvider;
