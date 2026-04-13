using ScofieldCommerce.Domain.Common;

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

        private Produto(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            Nome = nome;
            Descricao = descricao;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;
            RegraComissaoId = regraComissaoId;
        }

        public static Result<Produto> Criar(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            var validacao = Validar(nome, descricao, precoMinimo, precoMaximo, regraComissaoId);
            if (!validacao.IsSuccess) return Result<Produto>.Error(validacao.ErrorMessage!);

            return Result<Produto>.Ok(new Produto(nome, descricao, precoMinimo, precoMaximo, regraComissaoId));
        }

        public Result<bool> Atualizar(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            var validacao = Validar(nome, descricao, precoMinimo, precoMaximo, regraComissaoId);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            Nome = nome;
            Descricao = descricao;
            PrecoMinimo = precoMinimo;
            PrecoMaximo = precoMaximo;
            RegraComissaoId = regraComissaoId;

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(string nome, string descricao, decimal precoMinimo, decimal precoMaximo, byte regraComissaoId)
        {
            if (string.IsNullOrWhiteSpace(nome)) return Result<bool>.Error("O nome do produto não pode ser vazio.");
            if (string.IsNullOrWhiteSpace(descricao)) return Result<bool>.Error("A descrição do produto não pode ser vazia.");
            if (precoMinimo < 0) return Result<bool>.Error("O preço mínimo do produto não pode ser negativo.");
            if (precoMaximo < 0) return Result<bool>.Error("O preço máximo do produto não pode ser negativo.");
            if (precoMinimo > precoMaximo) return Result<bool>.Error("O preço mínimo do produto não pode ser maior que o preço máximo.");
            if (regraComissaoId <= 0) return Result<bool>.Error("A regra de comissão deve ser informada e maior que zero.");

            return Result<bool>.Ok(true);
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