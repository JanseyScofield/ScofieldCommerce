import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ClienteSearchSection } from './ClienteSearchSection';
import type { ClienteDto } from '../types';

interface ClienteModalProps {
  show: boolean;
  onClose: () => void;
  SelectClient?: boolean;
  onSelectClient?: (cliente: ClienteDto) => void;
  clienteSelecionadoId?: number | '';
}

export const ClienteModal: React.FC<ClienteModalProps> = ({
  show,
  onClose,
  SelectClient = false,
  onSelectClient,
  clienteSelecionadoId
}) => {
  const [selectedCliente, setSelectedCliente] = useState<ClienteDto | null>(null);

  if (!show) return null;

  const handleConfirmarSelecao = () => {
    if (selectedCliente && onSelectClient) {
      onSelectClient(selectedCliente);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {SelectClient ? 'Selecionar Cliente' : 'Lista de Clientes'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Busque por nome ou CNPJ para localizar o cliente desejado
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <ClienteSearchSection
            SelectClient={SelectClient}
            onSelectClient={(c) => setSelectedCliente(c)}
            clienteSelecionadoId={clienteSelecionadoId}
            selectedCliente={selectedCliente}
            onClienteChange={(c) => setSelectedCliente(c)}
          />
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary py-2 px-4 text-sm"
          >
            {SelectClient ? 'Cancelar' : 'Fechar'}
          </button>
          {SelectClient && (
            <button
              type="button"
              onClick={handleConfirmarSelecao}
              disabled={!selectedCliente}
              className="btn-primary py-2 px-5 text-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Selecionar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
