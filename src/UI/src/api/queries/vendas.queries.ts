import { apiClient } from '../client';
import type { MetricasDashboard, VendaHistorico } from '../../types';

export const vendasQueries = {
  obterMetricasDashboard: async (): Promise<MetricasDashboard> => {
    let totalVendas = 0;
    let totalProdutos = 0;
    let totalComissao = 0;
    let comissaoRecebida = 0;
    let comissaoPendente = 0;

    try {
      const [resDia, resComissoes] = await Promise.allSettled([
        apiClient.get<any[]>('/relatorios/vendas/dia'),
        apiClient.get<any>('/vendas/comissoes/resumo')
      ]);

      const now = new Date();
      const hojeAno = now.getFullYear();
      const hojeMes = String(now.getMonth() + 1).padStart(2, '0');
      const hojeDia = String(now.getDate()).padStart(2, '0');
      const hojeStr = `${hojeAno}-${hojeMes}-${hojeDia}`;

      if (resDia.status === 'fulfilled' && Array.isArray(resDia.value.data)) {
        const registroHoje = resDia.value.data.find((d: any) => {
          const diaVal = String(d.dia || d.Dia || '').slice(0, 10);
          return diaVal === hojeStr;
        });

        if (registroHoje) {
          totalVendas = Number(registroHoje.valorVendido || registroHoje.ValorVendido || 0);
          totalProdutos = Number(registroHoje.quantidadeProdutos || registroHoje.QuantidadeProdutos || 0);
          totalComissao = Number(registroHoje.comissao || registroHoje.Comissao || 0);
          comissaoRecebida = Number(registroHoje.comissaoRecebida ?? registroHoje.ComissaoRecebida ?? 0);
          comissaoPendente = Number(registroHoje.comissaoPendente ?? registroHoje.ComissaoPendente ?? 0);
        }
      }

      if (resComissoes.status === 'fulfilled' && resComissoes.value.data) {
        const c = resComissoes.value.data;
        if (c.comissaoRecebida !== undefined || c.ComissaoRecebida !== undefined) {
          comissaoRecebida = Number(c.comissaoRecebida || c.ComissaoRecebida || 0);
        }
        if (c.comissaoPendente !== undefined || c.ComissaoPendente !== undefined) {
          comissaoPendente = Number(c.comissaoPendente || c.ComissaoPendente || 0);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
    }

    return {
      totalVendas,
      totalProdutos,
      totalComissao,
      comissaoRecebida,
      comissaoPendente
    };
  },

  obterResumoComissoes: async () => {
    try {
      const { data } = await apiClient.get<any>('/vendas/comissoes/resumo');
      return {
        comissaoRecebida: Number(data.comissaoRecebida || data.ComissaoRecebida || 0),
        comissaoPendente: Number(data.comissaoPendente || data.ComissaoPendente || 0),
        totalComissao: Number(data.totalComissao || data.TotalComissao || 0)
      };
    } catch (error) {
      console.error('Erro ao obter resumo de comissões:', error);
      return { comissaoRecebida: 0, comissaoPendente: 0, totalComissao: 0 };
    }
  },

  obterEvolucaoDiariaVendas: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/dia');
      const mapPorDia = new Map<string, number>();

      if (Array.isArray(data)) {
        data.forEach((d: any) => {
          const diaVal = d.dia || d.Dia;
          if (diaVal) {
            const diaKey = String(diaVal).slice(0, 10);
            mapPorDia.set(diaKey, Number(d.valorVendido || d.ValorVendido || 0));
          }
        });
      }

      const now = new Date();
      const hojeAno = now.getFullYear();
      const hojeMes = String(now.getMonth() + 1).padStart(2, '0');
      const hojeDia = String(now.getDate()).padStart(2, '0');
      const hojeKey = `${hojeAno}-${hojeMes}-${hojeDia}`;

      if (!mapPorDia.has(hojeKey)) {
        mapPorDia.set(hojeKey, 0);
      }

      const chavesOrdenadas = Array.from(mapPorDia.keys()).sort();
      return chavesOrdenadas.map(k => {
        const partes = k.split('-');
        const diaFormatado = partes.length === 3 ? `${partes[2]}/${partes[1]}` : k;
        return {
          data: diaFormatado,
          valor: mapPorDia.get(k) || 0
        };
      });
    } catch (error) {
      console.error('Erro ao obter evolução diária:', error);
      return [];
    }
  },

  obterComparativoMensal: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/mes');
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mapPorMes = new Map<number, number>();

      if (Array.isArray(data)) {
        data.forEach((d: any) => {
          const mesVal = Number(d.mes || d.Mes || 0);
          if (mesVal >= 1 && mesVal <= 12) {
            mapPorMes.set(mesVal, Number(d.valorVendido || d.ValorVendido || 0));
          }
        });
      }

      if (mapPorMes.size === 0) {
        const mesAtual = new Date().getMonth() + 1;
        return [{ mes: meses[mesAtual - 1], valor: 0 }];
      }

      const mesesOrdenados = Array.from(mapPorMes.keys()).sort((a, b) => a - b);
      return mesesOrdenados.map(m => ({
        mes: meses[m - 1],
        valor: mapPorMes.get(m) || 0
      }));
    } catch (error) {
      console.error('Erro ao obter comparativo mensal:', error);
      return [];
    }
  },

  obterHistoricoVendas: async (produtoId?: string, dataFiltro?: string, clienteId?: string, comissaoRecebida?: boolean): Promise<VendaHistorico[]> => {
    try {
      const params: Record<string, any> = {};
      if (produtoId) params.produtoId = produtoId;
      if (dataFiltro) params.data = dataFiltro;
      if (clienteId) params.clienteId = clienteId;
      if (comissaoRecebida !== undefined) params.comissaoRecebida = comissaoRecebida;

      const { data } = await apiClient.get<any[]>('/vendas', { params });
      
      return data.map((v: any) => {
        const itens = (v.itens || v.Itens || []).map((i: any) => ({
          nome: i.nome || i.Nome || i.produtoNome || i.ProdutoNome || 'Produto',
          quantidade: Number(i.quantidade || i.Quantidade || 0)
        }));
        const quantidadeTotal = Number(v.quantidadeTotal || v.QuantidadeTotal || itens.reduce((acc: number, curr: any) => acc + curr.quantidade, 0));

        return {
          id: v.id || v.Id,
          dataVenda: v.dataVenda || v.DataVenda,
          valorTotal: Number(v.valorTotal || v.ValorTotal || 0),
          comissaoTotal: Number(v.comissaoTotal || v.ComissaoTotal || 0),
          comissaoRecebida: Boolean(v.comissaoRecebida ?? v.ComissaoRecebida ?? false),
          prazoPagamentoDias: Number(v.prazoPagamentoDias || v.PrazoPagamentoDias || 0),
          possuiNotaFiscal: Boolean(v.possuiNotaFiscal ?? v.PossuiNotaFiscal),
          razaoSocial: v.razaoSocial || v.RazaoSocial || 'Cliente não identificado',
          quantidadeTotal,
          itens
        };
      });
    } catch (error) {
      console.error('Erro ao buscar histórico de vendas:', error);
      return [];
    }
  }
};
