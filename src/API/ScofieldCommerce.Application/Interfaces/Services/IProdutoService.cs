using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Domain.Common;

namespace ScofieldCommerce.Application.Interfaces.Services
{
    public interface IProdutoService
    {
        Task<Result<Produto>> CadastrarAsync(CriarProdutoDto dto);
    }
}
