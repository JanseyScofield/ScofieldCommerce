using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ScofieldCommerce.Domain.Entities.Venda;

namespace ScofieldCommerce.Application.Interfaces.Repositories
{
    public interface IVendaRepository
    {
        Task AdicionarAsync(Venda venda);
        Task<IEnumerable<dynamic>> ObterVendasFiltrosAsync(long? produtoId, DateTime? data, long? clienteId);
        Task<IEnumerable<dynamic>> RelatorioVendasDiaAsync();
        Task<IEnumerable<dynamic>> RelatorioVendasMesAsync();
        Task<IEnumerable<dynamic>> RelatorioVendasClienteAsync();
        Task<decimal> ObterTotalVendasGlobalAsync();
    }
}
