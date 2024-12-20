import React, { useState, useRef, useEffect } from 'react';
import type { SearchFilters } from '../../types/contact';

interface FilterControlProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
}

export function FilterControl({ filters, onChange }: FilterControlProps) {
  const [showFilters, setShowFilters] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !filters.tags.includes(tag)) {
        onChange({ tags: [...filters.tags, tag] });
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange({
      tags: filters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const activeFiltersCount = [
    filters.industry,
    filters.country,
    ...filters.tags
  ].filter(Boolean).length;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
          ${activeFiltersCount > 0 
            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:hover:bg-yellow-500/30'
            : 'bg-[rgb(var(--background-primary))] text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--background-hover))]'}
          transition-colors duration-200
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Filter
        {activeFiltersCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-yellow-200 text-yellow-800">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                      ring-1 ring-gray-200 dark:ring-gray-700 z-50">
          <div className="p-3 space-y-3">
            <div>
              <input
                type="text"
                value={filters.industry}
                onChange={(e) => onChange({ industry: e.target.value })}
                placeholder="Filter by industry..."
                className="w-full px-2 py-1 text-sm
                         bg-gray-50 dark:bg-gray-700
                         border border-gray-200 dark:border-gray-600
                         rounded-md
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400
                         focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="text"
                value={filters.country}
                onChange={(e) => onChange({ country: e.target.value })}
                placeholder="Filter by country..."
                className="w-full px-2 py-1 text-sm
                         bg-gray-50 dark:bg-gray-700
                         border border-gray-200 dark:border-gray-600
                         rounded-md
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400
                         focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder="Add tags (press Enter)..."
                className="w-full px-2 py-1 text-sm
                         bg-gray-50 dark:bg-gray-700
                         border border-gray-200 dark:border-gray-600
                         rounded-md
                         focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400
                         focus:border-transparent"
              />
              {filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs
                              bg-yellow-100 text-yellow-800
                              dark:bg-yellow-500/20 dark:text-yellow-300"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-yellow-900 dark:hover:text-yellow-100"
                      >
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" 
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                                clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={() => onChange({ industry: '', country: '', tags: [] })}
                className="w-full px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700
                         dark:text-red-400 dark:hover:text-red-300
                         rounded-md hover:bg-red-50 dark:hover:bg-red-900/20
                         transition-colors duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
