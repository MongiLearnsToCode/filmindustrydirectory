import React from 'react';
import { IconButton } from './IconButton';
import AddContactModal from './AddContactModal';
import CsvUploadModal from './CsvUploadModal';
import { Contact } from '../types/contact';
import { useToolbarState } from '../hooks/useToolbarState';
import { SearchBar } from './toolbar/SearchBar';
import { AddContactButton } from './toolbar/AddContactButton';
import { SortControl } from './toolbar/SortControl';
import { GroupControl } from './toolbar/GroupControl';
import { ViewControl } from './toolbar/ViewControl';

interface FinderToolbarProps {
  currentPath?: string;
  onViewChange: (view: ViewMode) => void;
  currentView?: ViewMode;
  onSearch: (query: string) => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onAddContacts: (contacts: Omit<Contact, 'id'>[]) => void;
  onSort: (field: SortField) => void;
  onGroup: (field: GroupField) => void;
  currentSort?: SortField;
  currentGroup?: GroupField;
}

type ViewMode = 'grid' | 'list' | 'columns';
type SortField = 'name' | 'company' | 'dateAdded' | 'dateModified' | 'industry';
type GroupField = 'none' | 'industry' | 'company' | 'country';

export default function FinderToolbar({
  currentPath,
  onViewChange,
  currentView = 'grid',
  onSearch,
  onAddContact,
  onAddContacts,
  onSort,
  onGroup,
  currentSort = 'name',
  currentGroup = 'none',
}: FinderToolbarProps) {
  const {
    searchQuery,
    isSearching,
    showAddModal,
    showCsvModal,
    setSearchQuery,
    setIsSearching,
    setShowAddModal,
    setShowCsvModal,
    handleSearch,
  } = useToolbarState({ onSearch });

  return (
    <div className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[2000px] mx-auto px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Left Section: Search and Add */}
          <div className="flex flex-col sm:flex-row gap-3 flex-grow md:max-w-2xl">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
              isSearching={isSearching}
            />
            
            <AddContactButton
              onAddSingle={() => setShowAddModal(true)}
              onAddCsv={() => setShowCsvModal(true)}
            />
          </div>

          {/* Right Section: View, Sort, and Group Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            <SortControl
              currentSort={currentSort}
              onSort={onSort}
            />
            
            <GroupControl
              currentGroup={currentGroup}
              onGroup={onGroup}
            />
            
            <ViewControl
              currentView={currentView}
              onViewChange={onViewChange}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={(contact) => {
            onAddContact(contact);
            setShowAddModal(false);
          }}
        />
      )}

      {showCsvModal && (
        <CsvUploadModal
          isOpen={showCsvModal}
          onClose={() => setShowCsvModal(false)}
          onUpload={(contacts) => {
            onAddContacts(contacts);
            setShowCsvModal(false);
          }}
        />
      )}
    </div>
  );
}
