import { Contact } from '../types/contact';
import { useState } from 'react';

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
    onDelete?.(contact);
  };

  return (
    <div 
      className={`${getCardClassName()} focus-within:ring-2 focus-within:ring-teal-400 group`}
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
          <button
            onClick={handleEdit}
            className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-300 hover:text-teal-400 
                     focus:ring-2 focus:ring-teal-400 focus:outline-none transition-colors
                     focus:bg-dark-700/50"
            title="Edit contact"
            aria-label="Edit contact"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg hover:bg-dark-700/50 text-dark-300 hover:text-red-400 
                     focus:ring-2 focus:ring-red-400 focus:outline-none transition-colors
                     focus:bg-dark-700/50"
            title="Delete contact"
            aria-label="Delete contact"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
