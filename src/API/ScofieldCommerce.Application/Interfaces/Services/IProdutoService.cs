using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;

namespace ScofieldCommerce.Application.Interfaces.Services
{
    public interface IProdutoService
    {
        Task CadastrarAsync(CriarProdutoDto dto);
    }
}
