using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Domain.Common;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Application.Interfaces.Services
{
    public interface IClienteService
    {
        Task<Result<Cliente>> CadastrarAsync(CriarClienteDto dto);
    }
}
