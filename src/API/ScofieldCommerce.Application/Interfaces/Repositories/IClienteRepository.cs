using System.Collections.Generic;
using System.Threading.Tasks;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Application.Interfaces.Repositories
{
    public interface IClienteRepository
    {
        Task AdicionarAsync(Cliente cliente);
        Task AtualizarAsync(Cliente cliente);
        Task<Cliente?> ObterPorIdAsync(long id);
        // Methods for reading with Dapper
        Task<IEnumerable<dynamic>> RelatorioComprasPorMesAsync();
        Task<IEnumerable<dynamic>> RelatorioInatividadeAsync(int diasInativo);
        Task<IEnumerable<dynamic>> RelatorioValorCompradoPorProdutoAsync();
    }
}
