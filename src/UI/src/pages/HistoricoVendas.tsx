import React, { useState, useEffect } from 'react';
import { Filter, Loader, CheckCircle2, Clock, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Popup } from '../components/Popup';
import { vendasQueries } from '../api/queries/vendas.queries';
import { vendasCommands } from '../api/commands/vendas.commands';
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
  const [statusComissaoFiltro, setStatusComissaoFiltro] = useState<'todos' | 'recebida' | 'pendente'>('todos');

  const [carregando, setCarregando] = useState(true);
  const [baixandoId, setBaixandoId] = useState<number | null>(null);
  const [popup, setPopup] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'confirm';
    title?: string;
    message: string;
    onConfirm?: () => void;
  } | null>(null);

  const carregarVendas = async () => {
    setCarregando(true);
    try {
      let comissaoParam: boolean | undefined = undefined;
      if (statusComissaoFiltro === 'recebida') comissaoParam = true;
      if (statusComissaoFiltro === 'pendente') comissaoParam = false;

      const dados = await vendasQueries.obterHistoricoVendas(produtoFiltro, dataFiltro, clienteFiltro, comissaoParam);
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

  const handleDarBaixa = (vendaId: number) => {
    if (baixandoId) return;

    setPopup({
      show: true,
      type: 'confirm',
      title: 'Confirmar Baixa',
      message: `Deseja confirmar o recebimento da comissão da venda #${vendaId}?`,
      onConfirm: () => executarBaixa(vendaId)
    });
  };

  const executarBaixa = async (vendaId: number) => {
    setPopup(null);
    setBaixandoId(vendaId);
    try {
      await vendasCommands.darBaixaComissao(vendaId);
      setVendas(prev => prev.map(v => v.id === vendaId ? { ...v, comissaoRecebida: true } : v));
      setPopup({
        show: true,
        type: 'success',
        title: 'Comissão Baixada',
        message: `A comissão da venda #${vendaId} foi registrada como recebida com sucesso!`
      });
    } catch (error: any) {
      console.error('Erro ao dar baixa na comissão:', error);
      const mensagemErro = error?.response?.data?.erro || error?.response?.data?.Erro || 'Erro ao registrar baixa da comissão.';
      setPopup({
        show: true,
        type: 'error',
        title: 'Erro na Operação',
        message: mensagemErro
      });
    } finally {
      setBaixandoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <form onSubmit={handleFiltrar} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Filtrar por Cliente</label>
            <select 
              className="input-field text-sm"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Produto</label>
            <select 
              className="input-field text-sm"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Status Comissão</label>
            <select 
              className="input-field text-sm"
              value={statusComissaoFiltro}
              onChange={(e) => setStatusComissaoFiltro(e.target.value as any)}
            >
              <option value="todos">Todas</option>
              <option value="pendente">Pendente de Recebimento</option>
              <option value="recebida">Comissão Recebida</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Data Específica</label>
            <input 
              type="date" 
              className="input-field text-sm" 
              value={dataFiltro}
              onChange={(e) => setDataFiltro(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2 py-2 px-4 h-[42px] whitespace-nowrap text-sm font-semibold hover:bg-slate-200 transition-colors">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>
        </form>
      </div>

      <div className="table-container shadow-sm border border-slate-200/80 rounded-xl overflow-x-auto">
        {carregando ? (
          <div className="flex items-center justify-center py-12 text-slate-500 gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Buscando histórico...</span>
          </div>
        ) : (
          <table className="data-table min-w-[1080px] w-full">
            <thead>
              <tr>
                <th className="whitespace-nowrap w-20">ID Venda</th>
                <th className="whitespace-nowrap w-24">Data</th>
                <th className="min-w-[180px] max-w-[240px]">Cliente</th>
                <th className="text-center whitespace-nowrap w-20">Produto(s)</th>
                <th className="text-center whitespace-nowrap w-24">Qtd Total</th>
                <th className="text-center whitespace-nowrap w-24">Prazo</th>
                <th className="text-center whitespace-nowrap w-20">Possui NF</th>
                <th className="text-right whitespace-nowrap w-28">Comissão</th>
                <th className="text-right whitespace-nowrap w-28">Valor Total</th>
                <th className="text-center whitespace-nowrap w-36">Status Comissão</th>
                <th className="text-center whitespace-nowrap w-32">Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendas.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-12 text-slate-400">Nenhuma venda encontrada para os filtros selecionados.</td>
                </tr>
              ) : (
                vendas.map((venda, index) => {
                  const isLast = vendas.length > 1 && index === vendas.length - 1;
                  return (
                    <tr key={venda.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="font-semibold text-yellow-600 whitespace-nowrap">#{venda.id}</td>
                      <td className="text-slate-600 whitespace-nowrap">{venda.dataVenda ? new Date(venda.dataVenda).toLocaleDateString('pt-BR') : '-'}</td>
                      <td>
                        <div className="font-medium text-slate-800 line-clamp-2 leading-snug" title={venda.razaoSocial}>
                          {venda.razaoSocial}
                        </div>
                      </td>
                      <td className="text-center">
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
                    <td className="text-center text-slate-600 whitespace-nowrap">{venda.quantidadeTotal}</td>
                    <td className="text-center text-slate-600 whitespace-nowrap">{venda.prazoPagamentoDias} dias</td>
                    <td className="text-center text-slate-600 whitespace-nowrap">{venda.possuiNotaFiscal ? 'Sim' : 'Não'}</td>
                    <td className="text-right font-medium text-slate-700 whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.comissaoTotal)}</td>
                    <td className="text-right font-semibold text-slate-900 whitespace-nowrap">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.valorTotal)}</td>
                    <td className="text-center whitespace-nowrap">
                      {venda.comissaoRecebida ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          Recebida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDarBaixa(venda.id)}
                        disabled={venda.comissaoRecebida || baixandoId === venda.id}
                        className={clsx(
                          "text-xs py-1.5 px-3 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition-all",
                          venda.comissaoRecebida
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/80 shadow-none"
                            : "btn-primary active:scale-95 shadow-sm hover:shadow cursor-pointer"
                        )}
                        title={venda.comissaoRecebida ? "Comissão já recebida" : "Registrar recebimento da comissão"}
                      >
                        {baixandoId === venda.id ? (
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                        <span>Dar baixa</span>
                      </button>
                    </td>
                  </tr>
                ); })
              )}
            </tbody>
          </table>
        )}
      </div>

      <Popup 
        show={popup?.show ?? false}
        type={popup?.type ?? 'confirm'}
        title={popup?.title}
        message={popup?.message ?? ''}
        onClose={() => setPopup(null)}
        onConfirm={popup?.onConfirm}
      />
    </div>
  );
};
