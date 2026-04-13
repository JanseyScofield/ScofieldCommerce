using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Services;
using ScofieldCommerce.Domain.Entities;
using Xunit;

namespace ScofieldCommerce.Tests.Application.Services
{
    public class ProdutoServiceTests
    {
        [Fact]
        public async Task CadastrarAsync_Deve_SalvarNovoProdutoNoRepositorioEComitar()
        {
            // Arrange
            var mockProdutoRepo = new Mock<IProdutoRepository>();
            var mockUow = new Mock<IUnitOfWork>();

            var service = new ProdutoService(mockProdutoRepo.Object, mockUow.Object);

            var dto = new CriarProdutoDto
            {
                Nome = "Bobina Plástica",
                Descricao = "Bobina de Alta Densidade",
                PrecoMinimo = 5.0m,
                PrecoMaximo = 15.0m,
                RegraComissaoId = 1
            };

            // Act
            var result = await service.CadastrarAsync(dto);

            // Assert
            result.IsSuccess.Should().BeTrue();
            mockProdutoRepo.Verify(r => r.AdicionarAsync(It.Is<Produto>(p => 
                p.Nome == dto.Nome && 
                p.PrecoMinimo == dto.PrecoMinimo)), Times.Once);

            mockUow.Verify(u => u.CommitAsync(), Times.Once);
        }
    }
}
