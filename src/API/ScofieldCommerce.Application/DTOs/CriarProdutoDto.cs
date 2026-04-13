namespace ScofieldCommerce.Application.DTOs
{
    public class CriarProdutoDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal PrecoMinimo { get; set; }
        public decimal PrecoMaximo { get; set; }
        public byte RegraComissaoId { get; set; }
    }
}
