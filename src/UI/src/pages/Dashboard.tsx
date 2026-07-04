import { useState, useEffect } from 'react';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { vendasQueries } from '../api/queries/vendas.queries';
import type { MetricasDashboard } from '../types';

export const Dashboard = () => {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [dadosDiarios, setDadosDiarios] = useState<any[]>([]);
  const [dadosMensais, setDadosMensais] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [m, diarios, mensais] = await Promise.all([
          vendasQueries.obterMetricasDashboard(),
          vendasQueries.obterEvolucaoDiariaVendas(),
          vendasQueries.obterComparativoMensal()
        ]);
        setMetricas(m);
        setDadosDiarios(diarios);
        setDadosMensais(mensais);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  if (carregando) return <div className="p-8 text-slate-500 text-center animate-pulse">Carregando dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center">
          <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600 mr-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Valor Total Vendido (Hoje)</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metricas?.totalVendas || 0)}
            </p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600 mr-4">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Qtd. Produtos Vendidos</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">{metricas?.totalProdutos || 0}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="p-4 bg-yellow-100 rounded-xl text-yellow-600 mr-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total de Comissão (Hoje)</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metricas?.totalComissao || 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Gráfico 1 - Evolução Diária */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Evolução de Vendas Diárias (Mês Atual)</h3>
          <div className="h-[300px]">
            {dadosDiarios.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">Nenhum dado diário disponível no servidor.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosDiarios} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="data" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(val) => `R$${val / 1000}k`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#1e293b' }}
                    labelStyle={{ color: '#64748b' }}
                    formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Vendas']}
                  />
                  <Line type="monotone" dataKey="valor" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico 2 - Comparativo Mensal */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6 text-slate-800">Comparativo Mensal (Ano Atual)</h3>
          <div className="h-[300px]">
            {dadosMensais.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400">Nenhum dado mensal disponível no servidor.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosMensais} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="mes" stroke="#64748b" />
                  <YAxis stroke="#64748b" tickFormatter={(val) => `R$${val / 1000}k`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#1e293b' }}
                    labelStyle={{ color: '#64748b' }}
                    cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                    formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Vendas']}
                  />
                  <Bar dataKey="valor" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
