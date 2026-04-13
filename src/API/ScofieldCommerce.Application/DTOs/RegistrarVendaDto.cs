using System.Collections.Generic;

namespace ScofieldCommerce.Application.DTOs
{
    public class RegistrarVendaDto
    {
        public long ClienteId { get; set; }
        public sbyte PrazoPagamentoDias { get; set; }
        public bool PossuiNotaFiscal { get; set; }
        public List<ProdutoVendidoDto> Produtos { get; set; } = new List<ProdutoVendidoDto>();
    }
}
