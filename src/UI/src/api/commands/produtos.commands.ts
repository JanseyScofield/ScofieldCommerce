import { apiClient } from '../client';

export interface ComandoCriarProduto {
  nome: string;
  descricao: string;
  precoMinimo: number;
  precoMaximo: number;
  regraComissaoId: number;
}

export const produtosCommands = {
  criarProduto: async (comando: ComandoCriarProduto) => {
    const payload = {
      nome: comando.nome,
      descricao: comando.descricao,
      precoMinimo: comando.precoMinimo,
      precoMaximo: comando.precoMaximo,
      regraComissaoId: comando.regraComissaoId
    };
    const { data } = await apiClient.post('/produtos', payload);
    return data;
  }
};
