namespace ScofieldCommerce.Domain.Strategies
{
    public class BobinaStrategy : ICommissionStrategy
    {
        public decimal CalcularComissao(decimal valorUnitario, int quantidade)
        {
            var valorTotalItem = valorUnitario * quantidade;

            if (valorUnitario >= 150.00m && valorUnitario <= 169.00m)
            {
                return valorTotalItem * 0.05m;
            }
            else if (valorUnitario >= 170.00m)
            {
                return valorTotalItem * 0.10m;
            }
            return 0;
        }
    }
}
