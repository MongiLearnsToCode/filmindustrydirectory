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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-xl w-full max-w-md
                     border border-surface-200 dark:border-surface-700
                     transform transition-all duration-200
                     animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Upload Contacts CSV</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center
              transition-colors duration-200
              ${isDragging 
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10' 
                : 'border-surface-200 dark:border-surface-700 hover:border-primary-500/50 dark:hover:border-primary-400/50'}
            `}
          >
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mt-2 text-sm text-surface-600 dark:text-surface-400">
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
                className="mt-3 inline-flex items-center px-4 py-2 btn btn-secondary cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Browse Files
              </label>
            </div>
            
            {error && (
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            <div className="mt-4 text-xs text-surface-500 dark:text-surface-400 space-y-1">
              <p>Required columns: <span className="font-medium">name, email, company</span></p>
              <p>Optional columns: country, industry, tags</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
