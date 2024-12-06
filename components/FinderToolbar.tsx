import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from './IconButton';
import AddContactModal from './AddContactModal';
import CsvUploadModal from './CsvUploadModal';
import { Contact } from '../types/contact';

interface FinderToolbarProps {
  currentPath: string;
  onViewChange?: (view: 'grid' | 'list' | 'columns') => void;
  currentView?: 'grid' | 'list' | 'columns';
  onSearch: (query: string) => void;
  groupBy: 'none' | 'country' | 'company' | 'industry';
  onGroupByChange: (value: 'none' | 'country' | 'company' | 'industry') => void;
  onAddContact: (contact: Omit<Contact, 'id'>) => void;
  onAddContacts: (contacts: Omit<Contact, 'id'>[]) => void;
  onSortChange?: (value: 'none' | 'name' | 'dateLastOpened' | 'dateAdded' | 'dateModified' | 'dateCreated' | 'tags') => void;
  currentSort?: 'none' | 'name' | 'dateLastOpened' | 'dateAdded' | 'dateModified' | 'dateCreated' | 'tags';
}

type SortOption = 'none' | 'name' | 'dateLastOpened' | 'dateAdded' | 'dateModified' | 'dateCreated' | 'tags';
type GroupByOption = 'none' | 'country' | 'company' | 'industry';

type MenuItem = {
  type: 'sort' | 'group' | 'divider';
  value?: string;
  label?: string;
};

export default function FinderToolbar({ 
  currentPath, 
  onViewChange,
  currentView = 'grid',
  onSearch,
  groupBy,
  onGroupByChange,
  onAddContact,
  onAddContacts,
  onSortChange,
  currentSort = 'none'
}: FinderToolbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
      if (sortButtonRef.current && !sortButtonRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Menu items including both sort and group options
  const menuItems: MenuItem[] = [
    { type: 'sort', value: 'none', label: 'None' },
    { type: 'sort', value: 'name', label: 'Name' },
    { type: 'sort', value: 'dateLastOpened', label: 'Date Last Opened' },
    { type: 'sort', value: 'dateAdded', label: 'Date Added' },
    { type: 'sort', value: 'dateModified', label: 'Date Modified' },
    { type: 'sort', value: 'dateCreated', label: 'Date Created' },
    { type: 'sort', value: 'tags', label: 'Tags' },
    { type: 'divider' },
    { type: 'group', value: 'none', label: 'No Grouping' },
    { type: 'group', value: 'country', label: 'Group by Country' },
    { type: 'group', value: 'company', label: 'Group by Company' },
    { type: 'group', value: 'industry', label: 'Group by Industry' }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.value) return;
    
    if (item.type === 'sort') {
      onSortChange?.(item.value as SortOption);
    } else if (item.type === 'group') {
      onGroupByChange(item.value as GroupByOption);
    }
    setShowSortMenu(false);
  };

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
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left Section: Navigation and Add Actions */}
        <div className="flex items-center gap-2">
          {/* Add Contact Button Group */}
          <div className="btn-split relative" ref={addMenuRef}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
              aria-label="Add new contact"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Contact
            </button>
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="btn btn-primary"
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

          {/* View Toggle */}
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 rounded-xl p-1 ml-2">
            <button
              onClick={() => onViewChange?.('grid')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'grid'
                  ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-white/50 dark:hover:bg-surface-700/50'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewChange?.('list')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'list'
                  ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-white/50 dark:hover:bg-surface-700/50'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => onViewChange?.('columns')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'columns'
                  ? 'bg-white dark:bg-surface-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-white/50 dark:hover:bg-surface-700/50'
              }`}
              aria-label="Column view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg 
                className={`w-4 h-4 ${isSearching ? 'text-primary-500 animate-spin' : 'text-surface-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isSearching ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )}
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full h-10 pl-10 pr-4 rounded-xl
                       bg-surface-100 dark:bg-surface-800
                       border border-surface-200 dark:border-surface-700
                       focus:bg-white dark:focus:bg-surface-900
                       placeholder:text-surface-400
                       text-surface-900 dark:text-surface-100
                       transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2
                         text-surface-400 hover:text-surface-600
                         dark:text-surface-500 dark:hover:text-surface-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: Sort and Filter */}
        <div className="flex items-center gap-2">
          {/* Sort Button */}
          <div className="relative">
            <button
              ref={sortButtonRef}
              onClick={() => setShowSortMenu(!showSortMenu)}
              className={`p-2 rounded-lg transition-colors
                       ${showSortMenu ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' : 
                         'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'}`}
              aria-label="Sort options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-surface-800 
                           shadow-lg ring-1 ring-surface-200 dark:ring-surface-700">
                <div className="p-2 space-y-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-surface-500 dark:text-surface-400">
                    Sort by
                  </div>
                  {menuItems
                    .filter(item => item.type === 'sort')
                    .map(item => (
                      <button
                        key={item.value}
                        onClick={() => handleMenuItemClick(item)}
                        className={`
                          w-full px-2 py-1.5 text-sm text-left rounded-lg
                          flex items-center justify-between
                          ${currentSort === item.value 
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                            : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'}
                        `}
                      >
                        {item.label}
                        {currentSort === item.value && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                </div>
                
                <div className="border-t border-surface-200 dark:border-surface-700 p-2 space-y-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-surface-500 dark:text-surface-400">
                    Group by
                  </div>
                  {menuItems
                    .filter(item => item.type === 'group')
                    .map(item => (
                      <button
                        key={item.value}
                        onClick={() => handleMenuItemClick(item)}
                        className={`
                          w-full px-2 py-1.5 text-sm text-left rounded-lg
                          flex items-center justify-between
                          ${groupBy === item.value 
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400' 
                            : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'}
                        `}
                      >
                        {item.label}
                        {groupBy === item.value && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
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
