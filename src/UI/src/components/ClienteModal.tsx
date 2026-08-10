import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, X, Loader, Check } from 'lucide-react';
import { clientesQueries } from '../api/queries/clientes.queries';
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
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [cnpjFiltro, setCnpjFiltro] = useState('');
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<ClienteDto | null>(null);

  const buscarClientes = async (nome?: string, cnpj?: string) => {
    setCarregando(true);
    try {
      const dados = await clientesQueries.obterFiltrados(nome, cnpj);
      setClientes(dados);

      // Pre-select if clienteSelecionadoId is matched in loaded list
      if (clienteSelecionadoId && SelectClient) {
        const encontrado = dados.find(c => c.id === Number(clienteSelecionadoId));
        if (encontrado) {
          setSelectedCliente(encontrado);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (show) {
      setNomeFiltro('');
      setCnpjFiltro('');
      setSelectedCliente(null);
      buscarClientes();
    }
  }, [show]);

  if (!show) return null;

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    buscarClientes(nomeFiltro, cnpjFiltro);
  };

  const handleLimparFiltros = () => {
    setNomeFiltro('');
    setCnpjFiltro('');
    buscarClientes('', '');
  };

  const handleToggleSelect = (cliente: ClienteDto) => {
    if (!SelectClient) return;
    if (selectedCliente?.id === cliente.id) {
      setSelectedCliente(null);
    } else {
      setSelectedCliente(cliente);
    }
  };

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

        {/* Modal Body / Filters */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <form onSubmit={handleBuscar} className="card p-4 bg-slate-50/80 border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nome / Razão Social</label>
                <input
                  type="text"
                  className="input-field py-2 text-sm"
                  placeholder="Buscar por nome ou razão social..."
                  value={nomeFiltro}
                  onChange={(e) => setNomeFiltro(e.target.value)}
                />
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-semibold text-slate-600 mb-1">CNPJ</label>
                <input
                  type="text"
                  className="input-field py-2 text-sm"
                  placeholder="Buscar por CNPJ..."
                  value={cnpjFiltro}
                  onChange={(e) => setCnpjFiltro(e.target.value)}
                />
              </div>
              <div className="md:col-span-3 flex gap-2">
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2 px-3 text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Search className="w-3.5 h-3.5" />
                  Buscar
                </button>
                <button
                  type="button"
                  onClick={handleLimparFiltros}
                  className="btn-secondary flex-1 py-2 px-3 text-xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                  title="Limpar Filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpar
                </button>
              </div>
            </div>
          </form>

          {/* Table Container */}
          <div className="table-container max-h-[350px] overflow-x-auto overflow-y-auto border border-slate-200">
            {carregando ? (
              <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
                <Loader className="w-5 h-5 animate-spin text-yellow-500" />
                <span className="text-sm font-medium">Carregando clientes...</span>
              </div>
            ) : (
              <table className="data-table min-w-[700px]">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr>
                    {SelectClient && <th className="w-12 text-center">Sel.</th>}
                    <th className="min-w-[160px]">Razão Social</th>
                    <th className="min-w-[140px]">Nome Fantasia</th>
                    <th className="min-w-[130px]">CNPJ</th>
                    <th className="min-w-[120px]">Comprador</th>
                    <th className="min-w-[110px]">Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.length === 0 ? (
                    <tr>
                      <td colSpan={SelectClient ? 6 : 5} className="text-center py-8 text-slate-400">
                        Nenhum cliente encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    clientes.map((cliente) => {
                      const isSelected = selectedCliente?.id === cliente.id;
                      return (
                        <tr 
                          key={cliente.id}
                          onClick={() => handleToggleSelect(cliente)}
                          className={`${SelectClient ? 'cursor-pointer' : ''} ${
                            isSelected ? 'bg-yellow-50/70 hover:bg-yellow-50' : ''
                          }`}
                        >
                          {SelectClient && (
                            <td className="text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelect(cliente)}
                                className="w-4 h-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-400 cursor-pointer"
                              />
                            </td>
                          )}
                          <td className="font-semibold text-slate-800">{cliente.razaoSocial}</td>
                          <td className="text-slate-600">{cliente.nomeFantasia}</td>
                          <td className="text-slate-600 font-mono text-xs">{cliente.cnpj}</td>
                          <td className="text-slate-600">{cliente.nomeComprador}</td>
                          <td className="text-slate-600">{cliente.telefoneComprador}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Total de registros: <span className="font-semibold text-slate-700">{clientes.length}</span>
          </div>
          <div className="flex gap-3">
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
    </div>
  );
};
