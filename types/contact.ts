export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  title?: string;
  country?: string;
  industry?: string;
  notes?: string;
  lastOpened?: string;
  dateAdded?: string;
  dateModified?: string;
  dateCreated?: string;
  tags?: string[];
}

export interface ContactsData {
  contacts: Contact[];
}

export interface SearchFilters {
  industry: string;
  country: string;
  tags: string[];
}

export type SortField = 'name' | 'company' | 'dateModified' | 'dateAdded';

export interface SortConfig {
  field: SortField;
  direction: 'asc' | 'desc';
}
