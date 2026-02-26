using ScofieldCommerce.Domain.Exceptions;

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

        public ProdutoVendido(long vendaId, Produto produto, int quantidade, decimal valorUnitario)
        {
            Validar(vendaId, produto, quantidade, valorUnitario);
            VendaId = vendaId;
            ProdutoId = produto.Id;
            Quantidade = quantidade;
            ValorUnitario = valorUnitario;
        }

        public void Atualizar(Produto produto, int quantidade, decimal valorUnitario)
        {
            Validar(VendaId, produto, quantidade, valorUnitario);
            ProdutoId = produto.Id;
            Quantidade = quantidade;
            ValorUnitario = valorUnitario;
        }

        private void Validar(long vendaId, Produto produto, int quantidade, decimal valorUnitario)
        {
            if (vendaId <= 0)
                throw new VendaException("Venda Id deve ser maior que zero.");

            if (produto.Id <= 0)
                throw new VendaException("Produto Id deve ser maior que zero.");

            if (quantidade <= 0)
                throw new VendaException("Quantidade deve ser maior que zero.");

            if (valorUnitario <= 0)
                throw new VendaException("Valor unitario deve ser maior que zero.");
            
            if(valorUnitario < produto.PrecoMinimo)
                throw new VendaException("Valor unitario não pode ser menor que o preço mínimo do produto.");

            if(valorUnitario > produto.PrecoMaximo)
                throw new VendaException("Valor unitario não pode ser maior que o preço máximo do produto.");
        }

        public override string ToString()
        {
            return $"ProdutoVendido [Id={Id}, Venda Id={VendaId}, Produto Id={ProdutoId}, Quantidade={Quantidade}, Valor Unitario={ValorUnitario}]";
        }

        public override bool Equals(object? obj)
        {
            if (obj is ProdutoVendido other)
            {
                return Id == other.Id &&
                       VendaId == other.VendaId &&
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