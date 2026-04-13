using System.Collections.Generic;
using System.Threading.Tasks;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Application.Interfaces.Repositories
{
    public interface IProdutoRepository
    {
        Task AdicionarAsync(Produto produto);
        Task AtualizarAsync(Produto produto);
        Task<Produto?> ObterPorIdAsync(long id);
        Task<IEnumerable<Produto>> ObterTodosAsync();
    }
}
