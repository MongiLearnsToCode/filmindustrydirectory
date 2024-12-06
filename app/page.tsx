'use client';

import { useState, useEffect } from 'react';
import { ContactsData, Contact } from '../types/contact';
import ContactCard from '../components/ContactCard';
import GroupedContacts from '../components/GroupedContacts';
import FinderToolbar from '../components/FinderToolbar';
import Toast from '../components/Toast';
import contactsData from '../data/contacts.json';
import Image from 'next/image';

type HistoryAction = {
  type: 'edit' | 'delete';
  contact: Contact;
  previousContact?: Contact;
};

type SortOption = 'none' | 'name' | 'dateLastOpened' | 'dateAdded' | 'dateModified' | 'dateCreated' | 'tags';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>((contactsData as ContactsData).contacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'country' | 'company' | 'industry'>('none');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'columns'>('grid');
  const [currentSort, setCurrentSort] = useState<SortOption>('none');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [toast, setToast] = useState<{ message: string; action?: () => void } | null>(null);

  const addToHistory = (action: HistoryAction) => {
    setHistory(prev => [...prev, action]);
  };

  const handleUndo = () => {
    const lastAction = history[history.length - 1];
    if (!lastAction) return;

    switch (lastAction.type) {
      case 'delete':
        setContacts(prev => [...prev, lastAction.contact]);
        break;
      case 'edit':
        if (lastAction.previousContact) {
          setContacts(prev => 
            prev.map(c => c.id === lastAction.contact.id ? lastAction.previousContact! : c)
          );
        }
        break;
    }

    setHistory(prev => prev.slice(0, -1));
  };

  const showToast = (message: string, undoAction?: () => void) => {
    setToast({ message, action: undoAction });
  };

  const handleAddContact = (newContact: Omit<Contact, 'id'>) => {
    const contact: Contact = {
      id: crypto.randomUUID(),
      ...newContact
    };
    setContacts([...contacts, contact]);
  };

  const handleAddContacts = (newContacts: Omit<Contact, 'id'>[]) => {
    const contactsWithIds = newContacts.map(contact => ({
      id: crypto.randomUUID(),
      ...contact
    }));
    setContacts([...contacts, ...contactsWithIds]);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    const previousContact = contacts.find(c => c.id === updatedContact.id);
    if (!previousContact) return;

    setContacts(contacts.map(c => 
      c.id === updatedContact.id ? updatedContact : c
    ));
    setEditingContact(null);

    addToHistory({
      type: 'edit',
      contact: updatedContact,
      previousContact
    });

    showToast('Contact updated', handleUndo);
  };

  const handleDeleteContact = (contact: Contact) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== contact.id));
      
      addToHistory({
        type: 'delete',
        contact
      });

      showToast('Contact deleted', handleUndo);
    }
  };

  const sortContacts = (contacts: Contact[], sortOption: SortOption): Contact[] => {
    if (sortOption === 'none') return contacts;

    return [...contacts].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'dateLastOpened':
          return (b.lastOpened || '').localeCompare(a.lastOpened || '');
        case 'dateAdded':
          return (b.dateAdded || '').localeCompare(a.dateAdded || '');
        case 'dateModified':
          return (b.dateModified || '').localeCompare(a.dateModified || '');
        case 'dateCreated':
          return (b.dateCreated || '').localeCompare(a.dateCreated || '');
        case 'tags':
          const tagsA = a.tags?.join(',') || '';
          const tagsB = b.tags?.join(',') || '';
          return tagsA.localeCompare(tagsB);
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
  };

  // Filter and sort contacts
  const filteredAndSortedContacts = sortContacts(
    contacts.filter(contact => 
      !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.country?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    currentSort
  );

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Welcome to Industry Directory
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Your central hub for managing and organizing industry contacts
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl">
            <div className="text-4xl font-bold mb-2 dark:text-white">{contacts.length}</div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">TOTAL CONTACTS</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl">
            <div className="text-4xl font-bold mb-2 dark:text-white">
              {new Set(contacts.map(c => c.industry)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">INDUSTRIES</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl">
            <div className="text-4xl font-bold mb-2 dark:text-white">
              {new Set(contacts.map(c => c.company)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">COMPANIES</div>
          </div>
        </div>

        {/* Main Content */}
        <div id="contact-grid">
          <FinderToolbar
            currentPath="/"
            onViewChange={setViewMode}
            currentView={viewMode}
            onSearch={setSearchQuery}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            onAddContact={handleAddContact}
            onAddContacts={handleAddContacts}
            onSortChange={handleSortChange}
            currentSort={currentSort}
          />
          
          <div className="p-8">
            {filteredAndSortedContacts.length > 0 ? (
              <GroupedContacts 
                contacts={filteredAndSortedContacts} 
                groupBy={groupBy} 
                viewMode={viewMode}
                onEditContact={handleEditContact}
                onDeleteContact={handleDeleteContact}
              />
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No contacts found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Edit Contact</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleUpdateContact({
                ...editingContact,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                company: formData.get('company') as string,
                country: formData.get('country') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingContact.name}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingContact.email}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    defaultValue={editingContact.company}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    defaultValue={editingContact.country}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingContact(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
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
