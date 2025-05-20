import { FC } from 'react';

interface CodeResetModalProps {
  isOpen: boolean;
  onResetCancel: () => void;
  onResetConfirm: () => void;
}

const CodeResetModal: FC<CodeResetModalProps> = ({ isOpen, onResetCancel, onResetConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-start mb-4">
          <div className="bg-green-600 rounded-full p-2 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <h3 className="text-white text-lg font-medium">Are you sure?</h3>
            <p className="text-zinc-400 mt-2">
              Your current code will be discarded and reset to the default code!
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onResetCancel}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onResetConfirm}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeResetModal;