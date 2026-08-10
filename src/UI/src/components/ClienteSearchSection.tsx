import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Loader } from 'lucide-react';
import { clientesQueries } from '../api/queries/clientes.queries';
import type { ClienteDto } from '../types';

interface ClienteSearchSectionProps {
  SelectClient?: boolean;
  onSelectClient?: (cliente: ClienteDto) => void;
  clienteSelecionadoId?: number | '';
  selectedCliente?: ClienteDto | null;
  onClienteChange?: (cliente: ClienteDto | null) => void;
}

export const ClienteSearchSection: React.FC<ClienteSearchSectionProps> = ({
  SelectClient = false,
  onSelectClient,
  clienteSelecionadoId,
  selectedCliente: externalSelected,
  onClienteChange
}) => {
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [cnpjFiltro, setCnpjFiltro] = useState('');
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [internalSelected, setInternalSelected] = useState<ClienteDto | null>(null);

  const selectedCliente = externalSelected !== undefined ? externalSelected : internalSelected;

  const setSelectedCliente = (cliente: ClienteDto | null) => {
    setInternalSelected(cliente);
    if (onClienteChange) {
      onClienteChange(cliente);
    }
  };

  const buscarClientes = async (nome?: string, cnpj?: string) => {
    setCarregando(true);
    try {
      const dados = await clientesQueries.obterFiltrados(nome, cnpj);
      setClientes(dados);

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
    buscarClientes();
  }, []);

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
      if (onSelectClient) {
        onSelectClient(cliente);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Form */}
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
      <div className="table-container max-h-[400px] overflow-x-auto overflow-y-auto border border-slate-200">
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

      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>Total de registros encontrados: <strong className="text-slate-700">{clientes.length}</strong></span>
      </div>
    </div>
  );
};
