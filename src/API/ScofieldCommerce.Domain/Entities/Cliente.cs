using ScofieldCommerce.Domain.Entities.Localizacao;
using ScofieldCommerce.Domain.Entities.Exceptions;

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

        public Cliente
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            Validar(razaoSocial, nomeFantasia, endereco, cnpj, inscricaoEstadual, nomeComprador, telefoneComprador);
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            Endereco = endereco;
            Cnpj = cnpj;
            InscricaoEstadual = inscricaoEstadual;
            NomeComprador = nomeComprador;
            TelefoneComprador = telefoneComprador;
        }

        public void Atualizar
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            Validar(razaoSocial, nomeFantasia, endereco, cnpj, inscricaoEstadual, nomeComprador, telefoneComprador);
            RazaoSocial = razaoSocial;
            NomeFantasia = nomeFantasia;
            Endereco = endereco;
            Cnpj = cnpj;
            InscricaoEstadual = inscricaoEstadual;
            NomeComprador = nomeComprador;
            TelefoneComprador = telefoneComprador;
        }

        private void Validar
        (
            string razaoSocial, string nomeFantasia, Endereco endereco, Cnpj cnpj, string inscricaoEstadual, 
            string nomeComprador, string telefoneComprador
        )
        {
            if (string.IsNullOrWhiteSpace(razaoSocial))
                throw new ClienteException("A razão social não pode ser vazia.");

            if (string.IsNullOrWhiteSpace(nomeFantasia))
                throw new ClienteException("O nome fantasia não pode ser vazio.");

            if (endereco == null)
                throw new ClienteException("O endereço é obrigatório.");

            if (cnpj == null)
                throw new ClienteException("O CNPJ é obrigatório.");

            if (string.IsNullOrWhiteSpace(inscricaoEstadual))
                throw new ClienteException("A inscrição estadual não pode ser vazia.");

            if (string.IsNullOrWhiteSpace(nomeComprador))
                throw new ClienteException("O nome do comprador não pode ser vazio.");

            if (string.IsNullOrWhiteSpace(telefoneComprador))
                throw new ClienteException("O telefone do comprador não pode ser vazio.");
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