import React, { useState } from 'react';
import { Contact, SearchFilters, SortConfig } from '../types/contact';
import { useToolbarState } from '../hooks/useToolbarState';
import { SearchBar } from './toolbar/SearchBar';
import AddContactModal from './AddContactModal';
import { AddContactButton } from './toolbar/AddContactButton';
import { ViewControl } from './toolbar/ViewControl';
import { FilterControl } from './toolbar/FilterControl';
import { SortControl } from './toolbar/SortControl';
import { GroupControl } from './toolbar/GroupControl';
import CsvUploadModal from './CsvUploadModal';

interface FinderToolbarProps {
  onViewChange: (view: ViewMode) => void;
  currentView?: ViewMode;
  onSearch: (query: string) => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onFilterChange: (filters: Partial<SearchFilters>) => void;
  onSortChange: (config: SortConfig) => void;
  onGroupChange: (field: string | null) => void;
  searchFilters: SearchFilters;
  sortConfig: SortConfig;
  groupBy: string | null;
}

export type ViewMode = 'grid' | 'list';

export default function FinderToolbar({
  onViewChange,
  currentView = 'grid',
  onSearch,
  onAddContact,
  onFilterChange,
  onSortChange,
  onGroupChange,
  searchFilters,
  sortConfig,
  groupBy,
}: FinderToolbarProps) {
  const {
    searchQuery,
    showAddModal,
    setSearchQuery,
    setShowAddModal,
    handleSearch,
    isSearching,
  } = useToolbarState({ onSearch });

  const [showCsvModal, setShowCsvModal] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="p-2 md:p-4 space-y-2 md:space-y-4">
        {/* Search and Add Contact Row */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="w-full sm:w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <AddContactButton onClick={() => setShowAddModal(true)} />
            <button
              onClick={() => setShowCsvModal(true)}
              className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Import CSV
            </button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap gap-2 items-center">
          <ViewControl currentView={currentView} onViewChange={onViewChange} />
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />
          <div className="flex flex-wrap gap-2 items-center">
            <FilterControl
              filters={searchFilters}
              onChange={onFilterChange}
            />
            <SortControl
              config={sortConfig}
              onChange={onSortChange}
            />
            <GroupControl
              groupBy={groupBy}
              onChange={onGroupChange}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onSave={onAddContact}
        />
      )}

      {showCsvModal && (
        <CsvUploadModal
          onClose={() => setShowCsvModal(false)}
          onUpload={(contacts) => {
            contacts.forEach(contact => onAddContact(contact));
            setShowCsvModal(false);
          }}
        />
      )}
    </div>
  );
}
