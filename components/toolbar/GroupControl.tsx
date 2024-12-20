import React, { useState, useRef, useEffect } from 'react';

interface GroupControlProps {
  value: string | null;
  onChange: (field: string | null) => void;
  className?: string;
}

const groupOptions = [
  { value: 'industry', label: 'Industry' },
  { value: 'country', label: 'Country' },
  { value: 'company', label: 'Company' },
  { value: null, label: 'No Grouping' },
];

export function GroupControl({ value, onChange, className }: GroupControlProps) {
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

  const currentOption = groupOptions.find(option => option.value === value);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm
                 text-[rgb(var(--text-primary))]
                 hover:bg-[rgb(var(--background-hover))]
                 transition-colors duration-200"
        title="Group by"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <span className="text-xs font-medium">{currentOption?.label || 'Group'}</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-1 w-40 bg-[rgb(var(--background-secondary))] rounded-lg shadow-lg
                     border border-[rgb(var(--border))] py-1 z-50">
          {groupOptions.map((option) => (
            <button
              key={option.value || 'none'}
              onClick={() => {
                onChange(option.value);
                setShowMenu(false);
              }}
              className={`
                w-full px-3 py-1.5 text-xs text-left
                ${option.value === value
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
