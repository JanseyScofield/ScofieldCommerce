import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: string | boolean;
}

export const cepQueries = {
  buscar: async (cep: string): Promise<ViaCepResponse | null> => {
    try {
      const { data } = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);
      if (data && !data.erro) {
        return data;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    }
  }
};
