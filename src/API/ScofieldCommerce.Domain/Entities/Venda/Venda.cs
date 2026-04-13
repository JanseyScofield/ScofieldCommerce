using ScofieldCommerce.Domain.Exceptions;
using ScofieldCommerce.Domain.Strategies;

namespace ScofieldCommerce.Domain.Entities.Venda
{
    public class Venda
    {
        public long Id { get; private set; }
        public long ClienteId { get; private set; }
        public sbyte PrazoPagamentoDias { get; private set; }
        public bool PossuiNotaFiscal { get; private set; }
        public decimal ValorTotal { get; private set; }
        public decimal ComissaoTotal { get; private set; }
        public DateTime DataVenda { get; private set; }

        public Cliente Cliente { get; private set; } = null!;
        
        private readonly List<ProdutoVendido> _produtosVendidos = new();
        public IReadOnlyCollection<ProdutoVendido> ProdutosVendidos => _produtosVendidos.AsReadOnly();
        protected Venda() { }

        public Venda(long clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, DateTime dataVenda)
        {
            Validar(clienteId, prazoPagamentoDias, dataVenda);
            ClienteId = clienteId;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;
        }

        public void Atualizar(long clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, DateTime dataVenda)
        {
            Validar(clienteId, prazoPagamentoDias, dataVenda);
            ClienteId = clienteId;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;
        }

        public void AdicionarProduto(Produto produto, int quantidade, decimal valorUnitario, ICommissionStrategy strategy)
        {
            var produtoVendido = new ProdutoVendido(Id, produto, quantidade, valorUnitario);
            _produtosVendidos.Add(produtoVendido);
            
            ValorTotal += valorUnitario * quantidade;
            ComissaoTotal += strategy.CalcularComissao(valorUnitario, quantidade);
        }

        private void Validar(long clienteId, sbyte prazoPagamentoDias, DateTime dataVenda)
        {
            if (clienteId <= 0)
                throw new VendaException("Cliente Id deve ser maior que zero.");

            if (prazoPagamentoDias < 0)
                throw new VendaException("Prazo de pagamento em dias não pode ser negativo.");

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
                   ComissaoTotal == other.ComissaoTotal &&
                   DataVenda == other.DataVenda;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ClienteId, PrazoPagamentoDias, PossuiNotaFiscal, ValorTotal, ComissaoTotal, DataVenda);
        }
    }
}