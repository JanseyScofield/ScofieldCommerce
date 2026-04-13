using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Mvc;
using ScofieldCommerce.Application.DTOs;
using ScofieldCommerce.Application.Interfaces.Services;
using ScofieldCommerce.Application.Interfaces.Repositories;

namespace ScofieldCommerce.API.Endpoints
{
    public static class VendasEndpoints
    {
        public static void MapVendasEndpoints(this IEndpointRouteBuilder app)
        {
            var group = app.MapGroup("/vendas").WithTags("Vendas");

            group.MapPost("/", async ([FromBody] RegistrarVendaDto dto, IVendaService service) =>
            {
                await service.RegistrarVendaAsync(dto);
                return Results.Ok(new { Mensagem = "Venda registrada com sucesso." });
            });
            
            group.MapGet("/", async ([FromQuery] long? produtoId, [FromQuery] System.DateTime? data, [FromQuery] long? clienteId, IVendaRepository repo) =>
            {
                return Results.Ok(await repo.ObterVendasFiltrosAsync(produtoId, data, clienteId));
            });

            group.MapGet("/ajuda-custo", async (IVendaService service) =>
            {
                var ajuda = await service.ObterAjudaDeCustoGlobalAsync();
                return Results.Ok(new { AjudaDeCustoAcumulada = ajuda });
            });
        }
    }
}
