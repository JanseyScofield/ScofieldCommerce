using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Endereco
    {
        public string Logradouro { get; private set; } = null!;
        public string Numero { get; private set; } = null!;
        public string Complemento { get; private set; } = null!;
        public string Bairro { get; private set; } = null!;
        public string Cidade { get; private set; } = null!;
        public string Estado { get; private set; } = null!;
        public Cep CEP { get; private set; } = null!;

        protected Endereco() { }

        private Endereco(string logradouro, string numero, string complemento, string bairro, string cidade, string estado, Cep cep)
        {
            Logradouro = logradouro;
            Numero = numero;
            Complemento = complemento;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            CEP = cep;
        }

        public static Result<Endereco> Criar(string logradouro, string numero, string complemento, string bairro, string cidade, string estado, Cep cep)
        {
            var validacao = Validar(logradouro, numero, complemento, bairro, cidade, estado);
            if (!validacao.IsSuccess) return Result<Endereco>.Error(validacao.ErrorMessage!);

            return Result<Endereco>.Ok(new Endereco(logradouro, numero, complemento, bairro, cidade, estado, cep));
        }

        public Result<bool> Atualizar(string logradouro, string numero, string complemento, string bairro, string cidade, string estado, Cep cep)
        {
            var validacao = Validar(logradouro, numero, complemento, bairro, cidade, estado);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            Logradouro = logradouro;
            Numero = numero;
            Complemento = complemento;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            CEP = cep;

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(string logradouro, string numero, string complemento, string bairro, string cidade, string estado)
        {
            if (string.IsNullOrWhiteSpace(logradouro)) return Result<bool>.Error("O logradouro não pode ser vazio.");
            if (string.IsNullOrWhiteSpace(numero)) return Result<bool>.Error("O número não pode ser vazio.");
            if (string.IsNullOrWhiteSpace(bairro)) return Result<bool>.Error("O bairro não pode ser vazio.");
            if (string.IsNullOrWhiteSpace(cidade)) return Result<bool>.Error("A cidade não pode ser vazia.");
            if (string.IsNullOrWhiteSpace(estado)) return Result<bool>.Error("O estado não pode ser vazio.");

            return Result<bool>.Ok(true);
        }

        public override string ToString()
        {
            return $"{Logradouro}, {Numero} - {Bairro}, {Cidade} - {Estado}, CEP: {CEP}";
        }

        public override bool Equals(object? obj)
        {
            if (obj is Endereco other)
                return Logradouro == other.Logradouro &&
                       Numero == other.Numero &&
                       Complemento == other.Complemento &&
                       Bairro == other.Bairro &&
                       Cidade == other.Cidade &&
                       Estado == other.Estado &&
                       CEP.Equals(other.CEP);

            return false;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(Logradouro, Numero, Complemento, Bairro, Cidade, Estado, CEP);
        }
    }
}