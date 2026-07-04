import React, { useState, useEffect } from 'react';
import { Filter, Loader } from 'lucide-react';
import { vendasQueries } from '../api/queries/vendas.queries';
import { clientesQueries } from '../api/queries/clientes.queries';
import { produtosQueries } from '../api/queries/produtos.queries';
import type { ClienteDto, ProdutoDto, VendaHistorico } from '../types';

export const HistoricoVendas = () => {
  const [vendas, setVendas] = useState<VendaHistorico[]>([]);
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);

  // Filtros
  const [clienteFiltro, setClienteFiltro] = useState<string>('');
  const [produtoFiltro, setProdutoFiltro] = useState<string>('');
  const [dataFiltro, setDataFiltro] = useState<string>('');

  const [carregando, setCarregando] = useState(true);

  const carregarVendas = async () => {
    setCarregando(true);
    try {
      const dados = await vendasQueries.obterHistoricoVendas(produtoFiltro, dataFiltro, clienteFiltro);
      setVendas(dados);
    } catch (error) {
      console.error('Erro ao buscar histórico de vendas:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      try {
        const [c, p] = await Promise.all([
          clientesQueries.obterTodos(),
          produtosQueries.obterTodos()
        ]);
        setClientes(c);
        setProdutos(p);
        
        // Carrega inicial sem filtros
        const dados = await vendasQueries.obterHistoricoVendas();
        setVendas(dados);
      } catch (error) {
        console.error('Erro ao inicializar histórico de vendas:', error);
      } finally {
        setCarregando(false);
      }
    };
    inicializar();
  }, []);

  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    carregarVendas();
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <form onSubmit={handleFiltrar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Filtrar por Cliente</label>
            <select 
              className="input-field"
              value={clienteFiltro}
              onChange={(e) => setClienteFiltro(e.target.value)}
            >
              <option value="">Todos os clientes</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.razaoSocial}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Produto</label>
            <select 
              className="input-field"
              value={produtoFiltro}
              onChange={(e) => setProdutoFiltro(e.target.value)}
            >
              <option value="">Todos os produtos</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Data Específica</label>
            <input 
              type="date" 
              className="input-field" 
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary flex items-center justify-center gap-2 py-2.5">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </form>
      </div>

      <div className="table-container">
        {carregando ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Buscando histórico...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Venda</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto(s)</th>
                <th>Qtd Total</th>
                <th>Prazo (Dias)</th>
                <th>Possui NF</th>
                <th>Comissão</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-slate-400">Nenhuma venda encontrada para os filtros selecionados.</td>
                </tr>
              ) : (
                vendas.map((venda, index) => {
                  const isLast = vendas.length > 1 && index === vendas.length - 1;
                  return (
                    <tr key={venda.id}>
                      <td className="font-medium text-yellow-600">#{venda.id}</td>
                      <td className="text-slate-600">{venda.dataVenda ? new Date(venda.dataVenda).toLocaleDateString('pt-BR') : '-'}</td>
                      <td className="text-slate-800 font-medium">{venda.razaoSocial}</td>
                      <td className="text-slate-600">
                        <div className="relative group flex justify-center">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-750 font-bold text-xs cursor-help hover:bg-yellow-100 transition-colors">
                            {venda.itens ? venda.itens.length : 0}
                          </div>
                          {venda.itens && venda.itens.length > 0 && (
                            isLast ? (
                              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50 w-64 bg-white border border-slate-150 text-slate-800 text-xs rounded-lg p-3 shadow-xl pointer-events-none">
                                <div className="font-bold border-b border-slate-100 pb-1.5 mb-1.5 text-[10px] uppercase tracking-wider text-slate-400">
                                  Itens da Venda
                                </div>
                                <ul className="space-y-1.5">
                                  {venda.itens.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center gap-4">
                                      <span className="truncate text-slate-700 font-medium">{item.nome}</span>
                                      <span className="bg-yellow-50 text-yellow-750 border border-yellow-200/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {item.quantidade}x
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-150 -z-10 mt-[1px]"></div>
                              </div>
                            ) : (
                              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:block z-50 w-64 bg-white border border-slate-150 text-slate-800 text-xs rounded-lg p-3 shadow-xl pointer-events-none">
                                <div className="font-bold border-b border-slate-100 pb-1.5 mb-1.5 text-[10px] uppercase tracking-wider text-slate-400">
                                  Itens da Venda
                                </div>
                                <ul className="space-y-1.5">
                                  {venda.itens.map((item, idx) => (
                                    <li key={idx} className="flex justify-between items-center gap-4">
                                      <span className="truncate text-slate-700 font-medium">{item.nome}</span>
                                      <span className="bg-yellow-50 text-yellow-750 border border-yellow-200/50 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {item.quantidade}x
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-white"></div>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-150 -z-10 mr-[1px]"></div>
                              </div>
                            )
                          )}
                        </div>
                      </td>
                    <td className="text-slate-600">{venda.quantidadeTotal}</td>
                    <td className="text-slate-600">{venda.prazoPagamentoDias} dias</td>
                    <td className="text-slate-600">{venda.possuiNotaFiscal ? 'Sim' : 'Não'}</td>
                    <td className="font-medium text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.comissaoTotal)}</td>
                    <td className="font-semibold text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.valorTotal)}</td>
                  </tr>
                ); })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
