using System.Collections.Generic;

namespace ScofieldCommerce.Domain.Strategies
{
    public interface ICommissionStrategyFactory
    {
        ICommissionStrategy GetStrategy(byte regraComissaoId);
    }

    public class CommissionStrategyFactory : ICommissionStrategyFactory
    {
        private readonly Dictionary<byte, ICommissionStrategy> _strategies;

        public CommissionStrategyFactory()
        {
            _strategies = new Dictionary<byte, ICommissionStrategy>
            {
                { 1, new BobinaStrategy() },
                { 2, new FilmePvcStrategy() },
                { 3, new FixoStrategy() } // Sacola e Saco de lixo
            };
        }

        public ICommissionStrategy GetStrategy(byte regraComissaoId)
        {
            if (_strategies.TryGetValue(regraComissaoId, out var strategy))
            {
                return strategy;
            }
            
            throw new System.Exception($"Regra de comissão {regraComissaoId} não mapeada ou inexistente.");
        }
    }
}
