namespace ScofieldCommerce.Domain.Strategies
{
    public class BobinaPicotadaStrategy : ICommissionStrategy
    {
        public decimal CalcularComissao(decimal valorUnitario, int quantidade)
        {
            var valorTotalItem = valorUnitario * quantidade;
            return valorTotalItem * 0.05m;
        }
    }
}
