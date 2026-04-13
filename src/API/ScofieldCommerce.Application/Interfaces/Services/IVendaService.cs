using System.Threading.Tasks;

namespace ScofieldCommerce.Application.Interfaces.Services
{
    public interface IVendaService
    {
        Task RegistrarVendaAsync(DTOs.RegistrarVendaDto dto);
        Task<decimal> ObterAjudaDeCustoGlobalAsync();
    }
}
