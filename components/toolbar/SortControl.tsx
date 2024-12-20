import React, { useState, useRef, useEffect } from 'react';
import type { SortConfig, SortField } from '../../types/contact';

interface SortControlProps {
  config: SortConfig;
  onChange: (config: SortConfig) => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'company', label: 'Company' },
  { value: 'dateModified', label: 'Last Modified' },
  { value: 'dateAdded', label: 'Date Added' },
];

export function SortControl({ config, onChange }: SortControlProps) {
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

  const toggleDirection = () => {
    onChange({
      ...config,
      direction: config.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSortFieldChange = (field: SortField) => {
    onChange({ ...config, field });
    setShowMenu(false);
  };

  const currentOption = sortOptions.find(option => option.value === config.field);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm
                   text-[rgb(var(--text-primary))]
                   hover:bg-[rgb(var(--background-hover))]
                   transition-colors duration-200"
          title="Sort by"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-xs font-medium">{currentOption?.label || 'Sort'}</span>
        </button>

        <button
          onClick={toggleDirection}
          className="p-1 rounded-md text-[rgb(var(--text-primary))]
                   hover:bg-[rgb(var(--background-hover))]
                   transition-colors duration-200"
          title={config.direction === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
        >
          <svg 
            className={`w-3.5 h-3.5 transform transition-transform duration-200 ${config.direction === 'desc' ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 mt-1 w-40 bg-[rgb(var(--background-secondary))] rounded-lg shadow-lg
                     border border-[rgb(var(--border))] py-1 z-50">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortFieldChange(option.value)}
              className={`
                w-full px-3 py-1.5 text-xs text-left
                ${option.value === config.field
                  ? 'bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))]'
                  : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--background-hover))]'
                }
                transition-colors duration-200
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
