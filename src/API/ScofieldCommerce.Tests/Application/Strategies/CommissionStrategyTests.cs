using FluentAssertions;
using ScofieldCommerce.Domain.Strategies;
using Xunit;

namespace ScofieldCommerce.Tests.Application.Strategies
{
    public class CommissionStrategyTests
    {
        [Theory]
        [InlineData(100.00, 10, 50.0)] // 5% de 1000
        [InlineData(119.00, 1, 5.95)] // 5% de 119
        [InlineData(120.00, 10, 120.0)] // 10% de 1200
        [InlineData(90.00, 10, 0.0)] // zero
        public void FilmePvcStrategy_Deve_Calcular_Corretamente(decimal valorUnitario, int qtd, decimal esperado)
        {
            var strategy = new FilmePvcStrategy();
            var resultado = strategy.CalcularComissao(valorUnitario, qtd);
            resultado.Should().Be(esperado);
        }

        [Theory]
        [InlineData(150.00, 10, 75.0)] // 5% de 1500
        [InlineData(169.00, 1, 8.45)] // 5%
        [InlineData(170.00, 10, 170.0)] // 10% de 1700
        [InlineData(140.00, 10, 0.0)] // zero
        public void BobinaStrategy_Deve_Calcular_Corretamente(decimal valorUnitario, int qtd, decimal esperado)
        {
            var strategy = new BobinaStrategy();
            var resultado = strategy.CalcularComissao(valorUnitario, qtd);
            resultado.Should().Be(esperado);
        }

        [Fact]
        public void FixoStrategy_Deve_Sempre_Calcular_5_PorCento()
        {
            var strategy = new FixoStrategy();
            var resultado = strategy.CalcularComissao(200.00m, 1);
            resultado.Should().Be(10.0m);
        }
    }
}
