import { useState, useEffect } from 'react';
import { Trash2, Plus, CheckCircle, Loader } from 'lucide-react';
import { vendasCommands } from '../api/commands/vendas.commands';
import { clientesQueries } from '../api/queries/clientes.queries';
import type { ClienteDto } from '../api/queries/clientes.queries';
import { produtosQueries } from '../api/queries/produtos.queries';
import type { ProdutoDto } from '../api/queries/produtos.queries';
import { Popup } from '../components/Popup';

interface ItemVenda {
  id: string;
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

export const NovaVenda = () => {
  const [clientes, setClientes] = useState<ClienteDto[]>([]);
  const [produtos, setProdutos] = useState<ProdutoDto[]>([]);
  const [itens, setItens] = useState<ItemVenda[]>([]);
  const [subtotalGeral, setSubtotalGeral] = useState<number>(0);
  const [valorComissaoEstimada, setValorComissaoEstimada] = useState<number>(0);
  
  // Estados de formulário
  const [clienteSelecionado, setClienteSelecionado] = useState<number | ''>('');
  const [prazoPagamento, setPrazoPagamento] = useState<number>(0);
  const [possuiNotaFiscal, setPossuiNotaFiscal] = useState<boolean>(true);

  // Estados de item sendo adicionado
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | ''>('');
  const [quantidadeAtual, setQuantidadeAtual] = useState<number>(1);
  const [precoAtual, setPrecoAtual] = useState<number>(0);

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [popup, setPopup] = useState<{show: boolean, type: 'success' | 'error', message: string} | null>(null);

  const showPopup = (type: 'success' | 'error', message: string) => {
    setPopup({ show: true, type, message });
  };

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [c, p] = await Promise.all([
          clientesQueries.obterTodos(),
          produtosQueries.obterTodos()
        ]);
        setClientes(c);
        setProdutos(p);
      } catch (error) {
        console.error('Erro ao carregar dados para a venda:', error);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  // Preenche preço unitário ao selecionar um produto
  const handleProdutoChange = (id: number | '') => {
    setProdutoSelecionadoId(id);
    if (id === '') {
      setPrecoAtual(0);
      return;
    }
    const prod = produtos.find(p => p.id === id);
    if (prod) {
      setPrecoAtual(prod.precoMaximo);
    } else {
      setPrecoAtual(0);
    }
  };

  const adicionarItem = () => {
    if (!produtoSelecionadoId || quantidadeAtual <= 0 || precoAtual <= 0) return;
    
    const prod = produtos.find(p => p.id === Number(produtoSelecionadoId));
    if (!prod) return;

    // Evita duplicidade agrupando ou alertando
    const itemExistente = itens.find(i => i.produtoId === prod.id);
    if (itemExistente) {
      showPopup('error', 'Este produto já foi adicionado. Remova-o ou edite para alterar a quantidade.');
      return;
    }
    
    const novoItem: ItemVenda = {
      id: Math.random().toString(36).substr(2, 9),
      produtoId: prod.id,
      nomeProduto: prod.nome,
      quantidade: quantidadeAtual,
      precoUnitario: precoAtual
    };
    
    setItens([...itens, novoItem]);
    setProdutoSelecionadoId('');
    setQuantidadeAtual(1);
    setPrecoAtual(0);
  };

  const removerItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const finalizarVenda = async () => {
    if (!clienteSelecionado) {
      showPopup('error', 'Selecione um cliente.');
      return;
    }
    if (itens.length === 0) {
      showPopup('error', 'Adicione pelo menos um item à venda.');
      return;
    }

    setSalvando(true);
    try {
      await vendasCommands.criarVenda({
        clienteId: Number(clienteSelecionado),
        prazoPagamentoDias: prazoPagamento,
        possuiNotaFiscal: possuiNotaFiscal,
        produtos: itens.map(i => ({
          produtoId: i.produtoId,
          quantidade: i.quantidade,
          valorUnitario: i.precoUnitario
        }))
      });
      
      showPopup('success', 'Venda finalizada com sucesso!');
      setItens([]);
      setClienteSelecionado('');
      setPrazoPagamento(0);
    } catch (error: any) {
      console.error('Erro ao finalizar venda:', error);
      const mensagemErro = error.response?.data?.erro || error.response?.data?.Erro || error.response?.data?.message || error.message;
      showPopup('error', mensagemErro);
    } finally {
      setSalvando(false);
    }
  };

  useEffect(() => {
    const calcularTotais = async () => {
      if (itens.length === 0) {
        setSubtotalGeral(0);
        setValorComissaoEstimada(0);
        return;
      }
      try {
        const resultado = await vendasCommands.calcularVenda({
          produtos: itens.map(i => ({
            produtoId: i.produtoId,
            quantidade: i.quantidade,
            valorUnitario: i.precoUnitario
          }))
        });
        setSubtotalGeral(resultado.valorTotal);
        setValorComissaoEstimada(resultado.comissaoTotal);
      } catch (error) {
        console.error('Erro ao calcular totais da venda no backend:', error);
        // Fallback local em caso de falha do backend
        const subtotal = itens.reduce((acc, item) => acc + (item.quantidade * item.precoUnitario), 0);
        setSubtotalGeral(subtotal);
        const nameEstrela = (nome: string) => nome.toLowerCase().replace(/\s+/g, '').includes('bobinaestrela');
        const comissao = itens.reduce((acc, item) => {
          const percentual = nameEstrela(item.nomeProduto) ? 0.10 : 0.05;
          return acc + (item.quantidade * item.precoUnitario * percentual);
        }, 0);
        setValorComissaoEstimada(comissao);
      }
    };
    calcularTotais();
  }, [itens]);

  if (carregando) return <div className="p-8 text-slate-500 text-center animate-pulse">Carregando dados da venda...</div>;

  return (
    <>
      <Popup 
        show={popup?.show ?? false}
        type={popup?.type ?? 'error'}
        message={popup?.message ?? ''}
        onClose={() => setPopup(null)}
      />

    <div className="max-w-5xl mx-auto space-y-6">
      {/* Área 1 - Cabeçalho */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 border-b border-slate-100 pb-2">Dados da Venda</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Cliente</label>
            <select 
              className="input-field"
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Selecione um cliente...</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.razaoSocial} ({c.cnpj})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Prazo de Pagamento</label>
            <select 
              className="input-field"
              value={prazoPagamento}
              onChange={(e) => setPrazoPagamento(Number(e.target.value))}
            >
              <option value="0">À Vista</option>
              <option value="15">15 Dias</option>
              <option value="30">30 Dias</option>
              <option value="60">60 Dias</option>
            </select>
          </div>
          <div className="flex items-center pt-6">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={possuiNotaFiscal}
                onChange={(e) => setPossuiNotaFiscal(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">Emitir Nota Fiscal</span>
            </label>
          </div>
        </div>
      </div>

      {/* Área 2 - Adicionar Produtos */}
      <div className="card p-6 border-l-4 border-l-yellow-400">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Adicionar Item</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-600 mb-1">Produto</label>
            <select 
              className="input-field"
              value={produtoSelecionadoId}
              onChange={(e) => handleProdutoChange(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Selecione um produto...</option>
              {produtos.map(p => (
                <option key={p.id} value={p.id}>{p.nome} (R$ {p.precoMinimo} - R$ {p.precoMaximo})</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-slate-600 mb-1">Qtd.</label>
            <input 
              type="number" 
              className="input-field" 
              min="1" 
              value={quantidadeAtual}
              onChange={(e) => setQuantidadeAtual(Number(e.target.value))}
            />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-slate-600 mb-1">Valor Unit. (R$)</label>
            <input 
              type="number" 
              className="input-field" 
              step="0.01"
              value={precoAtual}
              onChange={(e) => setPrecoAtual(Number(e.target.value))}
            />
          </div>
          <button 
            type="button"
            onClick={adicionarItem}
            className="btn-primary flex items-center whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Área 3 - Lista de Itens */}
        <div className="lg:col-span-3">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd.</th>
                  <th>Valor Unit.</th>
                  <th>Subtotal</th>
                  <th className="w-16">Ação</th>
                </tr>
              </thead>
              <tbody>
                {itens.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">Nenhum item adicionado à venda.</td>
                  </tr>
                ) : (
                  itens.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium text-slate-800">{item.nomeProduto}</td>
                      <td className="text-slate-600">{item.quantidade}</td>
                      <td className="text-slate-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.precoUnitario)}</td>
                      <td className="font-semibold text-slate-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.quantidade * item.precoUnitario)}</td>
                      <td>
                        <button 
                          onClick={() => removerItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Área 4 - Resumo e Finalização */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-slate-100 pb-2 text-slate-800">Resumo</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-500">
                <span>Total de Itens</span>
                <span className="font-medium text-slate-800">{itens.reduce((acc, i) => acc + i.quantidade, 0)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Subtotal Geral</span>
                <span className="font-medium text-slate-800">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotalGeral)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <span className="font-medium text-yellow-600">Comissão Estimada</span>
                <span className="text-xl font-bold text-yellow-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorComissaoEstimada)}
                </span>
              </div>
            </div>

            <button 
              onClick={finalizarVenda}
              disabled={itens.length === 0 || salvando}
              className="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
            >
              {salvando ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {salvando ? 'Processando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
