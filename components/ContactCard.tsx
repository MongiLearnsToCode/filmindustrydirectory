'use client';

import { Contact } from '../types/contact';
import { useState } from 'react';
import AuthActions from './AuthActions';
import Link from 'next/link';
import ContactModal from './ContactModal';

interface ContactCardProps {
  contact: Contact;
  viewMode: 'grid' | 'list' | 'columns';
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

export default function ContactCard({ contact, viewMode, onEdit, onDelete }: ContactCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCardClassName = () => {
    const baseClasses = `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                        group relative transition-all duration-200 
                        hover:shadow-lg dark:hover:shadow-gray-900/50`;
    
    switch (viewMode) {
      case 'list':
        return `${baseClasses} w-full flex flex-col sm:flex-row items-start sm:items-center 
                p-3 sm:p-4 space-y-2 sm:space-y-0 sm:space-x-4 
                hover:bg-gray-50 dark:hover:bg-gray-700`;
      case 'grid':
      default:
        return `${baseClasses} rounded-lg p-4 flex flex-col h-full 
                hover:bg-gray-50 dark:hover:bg-gray-700`;
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
          <>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                  {contact.name}
                </h3>
                {contact.title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {contact.title}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-4 text-sm">
                {contact.company && (
                  <span className="text-gray-700 dark:text-gray-300 truncate">
                    {contact.company}
                  </span>
                )}
                {contact.location && (
                  <span className="text-gray-500 dark:text-gray-400 truncate">
                    {contact.location}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:ml-auto">
              <AuthActions contact={contact} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </>
        );
      
      case 'grid':
      default:
        return (
          <>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                  {contact.name}
                </h3>
                {contact.title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {contact.title}
                  </p>
                )}
              </div>
              
              {contact.company && (
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {contact.company}
                </p>
              )}
              
              {contact.location && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {contact.location}
                </p>
              )}
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {contact.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <AuthActions contact={contact} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </>
        );
    }
  };

  return (
    <div
      className={getCardClassName()}
      onClick={() => setIsModalOpen(true)}
    >
      {renderContent()}
      
      <ContactModal
        isOpen={isModalOpen}
        contact={contact}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
