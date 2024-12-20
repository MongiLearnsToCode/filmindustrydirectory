'use client';

import { Contact } from '../types/contact';
import { Dialog } from '@headlessui/react';

interface ContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ contact, isOpen, onClose }: ContactModalProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                       text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                       transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Header with avatar */}
            <div className="flex items-start space-x-4 p-6 pb-4">
              <div className="w-16 h-16 rounded-xl bg-yellow-400 dark:bg-yellow-500 
                           flex items-center justify-center
                           border border-yellow-500 dark:border-yellow-600">
                <svg 
                  className="w-8 h-8 text-gray-900" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21a8 8 0 1 0-16 0" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
                  {contact.name}
                </Dialog.Title>
                {contact.title && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                    {contact.title}
                  </p>
                )}
              </div>
            </div>

            {/* Contact information */}
            <div className="px-6 pb-6 space-y-4">
              {/* Company and Industry */}
              {(contact.company || contact.industry) && (
                <div className="space-y-2">
                  {contact.company && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</h3>
                      <p className="text-base text-gray-900 dark:text-white">{contact.company}</p>
                    </div>
                  )}
                  {contact.industry && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</h3>
                      <p className="text-base text-gray-900 dark:text-white">{contact.industry}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-2">
                {contact.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-base text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                    >
                      {contact.email}
                    </a>
                  </div>
                )}
                {contact.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-base text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                    >
                      {contact.phone}
                    </a>
                  </div>
                )}
                {contact.country && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</h3>
                    <p className="text-base text-gray-900 dark:text-white">{contact.country}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {contact.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes</h3>
                  <p className="text-base text-gray-900 dark:text-white whitespace-pre-line">
                    {contact.notes}
                  </p>
                </div>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium
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
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
