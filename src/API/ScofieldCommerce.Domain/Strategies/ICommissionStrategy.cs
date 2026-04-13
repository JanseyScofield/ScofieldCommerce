namespace ScofieldCommerce.Domain.Strategies
{
    public interface ICommissionStrategy
    {
        decimal CalcularComissao(decimal valorUnitario, int quantidade);
    }
}
