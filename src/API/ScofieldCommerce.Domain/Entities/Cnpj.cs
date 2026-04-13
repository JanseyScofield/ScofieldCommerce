using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Domain.Entities
{
    public class Cnpj
    {
        public string Valor { get; private set; } = null!;

        protected Cnpj() { }
        private Cnpj(string valor)
        {
            Valor = valor;
        }

        public static Result<Cnpj> Criar(string valor)
        {
            var validacao = Validar(valor);
            if (!validacao.IsSuccess) return Result<Cnpj>.Error(validacao.ErrorMessage!);

            return Result<Cnpj>.Ok(new Cnpj(valor));
        }

        public Result<bool> Atualizar(string valor)
        {
            var validacao = Validar(valor);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            Valor = valor;
            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar(string valor)
        {
            string mensagemErro = "O CNPJ é inválido.";

            if (string.IsNullOrWhiteSpace(valor) || valor.Length != 14 || !valor.All(char.IsDigit) || TodosDigitosIguais(valor) || !ValidarDigitosVerificadores(valor))
                return Result<bool>.Error(mensagemErro);

            return Result<bool>.Ok(true);
        }

        private static bool TodosDigitosIguais(string valor)
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

        private static bool ValidarDigitosVerificadores(string valor)
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

        private static int CalcularSomaDigitos(string valor, int[] multiplicadores)
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

        public override int GetHashCode()
        {
            return Valor.GetHashCode();
        }
    }
}