import React, { useRef, useState } from 'react';
import { usePagination } from '../contexts/pagination/usePagination';
import { X } from 'lucide-react';
import Button from './Button';

type Props = {
  onSearch: (searchTerm: string) => void;
};

const Search = ({ onSearch }: Props) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchTerm, setSearchTerm } = usePagination();
  const [inputtedText, setInputtedText] = useState('');

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter' && searchInputRef.current?.value) {
      onSearch(searchInputRef.current?.value);
    }

    if (event.key == 'Escape') {
      searchInputRef.current!.value = '';
      onSearch('');
    }
    setInputtedText(searchInputRef.current?.value ?? '');
  };

  function clearSearch() {
    if (searchInputRef.current?.value) {
      searchInputRef.current.value = '';
    }
    setSearchTerm('');
    setInputtedText('');
  }

  return (
    <div className="flex w-[25%]">
      <input
        ref={searchInputRef}
        onKeyUp={onKeyUp}
        defaultValue={searchTerm}
        className={`px-4 w-full text-sm bg-neutral-50/20 border border-neutral-200/80 rounded-lg 
              text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-300 
              focus:bg-white transition-all`}
        placeholder="Enter a search term and presss enter..."
        style={{
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      ></input>
      <Button
        variation="secondary"
        buttonSize="xsmall"
        disabled={!inputtedText}
        onClick={clearSearch}
        style={{
          borderRadius: '0 5px 5px 0',
          backgroundColor: inputtedText != '' ? 'var(--color-neutral-600)' : '',
        }}
      >
        <X className="text-neutral-100" size={20}></X>
      </Button>
    </div>
  );
};

export default Search;
