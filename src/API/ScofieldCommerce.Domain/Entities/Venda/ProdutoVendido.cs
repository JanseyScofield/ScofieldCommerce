using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Domain.Entities.Venda
{
    public class ProdutoVendido
    {
        public long Id { get; set; }
        public long VendaId { get; private set; } 
        public long ProdutoId { get; private set; }
        public int Quantidade { get; private set; }
        public decimal ValorUnitario { get; private set; }

        public Venda Venda { get; private set; } = null!;
        public Produto Produto { get; private set; } = null!;

        protected ProdutoVendido() { }

        private ProdutoVendido(long vendaId, Produto produto, int quantidade, decimal valorUnitario)
        {
            VendaId = vendaId;
            ProdutoId = produto.Id;
            Quantidade = quantidade;
            ValorUnitario = valorUnitario;
        }

        public static Result<ProdutoVendido> Criar(long vendaId, Produto produto, int quantidade, decimal valorUnitario)
        {
            var validacao = Validar(produto, quantidade, valorUnitario);
            if (!validacao.IsSuccess) return Result<ProdutoVendido>.Error(validacao.ErrorMessage!);

            return Result<ProdutoVendido>.Ok(new ProdutoVendido(vendaId, produto, quantidade, valorUnitario));
        }

        public Result<bool> Atualizar(Produto produto, int quantidade, decimal valorUnitario)
        {
            var validacao = Validar(produto, quantidade, valorUnitario);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            ProdutoId = produto.Id;
            Quantidade = quantidade;
            ValorUnitario = valorUnitario;

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(Produto produto, int quantidade, decimal valorUnitario)
        {
            if (produto.Id <= 0) return Result<bool>.Error("Produto Id deve ser maior que zero.");
            if (quantidade <= 0) return Result<bool>.Error("Quantidade deve ser maior que zero.");
            if (valorUnitario <= 0) return Result<bool>.Error("Valor unitario deve ser maior que zero.");
            if (valorUnitario < produto.PrecoMinimo) return Result<bool>.Error("Valor unitario não pode ser menor que o preço mínimo do produto.");
            if (valorUnitario > produto.PrecoMaximo) return Result<bool>.Error("Valor unitario não pode ser maior que o preço máximo do produto.");

            return Result<bool>.Ok(true);
        }

        public override string ToString()
        {
            return $"ProdutoVendido [Id={Id}, Venda Id={VendaId}, Produto Id={ProdutoId}, Quantidade={Quantidade}, Valor Unitario={ValorUnitario}]";
        }

        public override bool Equals(object? obj)
        {
            if (obj is ProdutoVendido other)
            {
                return VendaId == other.VendaId &&
                       ProdutoId == other.ProdutoId &&
                       Quantidade == other.Quantidade &&
                       ValorUnitario == other.ValorUnitario;
            }
            return false;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Id, VendaId, ProdutoId, Quantidade, ValorUnitario);
        }
    }
}