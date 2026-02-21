using ScofieldCommerce.Domain.Entities.Exceptions;

namespace ScofieldCommerce.Domain.Entities.Localizacao
{
    public class Endereco
    {
        public string Logradouro { get; set; }
        public string Numero { get; set; }
        public string Complemento { get; set; }
        public string Bairro { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public Cep CEP { get; set; }

        public Endereco(string logradouro, string numero, string complemento, string bairro, string cidade, string estado, Cep cep)
        {
            Validar(logradouro, numero, complemento, bairro, cidade, estado);
            Logradouro = logradouro;
            Numero = numero;
            Complemento = complemento;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            CEP = cep;
        }

        public void Atualizar(string logradouro, string numero, string complemento, string bairro, string cidade, string estado, Cep cep)
        {
            Validar(logradouro, numero, complemento, bairro, cidade, estado);
            Logradouro = logradouro;
            Numero = numero;
            Complemento = complemento;
            Bairro = bairro;
            Cidade = cidade;
            Estado = estado;
            CEP = cep;
        }

        private void Validar(string logradouro, string numero, string complemento, string bairro, string cidade, string estado)
        {
            if (string.IsNullOrWhiteSpace(logradouro))
                throw new LocalizacaoException("O logradouro não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(numero))
                throw new LocalizacaoException("O número não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(bairro))
                throw new LocalizacaoException("O bairro não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(cidade))
                throw new LocalizacaoException("A cidade não pode ser vazia.");

            if (string.IsNullOrWhiteSpace(estado))
                throw new LocalizacaoException("O estado não pode ser vazio.");
        }
    }
}