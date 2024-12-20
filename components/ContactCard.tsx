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
                        hover:shadow-lg dark:hover:shadow-gray-900/50
                        cursor-pointer`;
    
    switch (viewMode) {
      case 'list':
        return `${baseClasses} border-b hover:bg-gray-50 dark:hover:bg-gray-700 
                flex flex-col sm:flex-row sm:items-center p-4`;
      case 'grid':
        return `${baseClasses} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                w-full p-4`;
      case 'columns':
        return `${baseClasses} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                p-4 break-inside-avoid-column block`;
      default:
        return `${baseClasses} rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 p-4`;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't open modal if clicking on action buttons or links
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(contact);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this contact?')) {
      onDelete?.(contact);
    }
  };

  const renderActions = (isAuthenticated: boolean) => {
    if (!isAuthenticated) return null;
    
    return (
      <div className="flex gap-2">
        <button
          onClick={handleEdit}
          className="text-blue-500 hover:text-blue-600 transition-colors"
          title="Edit contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition-colors"
          title="Delete contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={getCardClassName()}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        onClick={handleClick}
        role="article"
        aria-label={`Contact card for ${contact.name}`}
      >
        <div className="flex items-start w-full">
          {/* Contact Avatar/Initial */}
          <div className="w-12 h-12 rounded-lg bg-yellow-400 dark:bg-yellow-500 
                        flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 
                        border border-yellow-500 dark:border-yellow-600 shrink-0">
            <span className="text-gray-900 font-semibold text-lg">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Contact Info */}
          <div className="flex-grow min-w-0">
            <h3 className="text-gray-900 dark:text-gray-100 font-medium text-base mb-1 truncate">
              {contact.name}
            </h3>
            {contact.company && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1 truncate">
                {contact.company}
              </p>
            )}
            {contact.industry && (
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                {contact.industry}
              </p>
            )}
            {contact.notes && viewMode === 'columns' && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-3">
                {contact.notes}
              </p>
            )}
            {contact.tags && contact.tags.length > 0 && viewMode === 'columns' && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {contact.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                             bg-gray-100 dark:bg-gray-700 
                             text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {contact.email && (
              <Link 
                href={`mailto:${contact.email}`}
                className="text-gray-600 dark:text-gray-300 text-sm hover:text-yellow-600 
                       dark:hover:text-yellow-400 truncate block mt-2"
              >
                {contact.email}
              </Link>
            )}
            {contact.phone && (
              <Link 
                href={`tel:${contact.phone}`}
                className="text-gray-600 dark:text-gray-300 text-sm hover:text-yellow-600 
                       dark:hover:text-yellow-400 truncate block mt-1"
              >
                {contact.phone}
              </Link>
            )}
          </div>

          {/* Action Buttons */}
          <div 
            className={`
              ml-auto flex -mt-1 -mr-1 sm:mt-0 sm:mr-0 shrink-0
              ${showActions ? 'opacity-100' : 'opacity-0 sm:opacity-0 group-hover:opacity-100'}
              transition-opacity duration-200
            `}
            role="group"
            aria-label="Contact actions"
          >
            <AuthActions>
              {(isAuthenticated) => renderActions(isAuthenticated)}
            </AuthActions>
          </div>
        </div>

        {/* Additional Details - Only show in list view */}
        {viewMode === 'list' && (
          <div className="mt-2 sm:mt-0 sm:ml-16 text-sm space-y-1">
            {contact.notes && (
              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                {contact.notes}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {contact.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                           bg-gray-100 dark:bg-gray-700 
                           text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <ContactModal
        contact={contact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
