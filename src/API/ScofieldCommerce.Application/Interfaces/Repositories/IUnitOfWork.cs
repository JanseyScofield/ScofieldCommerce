using System.Threading.Tasks;

namespace ScofieldCommerce.Application.Interfaces.Repositories
{
    public interface IUnitOfWork
    {
        Task<bool> CommitAsync();
    }
}
