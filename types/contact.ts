export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  title?: string;
  country?: string;
  industry?: string;
  lastOpened?: string;
  dateAdded?: string;
  dateModified?: string;
  dateCreated?: string;
  tags?: string[];
}

export interface ContactsData {
  contacts: Contact[];
}
