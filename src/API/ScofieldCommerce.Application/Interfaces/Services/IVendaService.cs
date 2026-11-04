using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Domain.Common;
using ScofieldCommerce.Domain.Entities.Venda;

namespace ScofieldCommerce.Application.Interfaces.Services
{
    public interface IVendaService
    {
        Task<Result<Venda>> RegistrarVendaAsync(RegistrarVendaDto dto);
        Task<Result<decimal>> ObterAjudaDeCustoGlobalAsync();
        Task<Result<CalculoVendaResultadoDto>> CalcularVendaAsync(CalcularVendaDto dto);
        Task<Result<IEnumerable<dynamic>>> ObterVendasFiltrosAsync(long? produtoId, System.DateTime? data, long? clienteId, bool? comissaoRecebida = null);
        Task<Result<bool>> DarBaixaComissaoAsync(long vendaId);
        Task<Result<dynamic>> ObterResumoComissoesAsync(System.DateTime? data = null);
    }
}
