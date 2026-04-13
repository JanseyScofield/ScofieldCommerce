using Microsoft.EntityFrameworkCore;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Domain.Entities.Venda;

namespace ScofieldCommerce.Infrastructure.Persistence
{
    public class ScofieldDbContext : DbContext
    {
        public ScofieldDbContext(DbContextOptions<ScofieldDbContext> options) : base(options) { }

        public DbSet<Cliente> Clientes => Set<Cliente>();
        public DbSet<Produto> Produtos => Set<Produto>();
        public DbSet<Venda> Vendas => Set<Venda>();
        public DbSet<ProdutoVendido> ProdutosVendidos => Set<ProdutoVendido>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ScofieldDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }
    }
}
