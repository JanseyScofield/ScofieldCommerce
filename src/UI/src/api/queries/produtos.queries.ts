import { apiClient } from '../client';

export interface ProdutoDto {
  id: number;
  nome: string;
  descricao: string;
  precoMinimo: number;
  precoMaximo: number;
}

export const produtosQueries = {
  obterTodos: async (): Promise<ProdutoDto[]> => {
    try {
      const { data } = await apiClient.get<any[]>('/produtos');
      return data.map(p => ({
        id: p.id || p.Id,
        nome: p.nome || p.Nome,
        descricao: p.descricao || p.Descricao,
        precoMinimo: Number(p.precoMinimo || p.PrecoMinimo || 0),
        precoMaximo: Number(p.precoMaximo || p.PrecoMaximo || 0)
      }));
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
      return [];
    }
  }
};
