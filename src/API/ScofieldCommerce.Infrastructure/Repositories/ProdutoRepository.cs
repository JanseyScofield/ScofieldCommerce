using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Infrastructure.Persistence;

namespace ScofieldCommerce.Infrastructure.Repositories
{
    public class ProdutoRepository : IProdutoRepository
    {
        private readonly ScofieldDbContext _context;

        public ProdutoRepository(ScofieldDbContext context)
        {
            _context = context;
        }

        public async Task AdicionarAsync(Produto produto)
        {
            await _context.Produtos.AddAsync(produto);
        }

        public async Task AtualizarAsync(Produto produto)
        {
            _context.Produtos.Update(produto);
            await Task.CompletedTask;
        }

        public async Task<Produto?> ObterPorIdAsync(long id)
        {
            return await _context.Produtos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Produto>> ObterTodosAsync()
        {
            return await _context.Produtos.ToListAsync();
        }
    }
}
