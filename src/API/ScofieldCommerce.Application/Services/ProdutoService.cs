using System;
using System.Threading.Tasks;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Domain.Common;
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

        public async Task<Result<Produto>> CadastrarAsync(CriarProdutoDto dto)
        {
            try
            {
                var produtoResult = Produto.Criar(dto.Nome, dto.Descricao, dto.PrecoMinimo, dto.PrecoMaximo, dto.RegraComissaoId);
                
                if (!produtoResult.IsSuccess) 
                    return Result<Produto>.Error(produtoResult.ErrorMessage!);

                await _produtoRepository.AdicionarAsync(produtoResult.Data!);
                await _uow.CommitAsync();
                
                return Result<Produto>.Ok(produtoResult.Data!);
            }
            catch (Exception ex)
            {
                return Result<Produto>.Error($"Erro interno ao cadastrar produto: {ex.Message}");
            }
        }
    }
}
