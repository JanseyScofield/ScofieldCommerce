import { apiClient } from '../client';
import type { MetricasDashboard, VendaHistorico } from '../../types';

export const vendasQueries = {
  obterMetricasDashboard: async (): Promise<MetricasDashboard> => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/dia');
      if (data && data.length > 0) {
        // Pega o dia mais recente (o SQL ordena por Dia DESC)
        const maisRecente = data[0];
        return {
          totalVendas: Number(maisRecente.valorVendido || 0),
          totalProdutos: Number(maisRecente.quantidadeProdutos || 0),
          totalComissao: Number(maisRecente.comissao || 0),
        };
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
    }
    
    return {
      totalVendas: 0,
      totalProdutos: 0,
      totalComissao: 0
    };
  },
  
  obterEvolucaoDiariaVendas: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/dia');
      // Mapeia e inverte para ordem cronológica (esquerda para a direita no gráfico)
      return data.map(d => ({
        data: d.dia ? new Date(d.dia).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '',
        valor: Number(d.valorVendido || 0)
      })).reverse();
    } catch (error) {
      console.error('Erro ao obter evolução diária:', error);
      return [];
    }
  },

  obterComparativoMensal: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/mes');
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return data.map(d => ({
        mes: meses[(d.mes || 1) - 1],
        valor: Number(d.valorVendido || 0)
      })).reverse();
    } catch (error) {
      console.error('Erro ao obter comparativo mensal:', error);
      return [];
    }
  },

  obterHistoricoVendas: async (produtoId?: string, dataFiltro?: string, clienteId?: string): Promise<VendaHistorico[]> => {
    try {
      const params: any = {};
      if (produtoId) params.produtoId = Number(produtoId);
      if (dataFiltro) params.data = dataFiltro;
      if (clienteId) params.clienteId = Number(clienteId);

      const { data } = await apiClient.get<any[]>('/vendas', { params });
      return data.map(v => ({
        id: Number(v.id || v.Id),
        dataVenda: v.dataVenda || v.DataVenda,
        valorTotal: Number(v.valorTotal || v.ValorTotal || 0),
        comissaoTotal: Number(v.comissaoTotal || v.ComissaoTotal || 0),
        prazoPagamentoDias: Number(v.prazoPagamentoDias || v.PrazoPagamentoDias || 0),
        possuiNotaFiscal: Boolean(v.possuiNotaFiscal ?? v.PossuiNotaFiscal ?? false),
        razaoSocial: v.razaoSocial || v.RazaoSocial || 'Cliente Desconhecido',
        quantidadeTotal: Number(v.quantidadeTotal || v.QuantidadeTotal || 0),
        itens: (v.itens || v.Itens || []).map((i: any) => ({
          nome: i.nome || i.Nome,
          quantidade: Number(i.quantidade || i.Quantidade || 0)
        }))
      }));
    } catch (error) {
      console.error('Erro ao obter histórico de vendas:', error);
      return [];
    }
  }
};
