using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ScofieldCommerce.Domain.Entities.Venda;

namespace ScofieldCommerce.Application.Interfaces.Repositories
{
    public interface IVendaRepository
    {
        Task AdicionarAsync(Venda venda);
        Task<Venda?> ObterPorIdAsync(long id);
        Task<dynamic> ObterResumoComissoesAsync(DateTime? data = null);
        Task<IEnumerable<dynamic>> ObterVendasFiltrosAsync(long? produtoId, DateTime? data, long? clienteId, bool? comissaoRecebida = null);
        Task<IEnumerable<dynamic>> RelatorioVendasDiaAsync(int? mes = null, int? ano = null);
        Task<IEnumerable<dynamic>> RelatorioVendasMesAsync(int? ano = null);
        Task<IEnumerable<dynamic>> RelatorioVendasClienteAsync();
        Task<decimal> ObterTotalVendasGlobalAsync();
    }
}
