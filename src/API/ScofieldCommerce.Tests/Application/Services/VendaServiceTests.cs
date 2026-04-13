using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Repositories;
using ScofieldCommerce.Application.Services;
using ScofieldCommerce.Domain.Strategies;
using ScofieldCommerce.Domain.Entities;
using ScofieldCommerce.Domain.Entities.Localizacao;
using ScofieldCommerce.Domain.Entities.Venda;
using Xunit;

namespace ScofieldCommerce.Tests.Application.Services
{
    public class VendaServiceTests
    {
        [Fact]
        public async Task RegistrarVendaAsync_Deve_SalvarVendaComComissaoCorreta()
        {
            // Arrange
            var mockVendaRepo = new Mock<IVendaRepository>();
            var mockProdutoRepo = new Mock<IProdutoRepository>();
            var mockClienteRepo = new Mock<IClienteRepository>();
            var mockUow = new Mock<IUnitOfWork>();
            var mockFactory = new Mock<ICommissionStrategyFactory>();

            var strategyBobina = new Mock<ICommissionStrategy>();
            strategyBobina.Setup(x => x.CalcularComissao(150.0m, 2)).Returns(15.0m); // mockando 10%

            mockFactory.Setup(f => f.GetStrategy(1)).Returns(strategyBobina.Object);

            var clienteResult = Cliente.Criar("Razao", "Fantasia", Endereco.Criar("Rua", "1", "", "B", "C", "ES", Cep.Criar("12345678").Data!).Data!, Cnpj.Criar("60409075000152").Data!, "1", "N", "11999999999");
            mockClienteRepo.Setup(c => c.ObterPorIdAsync(1)).ReturnsAsync(clienteResult.Data!);

            var produtoResult = Produto.Criar("Bobina 2kg", "Desc", 100.0m, 200.0m, 1);
            var produto = produtoResult.Data!;
            typeof(Produto).GetProperty("Id")!.SetValue(produto, 1L);
            mockProdutoRepo.Setup(p => p.ObterPorIdAsync(1)).ReturnsAsync(produto);

            var dto = new RegistrarVendaDto
            {
                ClienteId = 1,
                Produtos = new List<ProdutoVendidoDto>
                {
                    new ProdutoVendidoDto { ProdutoId = 1, Quantidade = 2, ValorUnitario = 150.0m }
                }
            };

            var service = new VendaService(mockVendaRepo.Object, mockProdutoRepo.Object, mockClienteRepo.Object, mockUow.Object, mockFactory.Object);

            // Act
            var result = await service.RegistrarVendaAsync(dto);

            // Assert
            result.IsSuccess.Should().BeTrue();
            mockVendaRepo.Verify(v => v.AdicionarAsync(It.Is<Venda>(x => x.ValorTotal == 300.0m && x.ComissaoTotal == 15.0m)), Times.Once);
            mockUow.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task ObterAjudaDeCustoGlobalAsync_Deve_Retornar100Cada10Mil()
        {
            // Arrange
            var mockVendaRepo = new Mock<IVendaRepository>();
            mockVendaRepo.Setup(v => v.ObterTotalVendasGlobalAsync()).ReturnsAsync(25000.0m);
            var service = new VendaService(mockVendaRepo.Object, null!, null!, null!, null!);

            // Act
            var result = await service.ObterAjudaDeCustoGlobalAsync();

            // Assert
            // 25.000 -> 2 x 10.000 = 200 reais
            result.IsSuccess.Should().BeTrue();
            result.Data.Should().Be(200.0m);
        }
    }
}
