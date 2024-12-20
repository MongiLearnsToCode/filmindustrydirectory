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
    <div className="sticky top-0 z-50 backdrop-blur-md bg-[rgb(var(--background-secondary))]/80 border-b border-[rgb(var(--border))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 p-3">
          <div className="flex flex-wrap items-center gap-2 min-w-0 w-full sm:w-auto">
            <SearchBar 
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              isSearching={isSearching}
              className="w-full sm:w-64"
            />
            
            <div className="hidden sm:block h-6 w-px bg-[rgb(var(--border))]" />
            
            <FilterControl
              filters={searchFilters}
              onChange={onFilterChange}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            <div className="flex flex-wrap items-center rounded-lg bg-[rgb(var(--background-primary))] p-1 border border-[rgb(var(--border))]">
              <GroupControl
                value={groupBy}
                onChange={onGroupChange}
                className="w-full sm:w-auto"
              />
              <div className="hidden sm:block h-5 w-px mx-1 bg-[rgb(var(--border))]" />
              <ViewControl
                currentView={currentView}
                onViewChange={onViewChange}
                className="w-full sm:w-auto"
              />
              <div className="hidden sm:block h-5 w-px mx-1 bg-[rgb(var(--border))]" />
              <SortControl
                config={sortConfig}
                onChange={onSortChange}
                className="w-full sm:w-auto"
              />
            </div>

            <AddContactButton 
              onAddSingle={() => setShowAddModal(true)}
              onAddCsv={() => setShowCsvModal(true)}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={onAddContact}
        />
      )}

      <CsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUpload={(contacts) => {
          contacts.forEach(contact => onAddContact(contact));
          setShowCsvModal(false);
        }}
      />
    </div>
  );
}
