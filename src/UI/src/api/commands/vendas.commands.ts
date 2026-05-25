import { apiClient } from '../client';

export interface ItemVendaComando {
  produtoId: number;
  quantidade: number;
  valorUnitario: number;
}

export interface ComandoCriarVenda {
  clienteId: number;
  prazoPagamentoDias: number;
  possuiNotaFiscal: boolean;
  produtos: ItemVendaComando[];
}

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
  }
};
