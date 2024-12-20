import { useState, useCallback } from 'react';

interface UseToolbarStateProps {
  onSearch: (query: string) => void;
}

export function useToolbarState({ onSearch }: UseToolbarStateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    
    const timeoutId = setTimeout(() => {
      onSearch(value);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [onSearch]);

  return {
    searchQuery,
    isSearching,
    showAddModal,
    showCsvModal,
    setSearchQuery,
    setIsSearching,
    setShowAddModal,
    setShowCsvModal,
    handleSearch,
  };
}
