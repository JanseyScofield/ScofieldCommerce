using System.Collections.Generic;

namespace ScofieldCommerce.Application.DTOs
{
    public class CalcularVendaDto
    {
        public List<ProdutoVendidoDto> Produtos { get; set; } = new List<ProdutoVendidoDto>();
    }
}
