using ScofieldCommerce.Domain.Entities.Exceptions;

namespace ScofieldCommerce.Domain.Entities
{
    public class Cnpj
    {
        public string Valor { get; private set; } = null!;

        protected Cnpj() { }
        public Cnpj(string valor)
        {
            Validar(valor);
            Valor = valor;
        }

        public void Atualizar(string valor)
        {
            Validar(valor);
            Valor = valor;
        }

        private void Validar(string valor)
        {
            string mensagemErro = "O CNPJ é inválido.";

            if (string.IsNullOrWhiteSpace(valor))
                throw new ClienteException(mensagemErro);

            if (valor.Length != 14)
                throw new ClienteException(mensagemErro);

            if (!valor.All(char.IsDigit))
                throw new ClienteException(mensagemErro);

            if (TodosDigitosIguais(valor))
                throw new ClienteException(mensagemErro);
            
            if (!ValidarDigitosVerificadores(valor))
                throw new ClienteException(mensagemErro);
        }

        private bool TodosDigitosIguais(string valor)
        {
            char primeiroDigito = valor[0];
            foreach (char digito in valor)
            {
                if (digito != primeiroDigito)
                {
                    return false;
                }
            }
            return true;
        }

        private bool ValidarDigitosVerificadores(string valor)
        {
            int[] multiplicadores1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicadores2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            string cnpjSemDigitos = valor.Substring(0, 12);
            string digitos = valor.Substring(12);

            int soma1 = CalcularSomaDigitos(cnpjSemDigitos, multiplicadores1);
            int resto1 = soma1 % 11;
            int digitoVerificador1 = resto1 < 2 ? 0 : 11 - resto1;

            if (digitoVerificador1 != int.Parse(digitos[0].ToString())) return false;

            int soma2 = CalcularSomaDigitos(cnpjSemDigitos + digitoVerificador1.ToString(), multiplicadores2);
            int resto2 = soma2 % 11;
            int digitoVerificador2 = resto2 < 2 ? 0 : 11 - resto2;
            
            if (digitoVerificador2 != int.Parse(digitos[1].ToString())) return false;

            return true;
        }

        private int CalcularSomaDigitos(string valor, int[] multiplicadores)
        {
            int soma = 0;
            for (int i = 0; i < multiplicadores.Length; i++)
            {
                soma += (valor[i] - '0') * multiplicadores[i];
            }
            return soma;
        }

        public override string ToString()
        {
            return Valor;
        }

        public override bool Equals(object? obj)
        {
            if (obj is Cnpj other)
                return Valor == other.Valor;

            return false;
        }
    }
}