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
    const baseClasses = "bg-dark-800 border border-dark-700 group relative transition-all duration-200";
    
    switch (viewMode) {
      case 'list':
        return `${baseClasses} p-4 border-b hover:bg-dark-700`;
      case 'grid':
        return `${baseClasses} p-4 rounded-lg hover:shadow-glow`;
      case 'columns':
        return `${baseClasses} p-4 rounded-lg hover:shadow-glow mb-4 break-inside-avoid`;
      default:
        return `${baseClasses} p-4 rounded-lg hover:shadow-glow`;
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
      className={`${getCardClassName()} focus-within:ring-2 focus-within:ring-teal-400`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="article"
      aria-label={`Contact card for ${contact.name}`}
    >
      {/* Contact Avatar/Initial */}
      <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center mb-3 border border-dark-600">
        <span className="text-teal-400 font-semibold text-lg">
          {contact.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Action Buttons */}
      <div 
        className={`
          absolute top-2 right-2 flex space-x-1
          ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}
          transition-all duration-200
        `}
        role="group"
        aria-label="Contact actions"
      >
        <button
          onClick={handleEdit}
          className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-teal-400 
                   focus:ring-2 focus:ring-teal-400 focus:outline-none border border-dark-600"
          title="Edit contact"
          aria-label="Edit contact"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-red-400 
                   focus:ring-2 focus:ring-red-400 focus:outline-none border border-dark-600"
          title="Delete contact"
          aria-label="Delete contact"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <h3 className="font-semibold text-lg text-dark-50">{contact.name}</h3>
      <p className="text-dark-300 text-sm mt-1">{contact.company}</p>
      {contact.country && (
        <p className="text-dark-400 text-sm mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          {contact.country}
        </p>
      )}
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {contact.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-dark-700 text-teal-400 border border-dark-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="mt-3 flex items-center space-x-2">
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center text-teal-400 hover:text-teal-300 text-sm font-medium 
                   transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded px-2 py-1 -ml-2"
          onClick={e => e.stopPropagation()}
          aria-label={`Send email to ${contact.name}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {contact.email}
        </a>
      </div>
    </div>
  );
}
