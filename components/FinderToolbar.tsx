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
    <div className="flex flex-col space-y-2 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        {/* Add Contact Button */}
        <div className="relative" ref={addMenuRef}>
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="bg-yellow-300 hover:bg-yellow-400 dark:bg-yellow-500 dark:hover:bg-yellow-600 
                     text-gray-800 dark:text-gray-900 font-medium px-4 py-2 rounded-lg flex items-center space-x-2 
                     transition-colors duration-200"
          >
            <span>+ Add Contact</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Add Options Dropdown */}
          {showAddMenu && (
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-900 
                         shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 py-1 z-50">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setShowAddMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
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
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
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

        {/* Search, Sort, and Group Controls */}
        <div className="flex-1 min-w-0 flex items-center space-x-4 px-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
                       border border-gray-200 dark:border-gray-700 rounded-lg 
                       focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-500 
                       focus:border-transparent transition-colors duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {isSearching ? (
                <svg className="animate-spin h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-900 
                               shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 py-1 z-50">
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
                <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white dark:bg-gray-900 
                               shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 py-1 z-50">
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
            icon="grid"
            onClick={() => onViewChange('grid')}
            active={currentView === 'grid'}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 
                      hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
          />
          <IconButton
            icon="list"
            onClick={() => onViewChange('list')}
            active={currentView === 'list'}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 
                      hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
          />
          <IconButton
            icon="columns"
            onClick={() => onViewChange('columns')}
            active={currentView === 'columns'}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 
                      hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
          />
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
