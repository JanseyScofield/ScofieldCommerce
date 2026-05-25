import { useState, useEffect } from 'react';
import { Trophy, PieChart as PieChartIcon, AlertTriangle, Loader } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { clientesQueries } from '../api/queries/clientes.queries';
import type { RankingClienteDto, ClienteInativoDto } from '../api/queries/clientes.queries';

export const RelatorioClientes = () => {
  const [diasInativos, setDiasInativos] = useState(30);

  const [topClientes, setTopClientes] = useState<RankingClienteDto[]>([]);
  const [dadosPreferenciaCompra, setDadosPreferenciaCompra] = useState<any[]>([]);
  const [clientesEmRisco, setClientesEmRisco] = useState<ClienteInativoDto[]>([]);

  const [carregandoListas, setCarregandoListas] = useState(true);
  const [carregandoInativos, setCarregandoInativos] = useState(false);

  // Carrega Dados Iniciais (Ranking e Preferência)
  useEffect(() => {
    const carregarIniciais = async () => {
      try {
        const [ranking, preferencia] = await Promise.all([
          clientesQueries.obterRankingClientes(),
          clientesQueries.obterPreferenciaCompraPorProduto()
        ]);
        setTopClientes(ranking);
        setDadosPreferenciaCompra(preferencia);
      } catch (error) {
        console.error('Erro ao carregar relatórios iniciais de clientes:', error);
      } finally {
        setCarregandoListas(false);
      }
    };
    carregarIniciais();
  }, []);

  // Carrega Clientes Inativos (Roda no início e sempre que mudar os dias)
  useEffect(() => {
    const carregarInativosFn = async () => {
      setCarregandoInativos(true);
      try {
        const inativos = await clientesQueries.obterClientesEmRisco(diasInativos);
        setClientesEmRisco(inativos);
      } catch (error) {
        console.error('Erro ao carregar clientes inativos:', error);
      } finally {
        setCarregandoInativos(false);
      }
    };
    carregarInativosFn();
  }, [diasInativos]);

  const CORES = ['#facc15', '#38bdf8', '#fb7185', '#94a3b8'];

  if (carregandoListas) return <div className="p-8 text-slate-500 text-center animate-pulse">Carregando inteligência de clientes...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Painel 1 - Top Clientes */}
      <div className="card p-6 lg:col-span-1">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mr-3">
            <Trophy className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Top Clientes</h2>
        </div>
        
        <div className="space-y-4">
          {topClientes.length === 0 ? (
            <div className="text-slate-400 py-8 text-center text-sm">Nenhum cliente no ranking no momento.</div>
          ) : (
            topClientes.map((cliente, index) => (
              <div key={cliente.razaoSocial} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 ${
                    index === 0 ? 'bg-yellow-400 text-slate-900' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    index === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-850 text-sm max-w-[150px] truncate" title={cliente.razaoSocial}>
                      {cliente.razaoSocial}
                    </p>
                    <span className="text-[10px] text-slate-500">{cliente.quantidadeVendas} vendas</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(cliente.valorTotal)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Painel 2 - Preferência de Compra */}
      <div className="card p-6 lg:col-span-2">
        <div className="flex items-center mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600 mr-3">
            <PieChartIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Preferência de Compra (Valor por Produto)</h2>
        </div>
        <div className="h-[300px] flex items-center justify-center">
          {dadosPreferenciaCompra.length === 0 ? (
            <div className="text-slate-400 text-center">Nenhum dado de compras por produto disponível.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPreferenciaCompra}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dadosPreferenciaCompra.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(valor: any) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor))}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#1e293b' }}
                  labelStyle={{ color: '#64748b' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Painel 3 - Clientes em Risco */}
      <div className="card p-6 lg:col-span-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-2 bg-red-50 rounded-lg text-red-650 mr-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Clientes em Risco</h2>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-slate-500">Mostrar inativos há mais de:</span>
            <select 
              className="input-field py-1.5 w-24"
              value={diasInativos}
              onChange={(e) => setDiasInativos(Number(e.target.value))}
            >
              <option value={15}>15 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
              <option value={90}>90 dias</option>
            </select>
          </div>
        </div>
        
        <div className="table-container">
          {carregandoInativos ? (
            <div className="flex items-center justify-center py-8 text-slate-500 gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Verificando inatividade...</span>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Última Compra</th>
                  <th>Dias Inativo</th>
                  <th>Ação Recomendada</th>
                </tr>
              </thead>
              <tbody>
                {clientesEmRisco.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400">Nenhum cliente inativo encontrado para este período.</td>
                  </tr>
                ) : (
                  clientesEmRisco.map((cliente) => (
                    <tr key={cliente.razaoSocial}>
                      <td className="font-semibold text-slate-800">{cliente.razaoSocial}</td>
                      <td className="text-slate-600">
                        {cliente.ultimaCompra 
                          ? new Date(cliente.ultimaCompra).toLocaleDateString('pt-BR') 
                          : 'Nunca comprou'}
                      </td>
                      <td>
                        <span className="flex items-center text-red-600 font-semibold">
                          {cliente.diasInativo} dias
                        </span>
                      </td>
                      <td>
                        <a 
                          href={`tel:${cliente.razaoSocial}`} 
                          onClick={(e) => { e.preventDefault(); alert(`Entrando em contato com ${cliente.razaoSocial}...`); }}
                          className="btn-secondary py-1.5 px-4 text-xs font-bold hover:text-yellow-600 transition-colors inline-block"
                        >
                          Entrar em Contato
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
