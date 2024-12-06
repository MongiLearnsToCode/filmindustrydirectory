import { Search } from 'lucide-react';
import { useState, useCallback, ChangeEvent } from 'react';

export default function SearchBar({ 
  onSearch 
}: { 
  onSearch: (query: string) => void 
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  }, [onSearch]);

  return (
    <div className="relative mb-8 w-full max-w-2xl mx-auto">
      <div className={`
        relative flex items-center transition-all duration-200
        ${isFocused ? 'transform scale-[1.02]' : ''}
      `}>
        <Search 
          className="absolute left-3 w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="text"
          placeholder="Search by name, company, country, or email..."
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full pl-10 pr-4 py-3 
            bg-white dark:bg-slate-800
            border border-gray-200 dark:border-slate-700
            rounded-xl
            shadow-sm
            transition-all duration-200
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            dark:focus:ring-primary/30 dark:focus:border-primary
            dark:text-white
          "
        />
      </div>
    </div>
  );
}
