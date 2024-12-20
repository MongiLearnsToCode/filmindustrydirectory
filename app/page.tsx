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
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'columns'>('grid');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [toast, setToast] = useState<{ message: string; action?: () => void } | null>(null);
  const [sortField, setSortField] = useState<string>('name');
  const [groupField, setGroupField] = useState<string>('none');

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

  const sortContacts = (contacts: Contact[], field: string) => {
    return [...contacts].sort((a, b) => {
      const aValue = a[field as keyof Contact] || '';
      const bValue = b[field as keyof Contact] || '';
      return String(aValue).localeCompare(String(bValue));
    });
  };

  const groupContacts = (contacts: Contact[], field: string) => {
    if (field === 'none') return { 'All Contacts': contacts };
    
    return contacts.reduce((groups: { [key: string]: Contact[] }, contact) => {
      const value = (contact[field as keyof Contact] as string) || 'Other';
      if (!groups[value]) {
        groups[value] = [];
      }
      groups[value].push(contact);
      return groups;
    }, {});
  };

  const handleSort = (field: string) => {
    setSortField(field);
  };

  const handleGroup = (field: string) => {
    setGroupField(field);
  };

  // Apply sorting and filtering
  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.company.toLowerCase().includes(searchLower) ||
      (contact.industry && contact.industry.toLowerCase().includes(searchLower))
    );
  });

  const sortedContacts = sortContacts(filteredContacts, sortField);
  const groupedContacts = groupContacts(sortedContacts, groupField);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-16 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/fortune-well-yellow.svg"
              alt="Fortune Well"
              width={200}
              height={133}
              className="hidden dark:block"
              priority
            />
            <Image
              src="/fortune-well-dark.svg"
              alt="Fortune Well"
              width={200}
              height={133}
              className="block dark:hidden"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Welcome to Industry Directory
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Your central hub for managing and organizing industry contacts
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16">
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2 dark:text-white">{contacts.length}</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">TOTAL CONTACTS</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl text-center">
            <div className="text-3xl sm:text-4xl font-bold mb-2 dark:text-white">1</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">INDUSTRIES</div>
          </div>
          <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl text-center sm:col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl font-bold mb-2 dark:text-white">53</div>
            <div className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">COMPANIES</div>
          </div>
        </div>

        {/* Main Content */}
        <FinderToolbar
          onViewChange={setViewMode}
          currentView={viewMode}
          onSearch={setSearchQuery}
          onAddContact={handleAddContact}
          onAddContacts={handleAddContacts}
          onSort={handleSort}
          onGroup={handleGroup}
          currentSort={sortField}
          currentGroup={groupField}
        />
        
        <div className={`p-4 ${viewMode === 'columns' ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 [column-fill:_balance]' : ''}`}>
          {groupField === 'none' ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                : viewMode === 'columns'
                  ? 'space-y-4'  
                  : ''
            }>
              {sortedContacts.map(contact => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  viewMode={viewMode}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          ) : (
            Object.entries(groupedContacts).map(([group, contacts]) => (
              <div key={group} className={`mb-8 ${viewMode === 'columns' ? 'break-inside-avoid' : ''}`}>
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 mb-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {group}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {contacts.length} contacts
                    </span>
                  </div>
                </div>
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : viewMode === 'columns'
                      ? 'space-y-4'  
                      : ''
                }>
                  {contacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      viewMode={viewMode}
                      onEdit={handleEditContact}
                      onDelete={handleDeleteContact}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
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
