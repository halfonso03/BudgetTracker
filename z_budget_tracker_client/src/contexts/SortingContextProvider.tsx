import { useState } from 'react';
import { SortingContext } from './SortingContext';

const SortingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sortByValue, setSortByValue] = useState('ID');
  const [sortById, setSortById] = useState('ID');

  // console.log('SortingProvider render');
  return (
    <SortingContext.Provider
      value={{ sortByValue, setSortByValue, sortById, setSortById }}
    >
      {children}
    </SortingContext.Provider>
  );
};

export default SortingProvider;
