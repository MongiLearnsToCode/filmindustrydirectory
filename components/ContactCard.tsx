import { Contact } from '../types/contact';
import { useState } from 'react';
import AuthActions from './AuthActions';
import Link from 'next/link';

interface ContactCardProps {
  contact: Contact;
  viewMode: 'grid' | 'list' | 'columns';
  onEdit?: (contact: Contact) => void;
  onDelete?: (contact: Contact) => void;
}

export default function ContactCard({ contact, viewMode, onEdit, onDelete }: ContactCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getCardClassName = () => {
    const baseClasses = "bg-dark text-light border border-grey group relative transition-all duration-200 responsive-padding hover:shadow-soft-md";
    
    switch (viewMode) {
      case 'list':
        return `${baseClasses} border-b hover:bg-grey flex flex-col sm:flex-row sm:items-center`;
      case 'grid':
        return `${baseClasses} rounded-lg hover:bg-grey w-full`;
      case 'columns':
        return `${baseClasses} rounded-lg hover:bg-grey mb-4 break-inside-avoid`;
      default:
        return `${baseClasses} rounded-lg hover:bg-grey`;
    }
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
    <div
      className={getCardClassName()}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="article"
      aria-label={`Contact card for ${contact.name}`}
    >
      <div className="flex items-start w-full">
        {/* Contact Avatar/Initial */}
        <div className="w-12 h-12 rounded-lg bg-gold flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 border border-grey shrink-0">
          <span className="text-dark font-semibold text-lg">
            {contact.name.charAt(0).toUpperCase()}
          </span>
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

      {/* Contact Info */}
      <div className={`flex-grow min-w-0 ${viewMode === 'list' ? 'sm:ml-4' : ''}`}>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-light truncate" title={contact.name}>
            {contact.name}
          </h3>
          
          <div className="space-y-1">
            {contact.title && (
              <p className="text-sm text-light/80 truncate" title={contact.title}>
                {contact.title}
              </p>
            )}
            
            {contact.company && (
              <p className="text-sm text-light/80 truncate" title={contact.company}>
                {contact.company}
              </p>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {contact.email && (
              <Link
                href={`mailto:${contact.email}`}
                className="text-sm text-gold hover:text-light flex items-center gap-1.5 transition-colors max-w-full"
                title={contact.email}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="truncate">{contact.email}</span>
              </Link>
            )}

            {contact.phone && (
              <Link
                href={`tel:${contact.phone}`}
                className="text-sm text-gold hover:text-light flex items-center gap-1.5 transition-colors max-w-full"
                title={contact.phone}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="truncate">{contact.phone}</span>
              </Link>
            )}
          </div>

          {contact.tags && contact.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {contact.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-grey text-light border border-grey/30 truncate max-w-[150px]"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
