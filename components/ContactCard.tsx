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
    const baseClasses = "bg-dark-800 border border-dark-700 group relative transition-all duration-200 responsive-padding";
    
    switch (viewMode) {
      case 'list':
        return `${baseClasses} border-b hover:bg-dark-700 flex flex-col sm:flex-row sm:items-center`;
      case 'grid':
        return `${baseClasses} rounded-lg hover:shadow-glow w-full`;
      case 'columns':
        return `${baseClasses} rounded-lg hover:shadow-glow mb-4 break-inside-avoid`;
      default:
        return `${baseClasses} rounded-lg hover:shadow-glow`;
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
      <div className="flex items-start">
        {/* Contact Avatar/Initial */}
        <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 border border-dark-600 shrink-0">
          <span className="text-teal-400 font-semibold text-lg">
            {contact.name.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Action Buttons */}
        <div 
          className={`
            ml-auto flex -mt-1 -mr-1 sm:mt-0 sm:mr-0
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

      <div className="flex-1 min-w-0 overflow-hidden">
        <h3 className="font-semibold text-lg text-dark-50 truncate mb-2">{contact.name}</h3>
        <p className="text-dark-300 text-sm truncate">{contact.company}</p>
        {contact.country && (
          <p className="text-dark-400 text-sm mt-2 flex items-center truncate">
            <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            <span className="truncate">{contact.country}</span>
          </p>
        )}
        
        {contact.tags && contact.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 max-w-full">
            {contact.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-dark-700 text-teal-400 border border-dark-600 max-w-full truncate"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded px-2 py-1 -ml-2
                     truncate max-w-full"
            onClick={e => e.stopPropagation()}
            aria-label={`Send email to ${contact.name}`}
          >
            <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
