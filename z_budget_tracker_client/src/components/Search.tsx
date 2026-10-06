import React, { useRef } from 'react';
import { usePagination } from '../contexts/pagination/usePagination';
import { X } from 'lucide-react';
import Button from './Button';

type Props = {
  onSearch: (searchTerm: string) => void;
};

const Search = ({ onSearch }: Props) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchTerm, setSearchTerm } = usePagination();

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter' && searchInputRef.current?.value) {
      onSearch(searchInputRef.current?.value);
    }

    if (event.key == 'Escape') {
      searchInputRef.current!.value = '';
      onSearch('');
    }
  };

  function clearSearch() {
    if (searchInputRef.current?.value) {
      searchInputRef.current.value = '';
    }
    setSearchTerm('');
  }

  return (
    <div className="flex w-[25%]">
      <input
        ref={searchInputRef}
        onKeyUp={onKeyUp}
        defaultValue={searchTerm}
        className="px-4 w-full text-sm bg-neutral-50 border border-neutral-200/80 rounded-lg text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white transition-all"
        placeholder="Enter a search term and presss enter..."
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      ></input>
      <Button
        variation="secondary"
        buttonSize="xsmall"
        disabled={!searchTerm}
        onClick={clearSearch}
        style={{
          borderRadius: '0 5px 5px 0',
        }}
      >
        <X className="text-neutral-100" size={20}></X>
      </Button>
    </div>
  );
};

export default Search;
