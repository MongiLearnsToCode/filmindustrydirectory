import React, { useState } from 'react';
import { Contact } from '../types/contact';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<Contact, 'id'>) => void;
}

export default function AddContactModal({ isOpen, onClose, onSave }: AddContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    industry: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onSave({
      ...formData,
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      dateAdded: new Date().toISOString()
    });
    onClose();
    setFormData({ name: '', email: '', company: '', country: '', industry: '', tags: [] });
    setTagInput('');
    setIsLoading(false);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md
                     border border-gray-200 dark:border-gray-800
                     transform transition-all duration-200
                     animate-in fade-in slide-in-from-bottom-4
                     dark:shadow-black/20">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Add New Contact</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     transition-colors duration-150"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Enter name"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Enter email"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Enter country"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Enter industry"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm
                             bg-yellow-100 text-yellow-800
                             dark:bg-yellow-400/20 dark:text-yellow-300
                             border border-yellow-200 dark:border-yellow-400/20"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 text-yellow-600 hover:text-yellow-800
                               dark:text-yellow-400 dark:hover:text-yellow-300
                               transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700
                         rounded-lg shadow-sm dark:shadow-black/10
                         text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500
                         dark:focus:ring-yellow-400/30 dark:focus:border-yellow-400/50
                         transition-colors duration-150"
                placeholder="Add tags (press Enter)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 
                        bg-gray-50 dark:bg-gray-800/50
                        border-t border-gray-200 dark:border-gray-800 
                        rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg
                       text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-gray-400/50 dark:focus:ring-gray-500/50
                       transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium rounded-lg
                       bg-gradient-to-r from-yellow-400 to-yellow-500
                       hover:from-yellow-500 hover:to-yellow-600
                       dark:from-yellow-500/90 dark:to-yellow-600/90
                       dark:hover:from-yellow-500 dark:hover:to-yellow-600
                       text-gray-900 dark:text-gray-900
                       shadow-sm hover:shadow-md dark:shadow-yellow-500/10
                       transform hover:scale-[1.02]
                       focus:outline-none focus:ring-2 focus:ring-yellow-500/50 dark:focus:ring-yellow-400/30
                       transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
