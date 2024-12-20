import React from 'react';
import type { ViewMode } from '../FinderToolbar';

interface ViewControlProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewControl({ currentView, onViewChange }: ViewControlProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-1 rounded-md transition-colors duration-200
                 ${currentView === 'grid'
                   ? 'text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10'
                   : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--background-hover))]'
                 }`}
        title="Grid view"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      <button
        onClick={() => onViewChange('list')}
        className={`p-1 rounded-md transition-colors duration-200
                 ${currentView === 'list'
                   ? 'text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/10'
                   : 'text-[rgb(var(--text-primary))] hover:bg-[rgb(var(--background-hover))]'
                 }`}
        title="List view"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
