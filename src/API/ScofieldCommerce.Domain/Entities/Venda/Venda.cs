using ScofieldCommerce.Domain.Common;
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

        private Venda(long clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, DateTime dataVenda)
        {
            ClienteId = clienteId;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;
        }

        public static Result<Venda> Criar(long clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, DateTime dataVenda)
        {
            var validacao = Validar(clienteId, prazoPagamentoDias, dataVenda);
            if (!validacao.IsSuccess) return Result<Venda>.Error(validacao.ErrorMessage!);

            return Result<Venda>.Ok(new Venda(clienteId, prazoPagamentoDias, possuiNotaFiscal, dataVenda));
        }

        public Result<bool> Atualizar(long clienteId, sbyte prazoPagamentoDias, bool possuiNotaFiscal, DateTime dataVenda)
        {
            var validacao = Validar(clienteId, prazoPagamentoDias, dataVenda);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            ClienteId = clienteId;
            PrazoPagamentoDias = prazoPagamentoDias;
            PossuiNotaFiscal = possuiNotaFiscal;
            DataVenda = dataVenda;

            return Result<bool>.Ok(true);
        }

        public Result<bool> AdicionarProduto(Produto produto, int quantidade, decimal valorUnitario, ICommissionStrategy strategy)
        {
            var produtoVendidoResult = ProdutoVendido.Criar(Id, produto, quantidade, valorUnitario);
            if (!produtoVendidoResult.IsSuccess)
                return Result<bool>.Error(produtoVendidoResult.ErrorMessage!);

            _produtosVendidos.Add(produtoVendidoResult.Data!);
            
            ValorTotal += valorUnitario * quantidade;
            ComissaoTotal += strategy.CalcularComissao(valorUnitario, quantidade);

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(long clienteId, sbyte prazoPagamentoDias, DateTime dataVenda)
        {
            if (clienteId <= 0) return Result<bool>.Error("Cliente Id deve ser maior que zero.");
            if (prazoPagamentoDias < 0) return Result<bool>.Error("Prazo de pagamento em dias não pode ser negativo.");
            if (dataVenda > DateTime.Now) return Result<bool>.Error("Data da venda não pode ser no futuro.");

            return Result<bool>.Ok(true);
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