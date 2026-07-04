// --- DTOs and Queries Types ---

export interface ClienteDto {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string | null;
  nomeComprador: string;
  telefoneComprador: string;
}

export interface RankingClienteDto {
  razaoSocial: string;
  quantidadeVendas: number;
  valorTotal: number;
  comissaoGerada: number;
}

export interface ClienteInativoDto {
  razaoSocial: string;
  ultimaCompra: string | null;
  diasInativo: number;
}

export interface ProdutoDto {
  id: number;
  nome: string;
  precoMinimo: number;
  precoMaximo: number;
}

export interface MetricasDashboard {
  totalVendas: number;
  totalProdutos: number;
  totalComissao: number;
}

// --- View / Page Specific Types ---

export interface VendaHistorico {
  id: number;
  dataVenda: string;
  valorTotal: number;
  comissaoTotal: number;
  prazoPagamentoDias: number;
  possuiNotaFiscal: boolean;
  razaoSocial: string;
  quantidadeTotal: number;
  itens: { nome: string; quantidade: number }[];
}

export interface ItemVenda {
  id: string;
  produtoId: number;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
}

// --- Commands / Payloads ---

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
  inscricaoEstadual?: string;
  nomeComprador: string;
  telefoneComprador: string;
}

export interface ComandoCriarProduto {
  nome: string;
  precoMinimo: number;
  precoMaximo: number;
}
