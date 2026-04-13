using ScofieldCommerce.Domain.Exceptions;

namespace ScofieldCommerce.Domain.Entities
{
    public class Produto
    {
       public long Id { get; private set; }
       public string Nome { get; private set; } = null!;
       public string Descricao { get; private set; } = null!;
       public decimal PrecoMinimo { get; private set; }
       public decimal PrecoMaximo { get; private set; }
       public byte RegraComissaoId { get; private set; }

        protected Produto() { }

        public Produto(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            Validar(nome, descricao, precoMinimo, precoMaximo, regraComissaoId);
            Nome = nome;
            Descricao = descricao;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;
            RegraComissaoId = regraComissaoId;
        }

        public void Atualizar(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            Validar(nome, descricao, precoMinimo, precoMaximo, regraComissaoId);
            Nome = nome;
            Descricao = descricao;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;
            RegraComissaoId = regraComissaoId;
        }

        private void Validar(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            if (string.IsNullOrWhiteSpace(nome))
                throw new ProdutoException("O nome do produto não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(descricao))
                throw new ProdutoException("A descrição do produto não pode ser vazia.");

            if (precoMinimo < 0)
                throw new ProdutoException("O preço mínimo do produto não pode ser negativo.");

            if (precoMaximo < 0)
                throw new ProdutoException("O preço máximo do produto não pode ser negativo.");

            if (precoMinimo > precoMaximo)
                throw new ProdutoException("O preço mínimo do produto não pode ser maior que o preço máximo.");

            if (regraComissaoId <= 0)
                throw new ProdutoException("A regra de comissão deve ser informada e maior que zero.");
        }

        public override string ToString()
        {
            return $"{Nome} - {Descricao} (Preço mínimo: {PrecoMinimo}, Preço máximo: {PrecoMaximo})";
        }

        public override bool Equals(object? obj)
        {
            if (obj is not Produto other)
                return false;

            if (ReferenceEquals(this, other))
                return true;
            
            if (Id == 0 || other.Id == 0)
                return false;

            return Id == other.Id;
        }

        public override int GetHashCode()
        {
            return Id == 0 ? base.GetHashCode() : Id.GetHashCode();
        }   
    }
}