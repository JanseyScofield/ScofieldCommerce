using ScofieldCommerce.Domain.Entities.Exceptions;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Cep
    {
        public string Valor { get; set; }  

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
                        if (string.IsNullOrWhiteSpace(valor))
                throw new LocalizacaoException("O CEP não pode ser vazio.");

            if (!System.Text.RegularExpressions.Regex.IsMatch(valor, @"^\d{5}-\d{3}$"))
                throw new LocalizacaoException("O CEP deve estar no formato 00000-000.");

        }
    }
}