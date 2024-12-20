import React, { useState, useRef, useEffect } from 'react';
import type { GroupField } from '../FinderToolbar';

interface GroupControlProps {
  currentGroup: GroupField;
  onGroup: (field: GroupField) => void;
}

const GROUP_OPTIONS: GroupField[] = ['none', 'industry', 'company', 'country'];

export function GroupControl({ currentGroup, onGroup }: GroupControlProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
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

      {showMenu && (
        <div className="absolute right-0 sm:left-0 mt-2 w-48 
                     bg-white dark:bg-gray-800 
                     rounded-lg shadow-lg 
                     ring-1 ring-gray-200 dark:ring-gray-700 
                     py-1 z-50">
          {GROUP_OPTIONS.map((field) => (
            <button
              key={field}
              className={`w-full px-4 py-2 text-sm text-left ${
                currentGroup === field 
                  ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                onGroup(field);
                setShowMenu(false);
              }}
            >
              {field === 'none' ? 'No Groups' : field.charAt(0).toUpperCase() + field.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
