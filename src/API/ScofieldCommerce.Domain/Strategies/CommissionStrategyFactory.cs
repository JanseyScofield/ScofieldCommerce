using System.Collections.Generic;
using System.Linq;

namespace ScofieldCommerce.Domain.Strategies
{
    public interface ICommissionStrategyFactory
    {
        ICommissionStrategy GetStrategy(string productName);
    }

    public class CommissionStrategyFactory : ICommissionStrategyFactory
    {
        public ICommissionStrategy GetStrategy(string productName)
        {
            if (string.IsNullOrWhiteSpace(productName))
                return new BobinaPicotadaStrategy(); // Default fallback

            var name = productName.ToLowerInvariant().Replace(" ", "");

            if (name.Contains("bobinaestrela"))
                return new BobinaEstrelaStrategy();
            
            if (name.Contains("bobinapicotada"))
                return new BobinaPicotadaStrategy();

            if (name.Contains("sacolixo") || name.Contains("sacodelixo"))
                return new SacoLixoStrategy();

            if (name.Contains("filmepvc"))
                return new FilmePvcStrategy();

            // Default fallback
            return new BobinaPicotadaStrategy();
        }
    }
}
