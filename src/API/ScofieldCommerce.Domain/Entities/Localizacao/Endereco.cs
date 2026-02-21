using ScofieldCommerce.Domain.Entities.Exceptions;

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