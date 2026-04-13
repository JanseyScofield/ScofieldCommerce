namespace ScofieldCommerce.Domain.Strategies
{
    public class FilmePvcStrategy : ICommissionStrategy
    {
        public decimal CalcularComissao(decimal valorUnitario, int quantidade)
        {
            var valorTotalItem = valorUnitario * quantidade;

            if (valorUnitario >= 100.00m && valorUnitario <= 119.00m)
            {
                return valorTotalItem * 0.05m;
            }
            else if (valorUnitario >= 120.00m)
            {
                return valorTotalItem * 0.10m;
            }
            
            return 0;
        }
    }
}
