import { useState, useCallback } from 'react';

interface UseToolbarStateProps {
  onSearch: (query: string) => void;
}

export function useToolbarState({ onSearch }: UseToolbarStateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    onSearch(value);
    // Simulate search completion after a short delay
    setTimeout(() => setIsSearching(false), 500);
  }, [onSearch]);

  return {
    searchQuery,
    showAddModal,
    isSearching,
    setSearchQuery,
    setShowAddModal,
    handleSearch,
  };
};
