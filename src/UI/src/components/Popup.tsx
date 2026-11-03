import React from 'react';

interface PopupProps {
  show: boolean;
  type: 'success' | 'error' | 'confirm';
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Popup: React.FC<PopupProps> = ({ 
  show, 
  type, 
  title,
  message, 
  onClose, 
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!show) return null;

  const getBorderColor = () => {
    switch (type) {
      case 'error': return 'border-red-500';
      case 'confirm': return 'border-yellow-400';
      case 'success': default: return 'border-green-500';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'confirm': return 'text-yellow-600';
      case 'success': default: return 'text-green-600';
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'error': return 'Erro';
      case 'confirm': return 'Confirmação';
      case 'success': default: return 'Sucesso';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/30 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className={`bg-white rounded-xl p-6 max-w-md w-full shadow-2xl border-t-4 transform transition-all ${getBorderColor()}`}>
        <h3 className={`text-xl font-bold mb-3 ${getTitleColor()}`}>
          {title || getDefaultTitle()}
        </h3>
        <p className="text-slate-600 mb-8 text-sm leading-relaxed">{message}</p>
        
        {type === 'confirm' ? (
          <div className="flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
            >
              {cancelText}
            </button>
            <button 
              type="button"
              onClick={() => {
                if (onConfirm) onConfirm();
              }}
              className="px-5 py-2 rounded-lg font-semibold text-slate-900 bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-sm text-sm"
            >
              {confirmText}
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors text-sm ${
                type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
