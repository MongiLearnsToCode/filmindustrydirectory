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
    <div className="sticky top-0 z-50 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[2000px] mx-auto px-4 py-3">
        {/* Main Toolbar Content */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Left Section: Search and Add */}
          <div className="flex flex-col sm:flex-row gap-3 flex-grow md:max-w-2xl">
            {/* Search Bar */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 
                         bg-white dark:bg-gray-800 
                         border border-gray-300 dark:border-gray-600 
                         rounded-lg
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-500 dark:placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500
                         focus:border-yellow-400 dark:focus:border-yellow-500
                         transition duration-150"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <svg className="animate-spin h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Add Contact Button */}
            <div className="relative" ref={addMenuRef}>
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="h-10 w-full sm:w-auto 
                         bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600
                         dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:active:bg-yellow-700
                         text-gray-900 dark:text-gray-900 
                         font-medium px-4 rounded-lg 
                         inline-flex items-center justify-center space-x-2 
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500
                         focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Contact</span>
              </button>

              {/* Add Options Dropdown */}
              {showAddMenu && (
                <div className="absolute right-0 sm:left-0 mt-2 w-48 
                             bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg 
                             ring-1 ring-gray-200 dark:ring-gray-700 
                             py-1 z-50">
                  <button
                    onClick={() => {
                      setShowAddModal(true);
                      setShowAddMenu(false);
                    }}
                    className="w-full px-4 py-2 text-sm text-left 
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full px-4 py-2 text-sm text-left 
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Import from CSV
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Section: View, Sort, and Group Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Sort Controls */}
            <div className="relative" ref={sortMenuRef}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="h-10 px-3 inline-flex items-center justify-center space-x-2 
                         bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                         dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600
                         text-gray-700 dark:text-gray-200 
                         rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 
                         focus:ring-gray-400 dark:focus:ring-gray-500
                         focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span className="hidden sm:inline">Sort</span>
              </button>
              {showSortMenu && (
                <div className="absolute right-0 sm:left-0 mt-2 w-48 
                             bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg 
                             ring-1 ring-gray-200 dark:ring-gray-700 
                             py-1 z-50">
                  {['name', 'company', 'dateAdded', 'dateModified', 'industry'].map((field) => (
                    <button
                      key={field}
                      className={`w-full px-4 py-2 text-sm text-left ${
                        currentSort === field 
                          ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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

            {/* Group Controls */}
            <div className="relative" ref={groupMenuRef}>
              <button
                onClick={() => setShowGroupMenu(!showGroupMenu)}
                className="h-10 px-3 inline-flex items-center justify-center space-x-2 
                         bg-gray-100 hover:bg-gray-200 active:bg-gray-300
                         dark:bg-gray-800 dark:hover:bg-gray-700 dark:active:bg-gray-600
                         text-gray-700 dark:text-gray-200 
                         rounded-lg transition-colors duration-200
                         focus:outline-none focus:ring-2 
                         focus:ring-gray-400 dark:focus:ring-gray-500
                         focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">Group</span>
              </button>
              {showGroupMenu && (
                <div className="absolute right-0 sm:left-0 mt-2 w-48 
                             bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg 
                             ring-1 ring-gray-200 dark:ring-gray-700 
                             py-1 z-50">
                  {['none', 'industry', 'company', 'country'].map((field) => (
                    <button
                      key={field}
                      className={`w-full px-4 py-2 text-sm text-left ${
                        currentGroup === field 
                          ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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

            {/* View Controls */}
            <div className="flex items-center rounded-lg 
                         bg-gray-100 dark:bg-gray-800 
                         ring-1 ring-gray-200 dark:ring-gray-700
                         p-1">
              <IconButton
                icon="grid"
                onClick={() => onViewChange('grid')}
                active={currentView === 'grid'}
                className="h-8 w-8 text-gray-700 dark:text-gray-200
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         active:bg-gray-300 dark:active:bg-gray-600"
              />
              <IconButton
                icon="list"
                onClick={() => onViewChange('list')}
                active={currentView === 'list'}
                className="h-8 w-8 text-gray-700 dark:text-gray-200
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         active:bg-gray-300 dark:active:bg-gray-600"
              />
              <IconButton
                icon="columns"
                onClick={() => onViewChange('columns')}
                active={currentView === 'columns'}
                className="h-8 w-8 text-gray-700 dark:text-gray-200
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         active:bg-gray-300 dark:active:bg-gray-600"
              />
            </div>
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
