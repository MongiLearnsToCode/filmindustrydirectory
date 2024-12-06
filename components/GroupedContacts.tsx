import { Contact } from '../types/contact';
import ContactCard from './ContactCard';
import { motion } from 'framer-motion';

interface GroupedContactsProps {
  contacts: Contact[];
  groupBy: 'none' | 'country' | 'company' | 'industry';
  viewMode: 'grid' | 'list' | 'columns';
  onEditContact: (contact: Contact) => void;
  onDeleteContact: (contact: Contact) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function GroupedContacts({ 
  contacts, 
  groupBy, 
  viewMode,
  onEditContact,
  onDeleteContact 
}: GroupedContactsProps) {
  const getViewClassName = () => {
    switch (viewMode) {
      case 'list':
        return 'space-y-4';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      case 'columns':
        return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  if (groupBy === 'none') {
    return (
      <motion.div 
        className={getViewClassName()}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {contacts.map((contact, index) => (
          <motion.div key={contact.id || index} variants={item}>
            <ContactCard 
              contact={contact} 
              viewMode={viewMode}
              onEdit={onEditContact}
              onDelete={onDeleteContact}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  const groupedContacts = contacts.reduce((groups, contact) => {
    let key = 'Other';
    
    if (groupBy === 'country' && contact.country) {
      key = contact.country;
    } else if (groupBy === 'company' && contact.company) {
      key = contact.company;
    } else if (groupBy === 'industry' && contact.industry) {
      key = contact.industry;
    }
                
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(contact);
    return groups;
  }, {} as Record<string, Contact[]>);

  console.log('Grouped contacts:', Object.keys(groupedContacts));

  // Sort groups alphabetically and ensure 'Other' is always last
  const sortedGroups = Object.entries(groupedContacts)
    .sort(([a], [b]) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return a.localeCompare(b);
    });

  return (
    <div className="space-y-8">
      {sortedGroups.map(([group, groupContacts]) => (
        <motion.div 
          key={group}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {group}
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({groupContacts.length} {groupContacts.length === 1 ? 'contact' : 'contacts'})
            </span>
          </h2>
          <motion.div 
            className={getViewClassName()}
            variants={container}
            initial="hidden"
            animate="show"
          >
            {groupContacts.map((contact, index) => (
              <motion.div key={contact.id || index} variants={item}>
                <ContactCard 
                  contact={contact} 
                  viewMode={viewMode}
                  onEdit={onEditContact}
                  onDelete={onDeleteContact}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
