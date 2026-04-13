using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Cep
    {
        public string Valor { get; private set; } = null!;

        protected Cep() { }

        private Cep(string valor)
        {
            Valor = valor;
        }

        public static Result<Cep> Criar(string valor)
        {
            var validacao = Validar(valor);
            if (!validacao.IsSuccess) return Result<Cep>.Error(validacao.ErrorMessage!);

            return Result<Cep>.Ok(new Cep(valor));
        }

        public Result<bool> Atualizar(string novoValor)
        {
            var validacao = Validar(novoValor);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            Valor = novoValor;
            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(string valor)
        {
            string mensagemErro = "O CEP é inválido.";
            if (string.IsNullOrWhiteSpace(valor) || valor.Length != 8 || !valor.All(char.IsDigit))
                return Result<bool>.Error(mensagemErro);

            return Result<bool>.Ok(true);
        }

        public override string ToString()
        {
            return Valor;
        }

        public override bool Equals(object? obj)
        {
            if (obj is Cep other)
                return Valor == other.Valor;

            return false;
        }

        public override int GetHashCode()
        {
            return Valor.GetHashCode();
        }
    }
}