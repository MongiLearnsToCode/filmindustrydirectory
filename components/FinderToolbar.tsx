import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from './IconButton';
import AddContactModal from './AddContactModal';
import CsvUploadModal from './CsvUploadModal';
import { Contact } from '../types/contact';

interface FinderToolbarProps {
  currentPath?: string;
  onViewChange: (view: 'grid' | 'list' | 'columns') => void;
  currentView?: 'grid' | 'list' | 'columns';
  onSearch: (query: string) => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onAddContacts: (contacts: Omit<Contact, 'id'>[]) => void;
  onSort: (field: string) => void;
  onGroup: (field: string) => void;
  currentSort?: string;
  currentGroup?: string;
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
      if (groupMenuRef.current && !groupMenuRef.current.contains(event.target as Node)) {
        setShowGroupMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsSearching(true);
    
    // Debounce search to avoid too many updates
    const timeoutId = setTimeout(() => {
      onSearch(value);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-surface-900/80 border-b border-surface-200/50 dark:border-surface-700/50">
      {/* Mobile layout - flex column on small screens */}
      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:h-16 sm:px-6 gap-3">
        {/* Add Contact Button Group - full width on mobile */}
        <div className="w-full sm:w-auto sm:shrink-0">
          <div className="btn-split relative w-full sm:w-auto" ref={addMenuRef}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary h-10 px-4 flex-1 sm:flex-auto"
              aria-label="Add new contact"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Contact
            </button>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="btn btn-primary h-10 px-2"
              aria-label="More add options"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Add Options Dropdown */}
            {showAddMenu && (
              <div className="absolute top-full right-0 mt-1 w-48 rounded-xl bg-white dark:bg-surface-800 
                             shadow-lg ring-1 ring-surface-200 dark:ring-surface-700 py-1 z-50">
                <button
                  onClick={() => {
                    setShowAddModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-surface-700 dark:text-surface-300
                                 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Add Single Contact
                </button>
                <button
                  onClick={() => {
                    setShowCsvModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left text-surface-700 dark:text-surface-300
                                 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Import from CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search, Sort, and Group Controls */}
        <div className="flex-1 min-w-0 flex items-center space-x-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contacts..."
              className="input pr-10 w-full"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isSearching ? (
                <svg className="animate-spin h-5 w-5 text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>

          {/* Sort and Group Controls Container */}
          <div className="flex items-center space-x-1">
            {/* Sort Control */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="btn btn-ghost h-10 px-2"
                aria-label="Sort options"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="text-sm">{currentSort.charAt(0).toUpperCase() + currentSort.slice(1)}</span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-surface-800 
                               shadow-lg ring-1 ring-surface-200 dark:ring-surface-700 py-1 z-50">
                  {['name', 'company', 'dateAdded', 'dateModified', 'industry'].map((field) => (
                    <button
                      key={field}
                      className={`w-full px-4 py-2 text-sm text-left ${
                        currentSort === field 
                          ? 'text-primary-600 dark:text-primary-400 bg-surface-100 dark:bg-surface-700'
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                      }`}
                      onClick={() => {
                        onSort(field);
                        setShowSortMenu(false);
                      }}
                    >
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Group Control */}
            <div className="relative" ref={groupMenuRef}>
              <button
                onClick={() => setShowGroupMenu(!showGroupMenu)}
                className="btn btn-ghost h-10 px-2"
                aria-label="Group options"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm">{currentGroup === 'none' ? 'No Groups' : currentGroup.charAt(0).toUpperCase() + currentGroup.slice(1)}</span>
              </button>
              {showGroupMenu && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl bg-white dark:bg-surface-800 
                               shadow-lg ring-1 ring-surface-200 dark:ring-surface-700 py-1 z-50">
                  {['none', 'industry', 'company', 'country'].map((field) => (
                    <button
                      key={field}
                      className={`w-full px-4 py-2 text-sm text-left ${
                        currentGroup === field 
                          ? 'text-primary-600 dark:text-primary-400 bg-surface-100 dark:bg-surface-700'
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                      }`}
                      onClick={() => {
                        onGroup(field);
                        setShowGroupMenu(false);
                      }}
                    >
                      {field === 'none' ? 'No Groups' : field.charAt(0).toUpperCase() + field.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-2">
          <IconButton
            onClick={() => onViewChange('grid')}
            active={currentView === 'grid'}
            aria-label="Grid view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => onViewChange('list')}
            active={currentView === 'list'}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => onViewChange('columns')}
            active={currentView === 'columns'}
            aria-label="Column view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </IconButton>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddContactModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={onAddContact}
        />
      )}
      {showCsvModal && (
        <CsvUploadModal
          isOpen={showCsvModal}
          onClose={() => setShowCsvModal(false)}
          onUpload={onAddContacts}
        />
      )}
    </div>
  );
}
