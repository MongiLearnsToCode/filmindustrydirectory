'use client';

import { useState, useEffect } from 'react';
import { ContactsData, Contact } from '../types/contact';
import ContactCard from '../components/ContactCard';
import FinderToolbar from '../components/FinderToolbar';
import Toast from '../components/Toast';
import contactsData from '../data/contacts.json';
import Image from 'next/image';

type HistoryAction = {
  type: 'edit' | 'delete';
  contact: Contact;
  previousContact?: Contact;
};

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>((contactsData as ContactsData).contacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [toast, setToast] = useState<{ message: string; action?: () => void } | null>(null);

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact = {
      ...newContact,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
      dateModified: new Date().toISOString(),
    };
    setContacts(prev => [...prev, contact]);
    setToast({ message: 'Contact added successfully' });
  };

  const showToast = (message: string, undoAction?: () => void) => {
    setToast({ message, action: undoAction });
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="/images/fortune-well-dark.svg"
                alt="Fortune Well"
                width={300}
                height={75}
                className="block dark:hidden"
                priority
              />
              <Image
                src="/images/fortune-well-light.svg"
                alt="Fortune Well"
                width={300}
                height={75}
                className="hidden dark:block"
                priority
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#222831] dark:text-[#FFD700] mb-6">
              Industry Directory
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Your centralized hub for managing industry contacts. Easily organize, search, and maintain your professional network.
            </p>
          </div>
        </div>
      </div>
      <FinderToolbar
        onSearch={handleSearch}
        onViewChange={setViewMode}
        currentView={viewMode}
        onAddContact={handleAddContact}
      />
      
      <div className="p-4">
        <div className={`grid ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'grid-cols-1 gap-2'
        }`}>
          {filteredContacts.map(contact => (
            <ContactCard
              key={contact.id}
              contact={contact}
              viewMode={viewMode}
              onEdit={setEditingContact}
            />
          ))}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.action}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
