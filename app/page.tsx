'use client';

import { useState, useEffect, useMemo } from 'react';
import { ContactsData, Contact, SearchFilters, SortConfig } from '../types/contact';
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
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    industry: '',
    country: '',
    tags: [],
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'dateModified',
    direction: 'desc'
  });
  const [groupBy, setGroupBy] = useState<string | null>(null);

  // Create search index for better performance
  const searchIndex = useMemo(() => {
    return contacts.map(contact => ({
      ...contact,
      searchableText: [
        contact.name,
        contact.company,
        contact.industry,
        contact.role,
        contact.email,
        contact.phone,
        contact.location,
        contact.notes,
        ...(contact.tags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
    }));
  }, [contacts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  const handleFilterChange = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const handleSortChange = (config: SortConfig) => {
    setSortConfig(config);
  };

  const handleGroupChange = (field: string | null) => {
    setGroupBy(field);
  };

  // First filter and sort contacts
  const processedContacts = useMemo(() => {
    // First apply search query
    let results = searchQuery ? 
      searchIndex.filter(contact => 
        contact.searchableText.includes(searchQuery.toLowerCase())
      ).map(({ searchableText, ...contact }) => contact)
      : contacts;
    
    // Then apply filters
    if (searchFilters.industry) {
      results = results.filter(contact => 
        contact.industry?.toLowerCase().includes(searchFilters.industry.toLowerCase())
      );
    }
    
    if (searchFilters.country) {
      results = results.filter(contact => 
        contact.country?.toLowerCase().includes(searchFilters.country.toLowerCase())
      );
    }
    
    if (searchFilters.tags.length > 0) {
      results = results.filter(contact => 
        contact.tags?.some(tag => 
          searchFilters.tags.includes(tag)
        )
      );
    }
    
    // Finally sort
    return results.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];
      
      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;
      
      const comparison = aValue.localeCompare(bValue);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [contacts, searchQuery, searchFilters, sortConfig, searchIndex]);

  // Then group contacts if grouping is enabled
  const groupedContacts = useMemo(() => {
    if (!groupBy) return { ungrouped: processedContacts };

    return processedContacts.reduce((groups: Record<string, Contact[]>, contact) => {
      const groupValue = contact[groupBy as keyof Contact] || 'Other';
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(contact);
      return groups;
    }, {});
  }, [processedContacts, groupBy]);

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
    <main className="min-h-screen bg-[rgb(var(--background-primary))]">
      <div className="bg-[rgb(var(--background-secondary))] dark:bg-gradient-to-b from-[rgb(var(--background-primary))] to-[rgb(var(--background-secondary))]">
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
            <h1 className="text-4xl sm:text-5xl font-bold text-[rgb(var(--text-primary))] dark:text-[rgb(var(--accent))] mb-6">
              Industry Directory
            </h1>
            <p className="text-lg sm:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto">
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
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onGroupChange={handleGroupChange}
        searchFilters={searchFilters}
        sortConfig={sortConfig}
        groupBy={groupBy}
      />
      
      <div className="p-4">
        {groupBy ? (
          Object.entries(groupedContacts).map(([group, contacts]) => (
            <div key={group} className="mb-8">
              <h2 className="text-lg font-semibold text-[rgb(var(--text-primary))] mb-4">{group}</h2>
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'grid-cols-1 gap-2'
              }`}>
                {contacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    viewMode={viewMode}
                    onEdit={setEditingContact}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className={`grid ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'grid-cols-1 gap-2'
          }`}>
            {processedContacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                viewMode={viewMode}
                onEdit={setEditingContact}
              />
            ))}
          </div>
        )}
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
