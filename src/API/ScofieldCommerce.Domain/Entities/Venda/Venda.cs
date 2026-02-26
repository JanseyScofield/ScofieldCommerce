using ScofieldCommerce.Domain.Exceptions;

namespace ScofieldCommerce.Domain.Entities.Venda
{
    public class Venda
    {
        public long Id { get; private set; }
        public int ClienteId { get; private set; }
        public sbyte PrazoPagamentoDias { get; private set; }
        public bool PossuiNotaFiscal { get; private set; }
        public decimal ValorTotal { get; private set; }
        public decimal ComissaoTotal { get; private set; }
        public DateTime DataVenda { get; private set; }

        public Cliente Cliente { get; private set; } = null!;
        public IEnumerable<ProdutoVendido> ProdutosVendidos { get; set; } = null!;
        protected Venda() { }

        public Venda(int clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, decimal valorTotal, decimal comissaoTotal, DateTime dataVenda)
        {
            Validar(clienteId, prazoPagamentoDias, valorTotal, comissaoTotal, dataVenda);
            ClienteId = clienteId;
            ValorTotal = valorTotal;
            ComissaoTotal = comissaoTotal;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;
        }

        public void Atualizar(int clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, decimal valorTotal, decimal comissaoTotal, DateTime dataVenda)
        {
            Validar(clienteId, prazoPagamentoDias, valorTotal, comissaoTotal, dataVenda);
            ClienteId = clienteId;
            ValorTotal = valorTotal;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;
        }

        private void Validar(int clienteId, sbyte prazoPagamentoDias, decimal valorTotal, decimal comissaoTotal, DateTime dataVenda)
        {
            if (clienteId <= 0)
                throw new VendaException("Cliente Id deve ser maior que zero.");

            if (prazoPagamentoDias < 0)
                throw new VendaException("Prazo de pagamento em dias não pode ser negativo.");

            if (valorTotal <= 0)
                throw new VendaException("Valor total deve ser maior que zero.");

            if (comissaoTotal < 0)
                throw new VendaException("Comissão total não pode ser negativa.");

            if (dataVenda > DateTime.Now)
                throw new VendaException("Data da venda não pode ser no futuro.");
        }

        public override string ToString()
        {
            return $"Venda [Id={Id}, Cliente Id={ClienteId}, Prazo Pagamento Dias={PrazoPagamentoDias}, Possui Nota Fiscal={PossuiNotaFiscal}, Valor Total={ValorTotal}, Comissão Total={ComissaoTotal}, Data Venda={DataVenda}]";
        }

        public override bool Equals(object? obj)
        {
            if (obj is not Venda other)
                return false;

            return ClienteId == other.ClienteId &&
                   PrazoPagamentoDias == other.PrazoPagamentoDias &&
                   PossuiNotaFiscal == other.PossuiNotaFiscal &&
                   ValorTotal == other.ValorTotal &&
                   ComissaoTotal == other.ComissaoTotal;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ClienteId, PrazoPagamentoDias, PossuiNotaFiscal, ValorTotal, ComissaoTotal);
        }
    }
}