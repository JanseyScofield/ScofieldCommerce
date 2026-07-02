using FluentAssertions;
using ScofieldCommerce.Domain.Strategies;
using Xunit;

namespace ScofieldCommerce.Tests.Application.Strategies
{
    public class CommissionStrategyTests
    {
        [Fact]
        public void BobinaEstrelaStrategy_Deve_Calcular_10_PorCento()
        {
            var strategy = new BobinaEstrelaStrategy();
            var resultado = strategy.CalcularComissao(200.00m, 1);
            resultado.Should().Be(20.0m);
        }

        [Fact]
        public void BobinaPicotadaStrategy_Deve_Calcular_5_PorCento()
        {
            var strategy = new BobinaPicotadaStrategy();
            var resultado = strategy.CalcularComissao(200.00m, 1);
            resultado.Should().Be(10.0m);
        }

        [Fact]
        public void SacoLixoStrategy_Deve_Calcular_5_PorCento()
        {
            var strategy = new SacoLixoStrategy();
            var resultado = strategy.CalcularComissao(200.00m, 1);
            resultado.Should().Be(10.0m);
        }

        [Fact]
        public void FilmePvcStrategy_Deve_Calcular_5_PorCento()
        {
            var strategy = new FilmePvcStrategy();
            var resultado = strategy.CalcularComissao(200.00m, 1);
            resultado.Should().Be(10.0m);
        }
    }
}
