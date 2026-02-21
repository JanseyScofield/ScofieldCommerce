using ScofieldCommerce.Domain.Exceptions;

namespace ScofieldCommerce.Domain.Entities
{
    public class PrecoClienteProduto
    {
        public long Id { get; private set; }
        public long ClienteId { get; private set; }
        public long ProdutoId { get; private set; }
        public decimal Preco { get; private set; }

        public Cliente Cliente { get; set; } = null!;
        public Produto Produto { get; set; } = null!;

        protected PrecoClienteProduto() { }

        public PrecoClienteProduto(long clienteId, Produto produto, decimal preco)
        {
            Validar(clienteId, produto, preco);
            ClienteId = clienteId;
            ProdutoId = produto.Id;
            Preco = preco;
        }

        public void AtualizarPreco(Produto produto, decimal novoPreco)
        {
            ValidarRegrasDePreco(produto, novoPreco);
            Preco = novoPreco;
        }

        private void Validar(long clienteId, Produto produto, decimal preco)
        {
            if (clienteId <= 0)
                throw new PrecoClienteProdutoException("O ID do cliente é inválido.");

            if (produto.Id <= 0)
                throw new PrecoClienteProdutoException("O ID do produto é inválido.");

            ValidarRegrasDePreco(produto, preco);
        }

        private void ValidarRegrasDePreco(Produto produto, decimal preco)
        {
            if (preco <= 0)
                throw new PrecoClienteProdutoException("O preço customizado deve ser maior que zero.");

            if (preco < produto.PrecoMinimo)
                throw new PrecoClienteProdutoException($"O preço para esse cliente não pode ser menor que o preço mínimo do produto.");

            if (preco > produto.PrecoMaximo)
                throw new PrecoClienteProdutoException($"O preço para esse cliente não pode ser maior que o preço máximo do produto.");        
        }

        public override string ToString()
        {
            return $"ClienteId: {ClienteId}, ProdutoId: {ProdutoId}, Preço: {Preco:C}";
        }

        public override bool Equals(object? obj)
        {
            if (obj is not PrecoClienteProduto other)
            {
                return false;
            }
            return ClienteId == other.ClienteId && ProdutoId == other.ProdutoId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(ClienteId, ProdutoId);
        }   
    }
}