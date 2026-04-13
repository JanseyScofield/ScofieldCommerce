using ScofieldCommerce.Domain.Common;
using ScofieldCommerce.Domain.Entities.Localizacao;

namespace ScofieldCommerce.Domain.Entities
{
    public class Cliente
    {
        public long Id { get; private set; }
        public string RazaoSocial { get; private set; } = null!;
        public string NomeFantasia { get; private set; } = null!;
        public Endereco Endereco { get; private set; } = null!;
        public Cnpj Cnpj { get; private set; } = null!;
        public string InscricaoEstadual { get; private set; } = null!;
        public string NomeComprador { get; private set; } = null!;
        public string TelefoneComprador { get; private set; } = null!;

        protected Cliente() { }

        private Cliente
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            Endereco = endereco;
            Cnpj = cnpj;
            InscricaoEstadual = inscricaoEstadual;
            NomeComprador = nomeComprador;
            TelefoneComprador = telefoneComprador;
        }

        public static Result<Cliente> Criar
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            var validacao = Validar(razaoSocial, nomeFantasia, endereco, cnpj, inscricaoEstadual, nomeComprador, telefoneComprador);
            if (!validacao.IsSuccess) return Result<Cliente>.Error(validacao.ErrorMessage!);

            return Result<Cliente>.Ok(new Cliente(razaoSocial, nomeFantasia, endereco, cnpj, inscricaoEstadual, nomeComprador, telefoneComprador));
        }

        public Result<bool> Atualizar
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            var validacao = Validar(razaoSocial, nomeFantasia, endereco, cnpj, inscricaoEstadual, nomeComprador, telefoneComprador);
            if (!validacao.IsSuccess) return Result<bool>.Error(validacao.ErrorMessage!);

            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            Endereco = endereco;
            Cnpj = cnpj;
            InscricaoEstadual = inscricaoEstadual;
            NomeComprador = nomeComprador;
            TelefoneComprador = telefoneComprador;

            return Result<bool>.Ok(true);
        }

        private static Result<bool> Validar
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            if (string.IsNullOrWhiteSpace(razaoSocial)) return Result<bool>.Error("A razão social não pode ser vazia.");
            if (string.IsNullOrWhiteSpace(nomeFantasia)) return Result<bool>.Error("O nome fantasia não pode ser vazio.");
            if (endereco == null) return Result<bool>.Error("O endereço é obrigatório.");
            if (cnpj == null) return Result<bool>.Error("O CNPJ é obrigatório.");
            if (string.IsNullOrWhiteSpace(inscricaoEstadual)) return Result<bool>.Error("A inscrição estadual não pode ser vazia.");
            if (string.IsNullOrWhiteSpace(nomeComprador)) return Result<bool>.Error("O nome do comprador não pode ser vazio.");
            if (string.IsNullOrWhiteSpace(telefoneComprador)) return Result<bool>.Error("O telefone do comprador não pode ser vazio.");

            return Result<bool>.Ok(true);
        }

        public override string ToString()
        {
            return $"{RazaoSocial} ({NomeFantasia}) - CNPJ: {Cnpj}, Endereço: {Endereco}, Comprador: {NomeComprador}, Telefone: {TelefoneComprador}";
        }

      public override bool Equals(object? obj)
        {
            if (obj is not Cliente other)
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