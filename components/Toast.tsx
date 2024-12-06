import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onUndo, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-up">
      <span>{message}</span>
      {onUndo && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onUndo();
            onClose();
          }}
          className="ml-4 text-blue-400 hover:text-blue-300 font-medium"
        >
          Undo
        </button>
      )}
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-gray-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
