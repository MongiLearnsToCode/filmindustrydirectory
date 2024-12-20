import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  isSearching, 
  placeholder = "Search...",
  className = ""
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-8 pl-8 pr-8
                 bg-[rgb(var(--background-primary))]
                 border border-[rgb(var(--border))]
                 rounded-lg
                 text-sm
                 text-[rgb(var(--text-primary))]
                 placeholder-[rgb(var(--text-secondary))]
                 focus:outline-none focus:ring-1
                 focus:ring-[rgb(var(--accent))] 
                 focus:border-[rgb(var(--accent))]
                 transition-all duration-200"
      />
      <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
        {isSearching ? (
          <svg className="animate-spin h-3.5 w-3.5 text-[rgb(var(--text-secondary))]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 text-[rgb(var(--text-secondary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )}
      </div>
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-2 flex items-center text-[rgb(var(--text-secondary))] 
                   hover:text-[rgb(var(--text-primary))] transition-colors duration-200"
          aria-label="Clear search"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
