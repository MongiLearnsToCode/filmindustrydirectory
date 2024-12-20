import { useState, useCallback, useEffect } from 'react';

interface UseToolbarStateProps {
  onSearch: (query: string) => void;
}

export function useToolbarState({ onSearch }: UseToolbarStateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Update debounced value after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== '') {
      onSearch(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, onSearch]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
  }, []);

  return {
    searchQuery,
    showAddModal,
    isSearching,
    setSearchQuery,
    setShowAddModal,
    handleSearch,
  };
};
