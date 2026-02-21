using ScofieldCommerce.Domain.Entities.Exceptions;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Cep
    {
        public string Valor { get; private set; }  

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
    }
}