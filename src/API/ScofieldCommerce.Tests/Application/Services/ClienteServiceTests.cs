using System;
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
    public class ClienteServiceTests
    {
        [Fact]
        public async Task CadastrarAsync_Deve_SalvarNovoClienteNoRepositorioEComitar()
        {
            // Arrange
            var mockClienteRepo = new Mock<IClienteRepository>();
            var mockUow = new Mock<IUnitOfWork>();

            var service = new ClienteService(mockClienteRepo.Object, mockUow.Object);

            var dto = new CriarClienteDto
            {
                RazaoSocial = "Empresa Ficticia LTDA",
                NomeFantasia = "Ficticia",
                Cep = "12345678",
                Logradouro = "Rua Principal",
                Numero = "100",
                Complemento = "Sala 1",
                Bairro = "Centro",
                Cidade = "São Paulo",
                Estado = "SP",
                Cnpj = "60409075000152", // CNPJ Valido
                InscricaoEstadual = "123456789",
                NomeComprador = "João",
                TelefoneComprador = "11999999999"
            };

            // Act
            await service.CadastrarAsync(dto);

            // Assert
            mockClienteRepo.Verify(r => r.AdicionarAsync(It.Is<Cliente>(c => 
                c.RazaoSocial == dto.RazaoSocial && 
                c.Cnpj.Valor == dto.Cnpj)), Times.Once);

            mockUow.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task CadastrarAsync_ComCnpjInvalido_DeveLancarExcecao()
        {
            // Arrange
            var mockClienteRepo = new Mock<IClienteRepository>();
            var mockUow = new Mock<IUnitOfWork>();

            var service = new ClienteService(mockClienteRepo.Object, mockUow.Object);

            var dto = new CriarClienteDto
            {
                RazaoSocial = "Empresa Ficticia LTDA",
                NomeFantasia = "Ficticia",
                Cep = "12345678",
                Logradouro = "Rua Principal",
                Numero = "100",
                Complemento = "Sala 1",
                Bairro = "Centro",
                Cidade = "São Paulo",
                Estado = "SP",
                Cnpj = "11111111111111", // CNPJ Invalido
                InscricaoEstadual = "123456789",
                NomeComprador = "João",
                TelefoneComprador = "11999999999"
            };

            // Act
            Func<Task> function = async () => await service.CadastrarAsync(dto);

            // Assert
            await function.Should().ThrowAsync<Exception>().WithMessage("O CNPJ é inválido.");
        }
    }
}
