import { apiClient } from '../client';
import type { ItemVendaComando, ComandoCriarVenda } from '../../types';

export const vendasCommands = {
  criarVenda: async (comando: ComandoCriarVenda) => {
    // Mapeia para corresponder exatamente à estrutura do RegistrarVendaDto do back-end (PascalCase no JSON ou camelCase de acordo com serializer padrão)
    const payload = {
      clienteId: comando.clienteId,
      prazoPagamentoDias: comando.prazoPagamentoDias,
      possuiNotaFiscal: comando.possuiNotaFiscal,
      produtos: comando.produtos.map(p => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
        valorUnitario: p.valorUnitario
      }))
    };
    
    const { data } = await apiClient.post('/vendas', payload);
    return data;
  },

  calcularVenda: async (comando: { produtos: ItemVendaComando[] }): Promise<{ valorTotal: number; comissaoTotal: number }> => {
    const payload = {
      produtos: comando.produtos.map(p => ({
        produtoId: p.produtoId,
        quantidade: p.quantidade,
        valorUnitario: p.valorUnitario
      }))
    };
    
    const { data } = await apiClient.post('/vendas/calcular', payload);
    return {
      valorTotal: data.valorTotal ?? data.ValorTotal ?? 0,
      comissaoTotal: data.comissaoTotal ?? data.ComissaoTotal ?? 0
    };
  }
};
