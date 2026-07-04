import { apiClient } from '../client';
import type { ProdutoDto } from '../../types';

export const produtosQueries = {
  obterTodos: async (): Promise<ProdutoDto[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/produtos');
      return data.map(p => ({
        id: p.id || p.Id,
        nome: p.nome || p.Nome,
        precoMinimo: Number(p.precoMinimo || p.PrecoMinimo || 0),
        precoMaximo: Number(p.precoMaximo || p.PrecoMaximo || 0)
      }));
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return [];
    }
  }
};
