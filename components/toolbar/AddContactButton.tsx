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
        className="h-9 w-full sm:w-auto 
                 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600
                 dark:from-yellow-500/90 dark:to-yellow-600/90 
                 dark:hover:from-yellow-500 dark:hover:to-yellow-600
                 text-gray-900 dark:text-gray-900 
                 font-medium px-4 rounded-lg 
                 inline-flex items-center justify-center space-x-2.5 
                 transition-all duration-200 ease-in-out
                 shadow-sm hover:shadow-md dark:shadow-yellow-500/10
                 transform hover:scale-[1.02]
                 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 dark:focus:ring-yellow-500/50
                 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>Add Contact</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 sm:left-0 mt-2 w-52
                     bg-white dark:bg-gray-800/95
                     rounded-xl shadow-lg 
                     dark:shadow-black/20
                     ring-1 ring-gray-200 dark:ring-gray-700
                     transform transition-all duration-200 ease-in-out
                     animate-in fade-in slide-in-from-top-2
                     backdrop-blur-sm
                     py-1 z-50">
          <button
            onClick={() => {
              onAddSingle();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 text-sm text-left 
                     text-gray-700 dark:text-gray-200
                     hover:bg-gray-50 dark:hover:bg-gray-700/70
                     transition-colors duration-150
                     flex items-center space-x-3 group"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Add Single Contact</span>
          </button>
          <button
            onClick={() => {
              onAddCsv();
              setShowMenu(false);
            }}
            className="w-full px-4 py-2.5 text-sm text-left 
                     text-gray-700 dark:text-gray-200
                     hover:bg-gray-50 dark:hover:bg-gray-700/70
                     transition-colors duration-150
                     flex items-center space-x-3 group"
          >
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Import from CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}
