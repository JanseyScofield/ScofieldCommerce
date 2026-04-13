using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Domain.Entities;

namespace ScofieldCommerce.Application.Services
{
    public class ProdutoService : IProdutoService
    {
        private readonly IProdutoRepository _produtoRepository;
        private readonly IUnitOfWork _uow;

        public ProdutoService(IProdutoRepository produtoRepository, IUnitOfWork uow)
        {
            _produtoRepository = produtoRepository;
            _uow = uow;
        }

        public async Task CadastrarAsync(CriarProdutoDto dto)
        {
            var produto = new Produto(dto.Nome, dto.Descricao, dto.PrecoMinimo, dto.PrecoMaximo, dto.RegraComissaoId);

            await _produtoRepository.AdicionarAsync(produto);
            await _uow.CommitAsync();
        }
    }
}
