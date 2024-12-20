import React from 'react';
import { IconButton } from '../IconButton';
import type { ViewMode } from '../FinderToolbar';

interface ViewControlProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewControl({ currentView, onViewChange }: ViewControlProps) {
  return (
    <div className="flex items-center rounded-lg 
                 bg-gray-100 dark:bg-gray-800 
                 ring-1 ring-gray-200 dark:ring-gray-700
                 p-1">
      <IconButton
        icon="grid"
        onClick={() => onViewChange('grid')}
        active={currentView === 'grid'}
        className="h-8 w-8 text-gray-700 dark:text-gray-200
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 active:bg-gray-300 dark:active:bg-gray-600"
      />
      <IconButton
        icon="list"
        onClick={() => onViewChange('list')}
        active={currentView === 'list'}
        className="h-8 w-8 text-gray-700 dark:text-gray-200
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 active:bg-gray-300 dark:active:bg-gray-600"
      />
      <IconButton
        icon="columns"
        onClick={() => onViewChange('columns')}
        active={currentView === 'columns'}
        className="h-8 w-8 text-gray-700 dark:text-gray-200
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 active:bg-gray-300 dark:active:bg-gray-600"
      />
    </div>
  );
}
