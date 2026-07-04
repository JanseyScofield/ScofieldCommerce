import { apiClient } from '../client';
import type { ComandoCriarProduto } from '../../types';

export const produtosCommands = {
  criarProduto: async (comando: ComandoCriarProduto) => {
    const payload = {
      nome: comando.nome,
      precoMinimo: comando.precoMinimo,
      precoMaximo: comando.precoMaximo
    };
    const { data } = await apiClient.post('/produtos', payload);
    return data;
  }
};
