using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ScofieldCommerce.Domain.Entities.Venda;

namespace ScofieldCommerce.Infrastructure.Persistence.Mappings
{
    public class VendaMapping : IEntityTypeConfiguration<Venda>
    {
        public void Configure(EntityTypeBuilder<Venda> builder)
        {
            builder.ToTable("Vendas");

            builder.HasKey(v => v.Id);

            builder.Property(v => v.ValorTotal).IsRequired().HasColumnType("numeric(18,2)");
            builder.Property(v => v.ComissaoTotal).IsRequired().HasColumnType("numeric(18,2)");
            builder.Property(v => v.DataVenda).IsRequired();

            builder.HasOne(v => v.Cliente)
                   .WithMany()
                   .HasForeignKey(v => v.ClienteId);

            builder.HasMany(v => v.ProdutosVendidos)
                   .WithOne(p => p.Venda)
                   .HasForeignKey(p => p.VendaId);
        }
    }

    public class ProdutoVendidoMapping : IEntityTypeConfiguration<ProdutoVendido>
    {
        public void Configure(EntityTypeBuilder<ProdutoVendido> builder)
        {
            builder.ToTable("ProdutosVendidos");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.ValorUnitario).IsRequired().HasColumnType("numeric(18,2)");
            builder.Property(p => p.Quantidade).IsRequired();

            builder.HasOne(p => p.Produto)
                   .WithMany()
                   .HasForeignKey(p => p.ProdutoId);
        }
    }
}
