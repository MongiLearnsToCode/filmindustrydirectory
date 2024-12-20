import React from 'react';
import { IconButton } from './IconButton';
import AddContactModal from './AddContactModal';
import { Contact } from '../types/contact';
import { useToolbarState } from '../hooks/useToolbarState';
import { SearchBar } from './toolbar/SearchBar';
import { AddContactButton } from './toolbar/AddContactButton';
import { ViewControl } from './toolbar/ViewControl';

interface FinderToolbarProps {
  onViewChange: (view: ViewMode) => void;
  currentView?: ViewMode;
  onSearch: (query: string) => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
}

type ViewMode = 'grid' | 'list';

export default function FinderToolbar({
  onViewChange,
  currentView = 'grid',
  onSearch,
  onAddContact,
}: FinderToolbarProps) {
  const {
    searchQuery,
    showAddModal,
    setSearchQuery,
    setShowAddModal,
    handleSearch,
    isSearching,
  } = useToolbarState({ onSearch });

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b">
      <SearchBar 
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search contacts..."
        isSearching={isSearching}
      />
      
      <div className="flex items-center gap-2 ml-auto">
        <ViewControl
          currentView={currentView}
          onViewChange={onViewChange}
        />
        <AddContactButton 
          onAddSingle={() => setShowAddModal(true)}
          onAddCsv={() => {/* TODO: Implement CSV upload */}}
        />
      </div>

      {showAddModal && (
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={onAddContact}
        />
      )}
    </div>
  );
}
