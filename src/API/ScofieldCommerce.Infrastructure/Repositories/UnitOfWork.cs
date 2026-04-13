using System.Threading.Tasks;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Infrastructure.Persistence;

namespace ScofieldCommerce.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ScofieldDbContext _context;

        public UnitOfWork(ScofieldDbContext context)
        {
            _context = context;
        }

        public async Task<bool> CommitAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
