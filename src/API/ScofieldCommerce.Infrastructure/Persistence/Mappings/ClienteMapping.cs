using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Infrastructure.Persistence.Mappings
{
    public class ClienteMapping : IEntityTypeConfiguration<Cliente>
    {
        public void Configure(EntityTypeBuilder<Cliente> builder)
        {
            builder.ToTable("Clientes");

            builder.HasKey(c => c.Id);
            
            builder.Property(c => c.RazaoSocial).IsRequired().HasMaxLength(200);
            builder.Property(c => c.NomeFantasia).IsRequired().HasMaxLength(200);
            builder.Property(c => c.InscricaoEstadual).IsRequired().HasMaxLength(50);
            builder.Property(c => c.NomeComprador).IsRequired().HasMaxLength(150);
            builder.Property(c => c.TelefoneComprador).IsRequired().HasMaxLength(20);

            // OwnsOne for Value Objects
            builder.OwnsOne(c => c.Cnpj, cb =>
            {
                cb.Property(c => c.Valor).HasColumnName("Cnpj").IsRequired().HasMaxLength(14);
            });

            builder.OwnsOne(c => c.Endereco, eb =>
            {
                eb.OwnsOne(e => e.CEP, cb =>
                {
                    cb.Property(c => c.Valor).HasColumnName("Cep").IsRequired().HasMaxLength(8);
                });
                eb.Property(e => e.Logradouro).HasColumnName("Logradouro").IsRequired().HasMaxLength(200);
                eb.Property(e => e.Numero).HasColumnName("Numero").IsRequired().HasMaxLength(20);
                eb.Property(e => e.Complemento).HasColumnName("Complemento").IsRequired(false).HasMaxLength(100);
                eb.Property(e => e.Bairro).HasColumnName("Bairro").IsRequired().HasMaxLength(100);
                eb.Property(e => e.Cidade).HasColumnName("Cidade").IsRequired().HasMaxLength(100);
                eb.Property(e => e.Estado).HasColumnName("Estado").IsRequired().HasMaxLength(2);
            });
        }
    }
}
