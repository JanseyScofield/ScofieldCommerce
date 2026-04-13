namespace ScofieldCommerce.Domain.Strategies
{
    public class FixoStrategy : ICommissionStrategy
    {
        public decimal CalcularComissao(decimal valorUnitario, int quantidade)
        {
            var valorTotalItem = valorUnitario * quantidade;
            return valorTotalItem * 0.05m; // Fixo em 5%
        }
    }
}
