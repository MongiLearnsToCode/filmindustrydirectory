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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upload Contacts CSV</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          `}
        >
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mt-1 text-sm text-gray-600">
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
              className="mt-2 inline-block px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Browse Files
            </label>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          
          <div className="mt-4 text-xs text-gray-500">
            <p>Required columns: name, email, company</p>
            <p>Optional columns: country, industry, tags</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
