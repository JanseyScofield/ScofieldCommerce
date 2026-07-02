using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Domain.Entities
{
    public class Produto
    {
       public long Id { get; private set; }
       public string Nome { get; private set; } = null!;
       public decimal PrecoMinimo { get; private set; }
       public decimal PrecoMaximo { get; private set; }

        protected Produto() { }

        private Produto(string nome, decimal precoMinimo, decimal precoMaximo)
        {
            Nome = nome;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;
        }

        public static Result<Produto> Criar(string nome, decimal precoMinimo, decimal precoMaximo)
        {
            var validacao = Validar(nome, precoMinimo, precoMaximo);
            if (!validacao.IsSuccess) return Result<Produto>.Error(validacao.ErrorMessage!);

            return Result<Produto>.Ok(new Produto(nome, precoMinimo, precoMaximo));
        }

        public Result<bool> Atualizar(string nome, decimal precoMinimo, decimal precoMaximo)
        {
            var validacao = Validar(nome, precoMinimo, precoMaximo);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            Nome = nome;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(string nome, decimal precoMinimo, decimal precoMaximo)
        {
            if (string.IsNullOrWhiteSpace(nome)) return Result<bool>.Error("O nome do produto não pode ser vazio.");
            if (precoMinimo < 0) return Result<bool>.Error("O preço mínimo do produto não pode ser negativo.");
            if (precoMaximo < 0) return Result<bool>.Error("O preço máximo do produto não pode ser negativo.");
            if (precoMinimo > precoMaximo) return Result<bool>.Error("O preço mínimo do produto não pode ser maior que o preço máximo.");

            return Result<bool>.Ok(true);
        }

        public override string ToString()
        {
            return $"{Nome} (Preço mínimo: {PrecoMinimo}, Preço máximo: {PrecoMaximo})";
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