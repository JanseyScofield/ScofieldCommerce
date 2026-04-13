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
    }
}
