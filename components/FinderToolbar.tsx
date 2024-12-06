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
  onSortChange?: (value: 'none' | 'name' | 'company' | 'country') => void;
  currentSort?: 'none' | 'name' | 'company' | 'country';
}

type SortOption = 'none' | 'name' | 'company' | 'country';
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
    { type: 'sort', value: 'company', label: 'Company' },
    { type: 'sort', value: 'country', label: 'Country' },
    { type: 'divider' },
    { type: 'group', value: 'none', label: 'No Grouping' },
    { type: 'group', value: 'country', label: 'Group by Country' },
    { type: 'group', value: 'company', label: 'Group by Company' },
    { type: 'group', value: 'industry', label: 'Group by Industry' }
  ];

  const handleMenuItemClick = (item: MenuItem) => {
    if (!item.value) return;
    
    if (item.type === 'sort') {
      console.log('Setting sort to:', item.value);
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
      <div className="h-16 px-6 flex items-center gap-4">
        {/* Add Contact Button Group */}
        <div className="shrink-0">
          <div className="btn-split relative" ref={addMenuRef}>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary h-10 px-4"
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

        {/* Search Bar */}
        <div className="relative flex-1 max-w-2xl">
          <div className="relative flex items-center">
            <svg className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-surface-800 
                     border border-gray-200 dark:border-surface-700 
                     rounded-xl
                     transition-all duration-200
                     placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
                     dark:focus:ring-primary-500/30 dark:focus:border-primary-500
                     dark:text-white"
            />
            {isSearching && (
              <div className="absolute right-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary-500" />
              </div>
            )}
          </div>
        </div>

        {/* Right Section: View and Sort Options */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="finder-toolbar-view-modes flex items-center bg-surface-50 dark:bg-surface-800 rounded-xl p-1 h-10">
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

          {/* Sort & Group Button */}
          <button
            ref={sortButtonRef}
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="btn btn-ghost h-10 px-4 bg-surface-50 dark:bg-surface-800"
            aria-label="Sort and group options"
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h9m-9 4h9" />
              </svg>
              Sort & Group
            </div>
          </button>

          {/* Sort/Group Menu */}
          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-surface-800 shadow-lg 
                           ring-1 ring-surface-200 dark:ring-surface-700 divide-y divide-surface-100 dark:divide-surface-700">
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400">
                  Sort by
                </div>
                {menuItems
                  .filter(item => item.type === 'sort')
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700
                                      ${currentSort === item.value ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-surface-300'}`}
                    >
                      {item.label}
                      {currentSort === item.value && (
                        <span className="absolute right-2 text-primary-600 dark:text-primary-400">✓</span>
                      )}
                    </button>
                  ))}
              </div>
              
              <div className="py-1">
                <div className="px-3 py-2 text-xs font-semibold text-surface-500 dark:text-surface-400">
                  Group by
                </div>
                {menuItems
                  .filter(item => item.type === 'group')
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-surface-100 dark:hover:bg-surface-700
                                      ${groupBy === item.value ? 'text-primary-600 dark:text-primary-400' : 'text-surface-700 dark:text-surface-300'}`}
                    >
                      {item.label}
                      {groupBy === item.value && (
                        <span className="absolute right-2 text-primary-600 dark:text-primary-400">✓</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}
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
