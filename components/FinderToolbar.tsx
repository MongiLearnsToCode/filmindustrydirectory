import React, { useState, useRef } from 'react';
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
    <div className="flex items-center h-14 px-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Left Section: Navigation and Path */}
      <div className="flex items-center">
        {/* Navigation */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button 
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
            aria-label="Go back"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
            aria-label="Go forward"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Current Path - Now with breadcrumbs */}
        <nav className="mx-4 flex items-center space-x-2" aria-label="Breadcrumb">
          {currentPath.split('/').map((segment, index, array) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span className={`
                text-sm
                ${index === array.length - 1 ? 'font-medium text-gray-900' : 'text-gray-600 hover:text-gray-900'}
              `}>
                {segment || 'Home'}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center Section: Enhanced Search */}
      <div className="flex-1 flex justify-center max-w-2xl mx-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className={`w-4 h-4 ${isSearching ? 'text-blue-500 animate-spin' : 'text-gray-500'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isSearching ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )}
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full h-10 pl-10 pr-12 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
            aria-label="Search contacts"
          />
        </div>
      </div>

      {/* Right Section: View Controls and Actions */}
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            ref={sortButtonRef}
            onClick={() => setShowSortMenu(!showSortMenu)}
            onBlur={() => setTimeout(() => setShowSortMenu(false), 100)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-1"
            aria-label="Sort and group options"
            aria-expanded={showSortMenu}
            aria-haspopup="true"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>

          {showSortMenu && (
            <div 
              className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 divide-y divide-gray-200"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="sort-button"
            >
              {/* Sort section */}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sort by
                </div>
                {menuItems
                  .filter(item => item.type === 'sort')
                  .map(item => (
                    <button
                      key={item.value}
                      onClick={() => handleMenuItemClick(item)}
                      className={`
                        w-full px-4 py-2 text-sm text-left flex items-center space-x-2
                        ${currentSort === item.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                      `}
                      role="menuitem"
                    >
                      {currentSort === item.value && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className={currentSort === item.value ? 'font-medium' : ''}>
                        {item.label}
                      </span>
                    </button>
                  ))}
              </div>

              {/* Group section */}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Group by
                </div>
                {menuItems
                  .filter(item => item.type === 'group')
                  .map(item => (
                    <button
                      key={item.value}
                      onClick={() => handleMenuItemClick(item)}
                      className={`
                        w-full px-4 py-2 text-sm text-left flex items-center space-x-2
                        ${groupBy === item.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
                      `}
                      role="menuitem"
                    >
                      {groupBy === item.value && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      <span className={groupBy === item.value ? 'font-medium' : ''}>
                        {item.label}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1" role="group" aria-label="View options">
          <button
            onClick={() => onViewChange?.('grid')}
            className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentView === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            aria-label="Grid view"
            aria-pressed={currentView === 'grid'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewChange?.('list')}
            className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            aria-label="List view"
            aria-pressed={currentView === 'list'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => onViewChange?.('columns')}
            className={`p-1.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              currentView === 'columns' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
            }`}
            aria-label="Column view"
            aria-pressed={currentView === 'columns'}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </button>
        </div>

        {/* Add Contact Button */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            onBlur={() => setTimeout(() => setShowAddMenu(false), 100)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Contact
          </button>
          
          {showAddMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  setShowAddModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Add Single Contact
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false);
                  setShowCsvModal(true);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Import from CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddContactModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={onAddContact}
      />
      
      <CsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUpload={onAddContacts}
      />
    </div>
  );
}
