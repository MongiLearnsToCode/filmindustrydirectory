import React, { useState, useRef, useEffect } from 'react';

interface AddContactButtonProps {
  onAddSingle: () => void;
  onAddCsv: () => void;
}

export function AddContactButton({ onAddSingle, onAddCsv }: AddContactButtonProps) {
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

      {showMenu && (
        <div className="absolute right-0 sm:left-0 mt-2 w-48 
                     bg-white dark:bg-gray-800 
                     rounded-lg shadow-lg 
                     ring-1 ring-gray-200 dark:ring-gray-700 
                     py-1 z-50">
          <button
            onClick={() => {
              onAddSingle();
              setShowMenu(false);
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
              onAddCsv();
              setShowMenu(false);
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
  );
}
