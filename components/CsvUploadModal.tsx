import React, { useState } from 'react';
import { Contact } from '../types/contact';

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (contacts: Omit<Contact, 'id'>[]) => void;
}

export default function CsvUploadModal({ isOpen, onClose, onUpload }: CsvUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      // Validate required headers
      const requiredHeaders = ['name', 'email', 'company'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`Missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      const contacts = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(',').map(v => v.trim());
          const contact: any = {};
          
          headers.forEach((header, index) => {
            contact[header] = values[index] || '';
          });
          
          return contact;
        });

      onUpload(contacts);
      onClose();
      setError(null);
    } catch (err) {
      setError('Error processing CSV file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md
                     border border-gray-200 dark:border-gray-800
                     transform transition-all duration-200
                     animate-in fade-in slide-in-from-bottom-4
                     dark:shadow-black/20">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-3">
            <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Upload CSV File</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg
                     text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                     transition-colors duration-150"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please select a CSV file to upload your contacts.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8
              transition-all duration-200
              ${isDragging 
                ? 'border-yellow-500 bg-yellow-50 dark:border-yellow-400/50 dark:bg-yellow-400/10' 
                : 'border-gray-300 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-400/50'
              }
            `}
          >
            <div className="text-center space-y-4">
              <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop your CSV file here, or
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="mt-2 inline-flex items-center px-4 py-2 rounded-lg
                           text-sm font-medium
                           bg-gradient-to-r from-yellow-400 to-yellow-500
                           hover:from-yellow-500 hover:to-yellow-600
                           dark:from-yellow-500/90 dark:to-yellow-600/90
                           dark:hover:from-yellow-500 dark:hover:to-yellow-600
                           text-gray-900 dark:text-gray-900
                           shadow-sm hover:shadow-md dark:shadow-yellow-500/10
                           transform hover:scale-[1.02]
                           focus:outline-none focus:ring-2 focus:ring-yellow-500/50 dark:focus:ring-yellow-400/30
                           transition-all duration-150
                           cursor-pointer"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Browse Files
                </label>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="p-3 rounded-lg 
                         bg-red-50 dark:bg-red-500/10 
                         border border-red-200 dark:border-red-500/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          <div className="text-xs space-y-1.5 text-gray-500 dark:text-gray-400">
            <p>Required columns: <span className="font-medium text-gray-900 dark:text-gray-300">name, email, company</span></p>
            <p>Optional columns: country, industry, tags</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 
                      bg-gray-50 dark:bg-gray-800/50
                      border-t border-gray-200 dark:border-gray-800 
                      rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg
                     text-gray-700 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     focus:outline-none focus:ring-2 focus:ring-gray-400/50 dark:focus:ring-gray-500/50
                     transition-colors duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
