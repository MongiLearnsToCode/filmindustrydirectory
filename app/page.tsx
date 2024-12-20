'use client';

import { useState, useEffect, useMemo, Fragment } from 'react';
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
  const [groupBy, setGroupBy] = useState<keyof Contact | null>(null);

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

  const handleGroupChange = (field: keyof Contact | null) => {
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
      const key = groupBy;
      const groupValue = (contact[key]?.toString() || 'Other');
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
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <FinderToolbar
        onViewChange={setViewMode}
        currentView={viewMode}
        onSearch={setSearchQuery}
        onAddContact={handleAddContact}
        onFilterChange={handleFilterChange}
        onSortChange={setSortConfig}
        onGroupChange={setGroupBy}
        searchFilters={searchFilters}
        sortConfig={sortConfig}
        groupBy={groupBy}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(groupedContacts).map(([group, contacts]) => (
              <Fragment key={group}>
                {groupBy && (
                  <div className="col-span-full mt-6 first:mt-0">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      {group}
                    </h2>
                  </div>
                )}
                {contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    viewMode={viewMode}
                    onEdit={setEditingContact}
                    onDelete={() => {}}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-6">
            {Object.entries(groupedContacts).map(([group, contacts]) => (
              <div key={group}>
                {groupBy && (
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {group}
                  </h2>
                )}
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      viewMode={viewMode}
                      onEdit={setEditingContact}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {Object.values(groupedContacts).flat().length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No contacts found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Add your first contact to get started"}
            </p>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          action={toast.action}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
