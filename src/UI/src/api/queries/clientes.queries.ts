import { apiClient } from '../client';
import type { ClienteDto, RankingClienteDto, ClienteInativoDto } from '../../types';

export const clientesQueries = {
  obterTodos: async (): Promise<ClienteDto[]> => {
    try {
      // O endpoint /clientes GET pode ainda não estar mapeado no back-end, 
      // mas fazemos a chamada direta conforme solicitado
      const { data } = await apiClient.get<any[]>('/clientes');
      return data.map(c => ({
        id: c.id || c.Id,
        razaoSocial: c.razaoSocial || c.RazaoSocial,
        nomeFantasia: c.nomeFantasia || c.NomeFantasia,
        cnpj: typeof (c.cnpj || c.Cnpj) === 'object'
          ? ((c.cnpj?.valor || c.cnpj?.Valor || c.Cnpj?.valor || c.Cnpj?.Valor) ?? '')
          : ((c.cnpj || c.Cnpj) ?? ''),
        inscricaoEstadual: c.inscricaoEstadual || c.InscricaoEstadual || '',
        nomeComprador: c.nomeComprador || c.NomeComprador || '',
        telefoneComprador: c.telefoneComprador || c.TelefoneComprador || ''
      }));
    } catch (error) {
      console.error('Erro ao obter todos os clientes:', error);
      return [];
    }
  },

  obterRankingClientes: async (): Promise<RankingClienteDto[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/vendas/cliente');
      return data.map(r => ({
        razaoSocial: r.razaoSocial || r.RazaoSocial,
        quantidadeVendas: Number(r.quantidadeVendas || r.QuantidadeVendas || 0),
        valorTotal: Number(r.valorTotal || r.ValorTotal || 0),
        comissaoGerada: Number(r.comissaoGerada || r.ComissaoGerada || 0)
      }));
    } catch (error) {
      console.error('Erro ao obter ranking de clientes:', error);
      return [];
    }
  },

  obterPreferenciaCompraPorProduto: async () => {
    try {
      const { data } = await apiClient.get<any[]>('/relatorios/clientes/valor-comprado-produto');
      // Agrupa e soma os valores comprados de cada produto (o SQL retorna quebra por Cliente + Produto)
      const agrupado: { [nomeProduto: string]: number } = {};

      data.forEach(item => {
        const produto = item.produto || item.Produto;
        const valor = Number(item.valorComprado || item.ValorComprado || 0);
        if (produto) {
          agrupado[produto] = (agrupado[produto] || 0) + valor;
        }
      });

      return Object.entries(agrupado).map(([nome, valor]) => ({
        name: nome,
        value: valor
      }));
    } catch (error) {
      console.error('Erro ao obter preferência de compra:', error);
      return [];
    }
  },

  obterClientesEmRisco: async (dias: number): Promise<ClienteInativoDto[]> => {
    try {
      const { data } = await apiClient.get<any[]>(`/relatorios/clientes/inatividade`, {
        params: { dias }
      });
      return data.map(r => ({
        razaoSocial: r.razaoSocial || r.RazaoSocial,
        ultimaCompra: r.ultimaCompra || r.UltimaCompra || null,
        diasInativo: Number(r.diasInativo || r.DiasInativo || 0),
        nomeComprador: r.nomeComprador || r.NomeComprador || '',
        telefoneComprador: r.telefoneComprador || r.TelefoneComprador || ''
      }));
    } catch (error) {
      console.error('Erro ao obter clientes em risco:', error);
      return [];
    }
  }
};
