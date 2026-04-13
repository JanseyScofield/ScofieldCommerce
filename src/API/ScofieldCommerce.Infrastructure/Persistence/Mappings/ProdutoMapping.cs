using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Infrastructure.Persistence.Mappings
{
    public class ProdutoMapping : IEntityTypeConfiguration<Produto>
    {
        public void Configure(EntityTypeBuilder<Produto> builder)
        {
            builder.ToTable("Produtos");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Nome).IsRequired().HasMaxLength(150);
            builder.Property(p => p.Descricao).IsRequired().HasMaxLength(500);
            builder.Property(p => p.PrecoMinimo).IsRequired().HasColumnType("numeric(18,2)");
            builder.Property(p => p.PrecoMaximo).IsRequired().HasColumnType("numeric(18,2)");
            builder.Property(p => p.RegraComissaoId).IsRequired();
        }
    }
}
