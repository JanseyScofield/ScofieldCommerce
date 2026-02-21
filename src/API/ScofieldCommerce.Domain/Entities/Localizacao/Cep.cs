using ScofieldCommerce.Domain.Entities.Exceptions;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Cep
    {
        public string Valor { get; private set; } = null!;

        protected Cep() { }

        public Cep(string valor)
        {
            Validar(valor);
            Valor = valor;
        }

        public void Atualizar(string novoValor)
        {
            Validar(novoValor);
            Valor = novoValor;
        }

        private void Validar(string valor)
        {
            string mensagemErro = "O CEP é inválido.";
            if (string.IsNullOrWhiteSpace(valor))
                throw new LocalizacaoException(mensagemErro);

            if (valor.Length != 8)
                throw new LocalizacaoException(mensagemErro);

            if (!valor.All(char.IsDigit))
                    throw new LocalizacaoException(mensagemErro);
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