import { useState, useEffect } from 'react';
import { Filter, Loader } from 'lucide-react';
import { vendasQueries } from '../api/queries/vendas.queries';
import { clientesQueries } from '../api/queries/clientes.queries';
import type { ClienteDto } from '../api/queries/clientes.queries';
import { produtosQueries } from '../api/queries/produtos.queries';
import type { ProdutoDto } from '../api/queries/produtos.queries';

export const HistoricoVendas = () => {
  const [vendas, setVendas] = useState<any[]>([]);
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
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">Nenhuma venda encontrada para os filtros selecionados.</td>
                </tr>
              ) : (
                vendas.map((venda) => (
                  <tr key={venda.id}>
                    <td className="font-medium text-yellow-600">#{venda.id}</td>
                    <td className="text-slate-600">{venda.data ? new Date(venda.data).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="text-slate-800 font-medium">{venda.cliente}</td>
                    <td className="text-slate-600">{venda.produto}</td>
                    <td className="text-slate-600">{venda.quantidade}</td>
                    <td className="font-semibold text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.total)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venda.status === 'Concluída' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                          : 'bg-red-50 text-red-700 border border-red-200/50'
                      }`}>
                        {venda.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
