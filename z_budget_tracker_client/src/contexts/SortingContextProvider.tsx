import { useState } from 'react';
import { SortingContext } from './SortingContext';

const SortingProvider: React.FC<{
  defaultSortOrder: string;
  children: React.ReactNode;
}> = ({ defaultSortOrder, children }) => {
  const [sortByValue, setSortByValue] = useState(defaultSortOrder);
  const [sortById, setSortById] = useState(defaultSortOrder);

  function getSortByValue() {
    return sortByValue;
  }
  // console.log('SortingProvider render');
  return (
    <SortingContext.Provider
      value={{
        sortByValue,
        setSortByValue,
        sortById,
        setSortById,
        getSortByValue,
      }}
    >
      {children}
    </SortingContext.Provider>
  );
};

export default SortingProvider;
