import React, { useRef } from 'react';
import { usePagination } from '../contexts/pagination/usePagination';
import {  X } from 'lucide-react';
import Button from './Button';
import Input from '../ui/Input';

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
    <div className="flex w-full">
      <Input
        ref={searchInputRef}
        onKeyUp={onKeyUp}
        defaultValue={searchTerm}
        style={{
          padding: '.35rem',
          paddingLeft: '.5rem',
          borderRadius: '5px 0 0 5px',
          borderTop: '1px solid var(--color-gray-300)',
          borderLeft: '1px solid var(--color-gray-300)',
          borderBottom: '1px solid var(--color-gray-300)',
        }}
        placeholder="Enter a search term and presss enter..."
      ></Input>
      <Button
        variation="secondary"
        buttonSize="xsmall"
        disabled={!searchTerm}
        onClick={clearSearch}
        style={{
          borderRadius: '0 5px 5px 0',
          border: '1px solid var(--color-gray-400)',
        }}
      >
        <X className="text-neutral-500" size={20}></X>
      </Button>
    </div>
  );
};

export default Search;
