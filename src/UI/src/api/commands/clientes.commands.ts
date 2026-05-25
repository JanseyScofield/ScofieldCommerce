import { apiClient } from '../client';

export interface ComandoCriarCliente {
  razaoSocial: string;
  nomeFantasia: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cnpj: string;
  inscricaoEstadual: string;
  nomeComprador: string;
  telefoneComprador: string;
}

export const clientesCommands = {
  criarCliente: async (comando: ComandoCriarCliente) => {
    const payload = {
      razaoSocial: comando.razaoSocial,
      nomeFantasia: comando.nomeFantasia,
      cep: comando.cep,
      logradouro: comando.logradouro,
      numero: comando.numero,
      complemento: comando.complemento,
      bairro: comando.bairro,
      cidade: comando.cidade,
      estado: comando.estado,
      cnpj: comando.cnpj,
      inscricaoEstadual: comando.inscricaoEstadual,
      nomeComprador: comando.nomeComprador,
      telefoneComprador: comando.telefoneComprador
    };
    const { data } = await apiClient.post('/clientes', payload);
    return data;
  }
};
