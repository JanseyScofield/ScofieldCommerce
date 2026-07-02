import React from 'react';

interface PopupProps {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ show, type, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/20 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className={`bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-t-4 transform transition-all ${
        type === 'error' ? 'border-red-500' : 'border-green-500'
      }`}>
        <h3 className={`text-xl font-bold mb-3 ${
          type === 'error' ? 'text-red-600' : 'text-green-600'
        }`}>
          {type === 'error' ? 'Erro' : 'Sucesso'}
        </h3>
        <p className="text-slate-600 mb-8">{message}</p>
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${
              type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
