namespace ScofieldCommerce.Domain.Strategies
{
    public class BobinaEstrelaStrategy : ICommissionStrategy
    {
        public decimal CalcularComissao(decimal valorUnitario, int quantidade)
        {
            var valorTotalItem = valorUnitario * quantidade;
            return valorTotalItem * 0.10m;
        }
    }
}
